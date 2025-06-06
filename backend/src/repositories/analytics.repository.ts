import prisma from '../config/database';
import { Analytics, Prisma } from '../generated/prisma';

export class AnalyticsRepository {
  /**
   * Record analytics data
   */
  async record(data: {
    userId: string;
    timeSaved: number;
    tasksAutomated: number;
    efficiencyScore: number;
    activeWorkflows: number;
    metadata?: any;
  }): Promise<Analytics> {
    return prisma.analytics.create({
      data: {
        ...data,
        date: new Date(),
      },
    });
  }

  /**
   * Get analytics for a specific date range
   */
  async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Analytics[]> {
    return prisma.analytics.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Get latest analytics entry for a user
   */
  async getLatest(userId: string): Promise<Analytics | null> {
    return prisma.analytics.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Get analytics summary for a user
   */
  async getSummary(userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<{
    timeSaved: { total: number; average: number; trend: number };
    tasksAutomated: { total: number; average: number; trend: number };
    efficiencyScore: { current: number; average: number; trend: number };
    activeWorkflows: { current: number; peak: number; average: number };
    periodStart: Date;
    periodEnd: Date;
  }> {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
    }

    // Get current period data
    const currentData = await this.getByDateRange(userId, startDate, now);
    
    // Get previous period data for trend calculation
    const previousData = await this.getByDateRange(
      userId,
      previousStartDate,
      startDate
    );

    // Calculate current period metrics
    const currentMetrics = this.calculateMetrics(currentData);
    const previousMetrics = this.calculateMetrics(previousData);

    // Get latest entry for current values
    const latest = await this.getLatest(userId);

    return {
      timeSaved: {
        total: currentMetrics.timeSaved.total,
        average: currentMetrics.timeSaved.average,
        trend: this.calculateTrend(
          currentMetrics.timeSaved.total,
          previousMetrics.timeSaved.total
        ),
      },
      tasksAutomated: {
        total: currentMetrics.tasksAutomated.total,
        average: currentMetrics.tasksAutomated.average,
        trend: this.calculateTrend(
          currentMetrics.tasksAutomated.total,
          previousMetrics.tasksAutomated.total
        ),
      },
      efficiencyScore: {
        current: latest?.efficiencyScore || 0,
        average: currentMetrics.efficiencyScore.average,
        trend: this.calculateTrend(
          currentMetrics.efficiencyScore.average,
          previousMetrics.efficiencyScore.average
        ),
      },
      activeWorkflows: {
        current: latest?.activeWorkflows || 0,
        peak: currentMetrics.activeWorkflows.peak,
        average: currentMetrics.activeWorkflows.average,
      },
      periodStart: startDate,
      periodEnd: now,
    };
  }

  /**
   * Get time series data for charts
   */
  async getTimeSeries(
    userId: string,
    metric: 'timeSaved' | 'tasksAutomated' | 'efficiencyScore' | 'activeWorkflows',
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<Array<{ date: Date; value: number }>> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const data = await this.getByDateRange(userId, startDate, now);

    return data.map(entry => ({
      date: entry.date,
      value: entry[metric] as number,
    }));
  }

  /**
   * Update or create today's analytics
   */
  async upsertToday(
    userId: string,
    data: Partial<{
      timeSaved: number;
      tasksAutomated: number;
      efficiencyScore: number;
      activeWorkflows: number;
      metadata: any;
    }>
  ): Promise<Analytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.analytics.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existing) {
      return prisma.analytics.update({
        where: { id: existing.id },
        data: {
          timeSaved: data.timeSaved !== undefined 
            ? existing.timeSaved + data.timeSaved 
            : existing.timeSaved,
          tasksAutomated: data.tasksAutomated !== undefined
            ? existing.tasksAutomated + data.tasksAutomated
            : existing.tasksAutomated,
          efficiencyScore: data.efficiencyScore ?? existing.efficiencyScore,
          activeWorkflows: data.activeWorkflows ?? existing.activeWorkflows,
          metadata: data.metadata || existing.metadata,
        },
      });
    } else {
      return this.record({
        userId,
        timeSaved: data.timeSaved || 0,
        tasksAutomated: data.tasksAutomated || 0,
        efficiencyScore: data.efficiencyScore || 0,
        activeWorkflows: data.activeWorkflows || 0,
        metadata: data.metadata,
      });
    }
  }

  /**
   * Calculate metrics from analytics data
   */
  private calculateMetrics(data: Analytics[]): {
    timeSaved: { total: number; average: number };
    tasksAutomated: { total: number; average: number };
    efficiencyScore: { average: number };
    activeWorkflows: { peak: number; average: number };
  } {
    if (data.length === 0) {
      return {
        timeSaved: { total: 0, average: 0 },
        tasksAutomated: { total: 0, average: 0 },
        efficiencyScore: { average: 0 },
        activeWorkflows: { peak: 0, average: 0 },
      };
    }

    const totals = data.reduce(
      (acc, entry) => ({
        timeSaved: acc.timeSaved + entry.timeSaved,
        tasksAutomated: acc.tasksAutomated + entry.tasksAutomated,
        efficiencyScore: acc.efficiencyScore + entry.efficiencyScore,
        activeWorkflows: Math.max(acc.activeWorkflows, entry.activeWorkflows),
        activeWorkflowsSum: acc.activeWorkflowsSum + entry.activeWorkflows,
      }),
      {
        timeSaved: 0,
        tasksAutomated: 0,
        efficiencyScore: 0,
        activeWorkflows: 0,
        activeWorkflowsSum: 0,
      }
    );

    return {
      timeSaved: {
        total: totals.timeSaved,
        average: totals.timeSaved / data.length,
      },
      tasksAutomated: {
        total: totals.tasksAutomated,
        average: totals.tasksAutomated / data.length,
      },
      efficiencyScore: {
        average: totals.efficiencyScore / data.length,
      },
      activeWorkflows: {
        peak: totals.activeWorkflows,
        average: totals.activeWorkflowsSum / data.length,
      },
    };
  }

  /**
   * Calculate trend percentage
   */
  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}

export default new AnalyticsRepository();