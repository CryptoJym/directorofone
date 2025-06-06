import prisma from '../config/database';
import { Workflow, WorkflowType, ExecutionStatus, Prisma } from '../generated/prisma';

export class WorkflowRepository {
  /**
   * Create a new workflow
   */
  async create(data: {
    userId: string;
    name: string;
    description: string;
    type: WorkflowType;
    trigger: any;
    actions: any;
    frequency: string;
  }): Promise<Workflow> {
    return prisma.workflow.create({
      data: {
        ...data,
        trigger: data.trigger || {},
        actions: data.actions || {},
        isActive: true,
        nextRunAt: this.calculateNextRun(data.frequency),
      },
      include: {
        user: true,
        executions: {
          take: 5,
          orderBy: { startedAt: 'desc' },
        },
      },
    });
  }

  /**
   * Find workflow by ID
   */
  async findById(id: string): Promise<Workflow | null> {
    return prisma.workflow.findUnique({
      where: { id },
      include: {
        user: true,
        executions: {
          take: 10,
          orderBy: { startedAt: 'desc' },
        },
        tasks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Get all workflows for a user
   */
  async findByUserId(
    userId: string,
    params?: {
      type?: WorkflowType;
      isActive?: boolean;
      skip?: number;
      take?: number;
    }
  ): Promise<{ workflows: Workflow[]; total: number }> {
    const { type, isActive, skip = 0, take = 10 } = params || {};

    const where: Prisma.WorkflowWhereInput = { userId };
    if (type !== undefined) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          executions: {
            take: 1,
            orderBy: { startedAt: 'desc' },
          },
        },
      }),
      prisma.workflow.count({ where }),
    ]);

    return { workflows, total };
  }

  /**
   * Update workflow
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      trigger: any;
      actions: any;
      frequency: string;
      isActive: boolean;
    }>
  ): Promise<Workflow> {
    const updateData: any = { ...data };
    
    if (data.frequency) {
      updateData.nextRunAt = this.calculateNextRun(data.frequency);
    }

    return prisma.workflow.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        executions: {
          take: 5,
          orderBy: { startedAt: 'desc' },
        },
      },
    });
  }

  /**
   * Toggle workflow active status
   */
  async toggleActive(id: string): Promise<Workflow> {
    const workflow = await this.findById(id);
    if (!workflow) throw new Error('Workflow not found');

    return this.update(id, { isActive: !workflow.isActive });
  }

  /**
   * Delete workflow
   */
  async delete(id: string): Promise<void> {
    await prisma.workflow.delete({
      where: { id },
    });
  }

  /**
   * Execute workflow
   */
  async execute(workflowId: string): Promise<void> {
    const workflow = await this.findById(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    if (!workflow.isActive) throw new Error('Workflow is not active');

    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        status: ExecutionStatus.RUNNING,
      },
    });

    try {
      // TODO: Implement actual workflow execution logic
      // This would involve processing the trigger and actions
      
      // For now, simulate execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark execution as successful
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          result: { message: 'Workflow executed successfully' },
        },
      });

      // Update workflow last run time
      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          lastRunAt: new Date(),
          nextRunAt: this.calculateNextRun(workflow.frequency),
        },
      });
    } catch (error) {
      // Mark execution as failed
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.FAILED,
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Get workflows due for execution
   */
  async getDueWorkflows(): Promise<Workflow[]> {
    return prisma.workflow.findMany({
      where: {
        isActive: true,
        nextRunAt: {
          lte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * Get workflow statistics
   */
  async getStats(userId: string): Promise<{
    total: number;
    active: number;
    byType: Record<string, number>;
    recentExecutions: number;
    successRate: number;
  }> {
    const [workflows, recentExecutions] = await Promise.all([
      prisma.workflow.findMany({
        where: { userId },
        include: {
          executions: {
            where: {
              startedAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
              },
            },
          },
        },
      }),
      prisma.workflowExecution.findMany({
        where: {
          workflow: { userId },
          startedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const byType: Record<string, number> = {};
    let active = 0;

    workflows.forEach(workflow => {
      if (workflow.isActive) active++;
      byType[workflow.type] = (byType[workflow.type] || 0) + 1;
    });

    const successfulExecutions = recentExecutions.filter(
      e => e.status === ExecutionStatus.SUCCESS
    ).length;
    const successRate = recentExecutions.length > 0
      ? (successfulExecutions / recentExecutions.length) * 100
      : 0;

    return {
      total: workflows.length,
      active,
      byType,
      recentExecutions: recentExecutions.length,
      successRate,
    };
  }

  /**
   * Calculate next run time based on frequency
   */
  private calculateNextRun(frequency: string): Date {
    const now = new Date();
    
    switch (frequency.toLowerCase()) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'real-time':
      case 'on-trigger':
        return now; // These run immediately when triggered
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to daily
    }
  }
}

export default new WorkflowRepository();