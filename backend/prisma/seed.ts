/// <reference types="node" />
import { PrismaClient, UserRole, WorkflowType, ConsultationStatus, Priority, TaskStatus } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@directorofone.com' },
    update: {},
    create: {
      email: 'demo@directorofone.com',
      name: 'Demo Director',
      company: 'Acme Corp',
      department: 'Operations',
      role: UserRole.DIRECTOR,
      onboardingCompleted: true,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample workflows
  const workflows = [
    {
      name: 'Daily Status Report',
      description: 'Automated daily department status report generation and distribution',
      type: WorkflowType.REPORTING,
      frequency: 'daily',
      trigger: { time: '09:00', timezone: 'UTC' },
      actions: [
        { type: 'collectData', sources: ['tasks', 'metrics'] },
        { type: 'generateReport', template: 'daily-status' },
        { type: 'sendEmail', recipients: ['team@company.com'] },
      ],
    },
    {
      name: 'Task Prioritization',
      description: 'AI-powered task priority assignment based on deadlines and importance',
      type: WorkflowType.TASK_AUTOMATION,
      frequency: 'real-time',
      trigger: { event: 'task_created' },
      actions: [
        { type: 'analyzePriority', factors: ['deadline', 'impact', 'dependencies'] },
        { type: 'assignPriority' },
        { type: 'notify', channel: 'slack' },
      ],
    },
    {
      name: 'Budget Alert',
      description: 'Automated budget threshold notifications',
      type: WorkflowType.NOTIFICATION,
      frequency: 'on-trigger',
      trigger: { condition: 'budget_threshold', threshold: 0.8 },
      actions: [
        { type: 'checkBudget' },
        { type: 'sendAlert', severity: 'warning' },
        { type: 'createTask', title: 'Review budget allocation' },
      ],
    },
    {
      name: 'Weekly Team Sync',
      description: 'Automated scheduling and agenda creation for weekly team meetings',
      type: WorkflowType.SCHEDULING,
      frequency: 'weekly',
      trigger: { dayOfWeek: 'monday', time: '08:00' },
      actions: [
        { type: 'collectTopics', sources: ['tasks', 'blockers'] },
        { type: 'createAgenda' },
        { type: 'scheduleeMeeting', duration: 60 },
        { type: 'sendInvite' },
      ],
    },
  ];

  for (const workflow of workflows) {
    await prisma.workflow.create({
      data: {
        ...workflow,
        userId: demoUser.id,
        isActive: true,
        trigger: workflow.trigger as any,
        actions: workflow.actions as any,
      },
    });
  }

  console.log(`✅ Created ${workflows.length} workflows`);

  // Create sample tasks
  const tasks = [
    {
      title: 'Q4 Budget Review',
      description: 'Review and approve Q4 budget allocations',
      priority: Priority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      tags: ['budget', 'quarterly-review'],
    },
    {
      title: 'Update Team KPIs',
      description: 'Define and communicate updated KPIs for the team',
      priority: Priority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      tags: ['metrics', 'team-management'],
    },
    {
      title: 'Vendor Contract Renewal',
      description: 'Review and negotiate renewal terms with key vendors',
      priority: Priority.HIGH,
      status: TaskStatus.TODO,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
      tags: ['contracts', 'vendors'],
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        userId: demoUser.id,
      },
    });
  }

  console.log(`✅ Created ${tasks.length} tasks`);

  // Create sample consultations
  const consultations = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@techstartup.com',
      company: 'TechStartup Inc',
      department: 'Product Development',
      challenges: 'Managing a 50-person department alone. Need help with prioritization, delegation strategies, and automated reporting.',
      status: ConsultationStatus.SCHEDULED,
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Michael Chen',
      email: 'mchen@retailco.com',
      company: 'RetailCo',
      department: 'Supply Chain',
      challenges: 'Drowning in operational tasks. Looking for automation solutions for inventory management and vendor communications.',
      status: ConsultationStatus.PENDING,
    },
  ];

  for (const consultation of consultations) {
    await prisma.consultation.create({
      data: {
        ...consultation,
        bookingId: `DOO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });
  }

  console.log(`✅ Created ${consultations.length} consultations`);

  // Create initial analytics data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create analytics for the past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    await prisma.analytics.create({
      data: {
        userId: demoUser.id,
        date,
        timeSaved: Math.random() * 4 + 1, // 1-5 hours per day
        tasksAutomated: Math.floor(Math.random() * 10) + 5, // 5-15 tasks per day
        efficiencyScore: Math.random() * 30 + 60, // 60-90% efficiency
        activeWorkflows: workflows.length,
        metadata: {
          topWorkflow: workflows[Math.floor(Math.random() * workflows.length)].name,
        },
      },
    });
  }

  console.log('✅ Created 30 days of analytics data');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });