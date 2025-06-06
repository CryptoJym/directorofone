# Director of One - Database & Data Layer Documentation

## Overview

The Director of One application uses PostgreSQL as its primary database with Prisma ORM for type-safe database access. The data layer is designed to support the core features of workflow automation, consultation management, and analytics tracking for one-person departments.

## Technology Stack

- **Database**: PostgreSQL 13+
- **ORM**: Prisma 6.9.0
- **Language**: TypeScript
- **Architecture**: Repository Pattern

## Database Schema

### Core Models

#### User
Represents directors/managers using the platform.
- `id` (String): Unique identifier
- `email` (String): Unique email address
- `name` (String): Full name
- `company` (String?): Company name
- `department` (String?): Department name
- `role` (UserRole): User role (ADMIN, DIRECTOR, MANAGER, USER)
- `isActive` (Boolean): Account status
- `onboardingCompleted` (Boolean): Onboarding status

#### Consultation
Tracks consultation/demo requests from potential users.
- `id` (String): Unique identifier
- `bookingId` (String): Unique booking reference
- `name` (String): Requester name
- `email` (String): Requester email
- `company` (String?): Company name
- `department` (String?): Department name
- `challenges` (Text): Description of challenges
- `status` (ConsultationStatus): Current status
- `scheduledDate` (DateTime?): Scheduled consultation date

#### Workflow
Automation workflow templates created by users.
- `id` (String): Unique identifier
- `userId` (String): Owner user ID
- `name` (String): Workflow name
- `description` (String): Detailed description
- `type` (WorkflowType): Type of workflow
- `trigger` (JSON): Trigger configuration
- `actions` (JSON): Actions configuration
- `frequency` (String): Execution frequency
- `isActive` (Boolean): Active status

#### Task
Tasks managed by workflows or created manually.
- `id` (String): Unique identifier
- `userId` (String): Owner user ID
- `workflowId` (String?): Associated workflow
- `title` (String): Task title
- `description` (Text?): Task description
- `priority` (Priority): Task priority
- `status` (TaskStatus): Current status
- `dueDate` (DateTime?): Due date
- `tags` (String[]): Task tags

#### Analytics
Tracks user metrics and efficiency gains.
- `id` (String): Unique identifier
- `userId` (String): User ID
- `date` (DateTime): Metric date
- `timeSaved` (Float): Hours saved
- `tasksAutomated` (Int): Number of automated tasks
- `efficiencyScore` (Float): Efficiency percentage
- `activeWorkflows` (Int): Number of active workflows

### Enums

- **UserRole**: ADMIN, DIRECTOR, MANAGER, USER
- **ConsultationStatus**: PENDING, SCHEDULED, COMPLETED, CANCELLED
- **WorkflowType**: REPORTING, TASK_AUTOMATION, NOTIFICATION, DATA_SYNC, APPROVAL, SCHEDULING
- **ExecutionStatus**: RUNNING, SUCCESS, FAILED, CANCELLED
- **TaskStatus**: TODO, IN_PROGRESS, REVIEW, COMPLETED, CANCELLED
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **NotificationType**: INFO, WARNING, ERROR, SUCCESS, TASK_DUE, WORKFLOW_COMPLETE, BUDGET_ALERT

## Data Access Layer

### Repository Pattern

Each model has a dedicated repository that encapsulates database operations:

```typescript
backend/src/repositories/
├── consultation.repository.ts
├── workflow.repository.ts
├── analytics.repository.ts
└── index.ts
```

### Key Repository Methods

#### ConsultationRepository
- `create()` - Create new consultation request
- `findById()` - Find by ID
- `findByBookingId()` - Find by booking ID
- `findAll()` - Get paginated list with filters
- `schedule()` - Schedule a consultation
- `complete()` - Mark as completed
- `cancel()` - Cancel consultation
- `getStats()` - Get consultation statistics

#### WorkflowRepository
- `create()` - Create new workflow
- `findById()` - Find by ID
- `findByUserId()` - Get user's workflows
- `update()` - Update workflow
- `toggleActive()` - Toggle active status
- `execute()` - Execute workflow
- `getDueWorkflows()` - Get workflows due for execution
- `getStats()` - Get workflow statistics

#### AnalyticsRepository
- `record()` - Record new analytics data
- `getByDateRange()` - Get analytics for date range
- `getSummary()` - Get analytics summary
- `getTimeSeries()` - Get time series data for charts
- `upsertToday()` - Update today's analytics

## Database Setup

### Prerequisites
- PostgreSQL 13 or higher
- Node.js 16 or higher

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
# Copy .env.example to .env and update DATABASE_URL
cp .env.example .env
```

3. Run setup script:
```bash
./scripts/setup-db.sh
```

Or manually:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### Database Management Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema changes without migrations (development)
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Reset database (drop, create, migrate, seed)
npm run db:reset
```

## API Integration

The database layer is integrated with the Express API server:

```typescript
// Example: Consultation endpoint
app.post('/api/consultation', async (req, res) => {
  const consultation = await consultationRepository.create({
    name: req.body.name,
    email: req.body.email,
    // ... other fields
  });
  
  res.json({ success: true, data: consultation });
});
```

## Performance Considerations

1. **Indexes**: The schema includes indexes on frequently queried fields
2. **Connection Pooling**: Prisma manages connection pooling automatically
3. **Query Optimization**: Use `include` and `select` to minimize data transfer
4. **Pagination**: All list endpoints support pagination

## Security

1. **Input Validation**: Validate all inputs before database operations
2. **SQL Injection**: Prisma prevents SQL injection by default
3. **Access Control**: Implement user-based access control in repositories
4. **Sensitive Data**: Never store sensitive data in plain text

## Monitoring

The database layer includes logging for:
- Query execution (development mode)
- Errors and warnings
- Connection events

## Future Enhancements

1. **Caching Layer**: Redis integration for frequently accessed data
2. **Full-Text Search**: PostgreSQL full-text search for tasks and workflows
3. **Audit Trail**: Track all data modifications
4. **Data Archival**: Archive old analytics and execution data
5. **Multi-tenancy**: Support for multiple organizations

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Check firewall/network settings

2. **Migration Errors**
   - Run `npm run db:reset` to start fresh
   - Check for schema conflicts

3. **Type Errors**
   - Regenerate Prisma client: `npm run db:generate`
   - Restart TypeScript server in IDE

### Debug Mode

Enable query logging:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```