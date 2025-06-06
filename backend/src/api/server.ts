import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import database and repositories
import '../config/database'; // Initialize database connection
import { consultationRepository, workflowRepository, analyticsRepository } from '../repositories';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Director of One API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Director of One API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      consultation: '/api/consultation',
      automation: '/api/automation',
      analytics: '/api/analytics',
    },
  });
});

// Consultation endpoints
app.post('/api/consultation', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, company, department, challenges } = req.body;
    
    // Validate required fields
    if (!name || !email || !challenges) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and challenges are required',
      });
      return;
    }

    // Create consultation in database
    const consultation = await consultationRepository.create({
      name,
      email,
      company,
      department,
      challenges,
    });

    res.json({
      success: true,
      message: 'Consultation request received',
      data: {
        id: consultation.id,
        bookingId: consultation.bookingId,
        name: consultation.name,
        email: consultation.email,
        company: consultation.company,
        department: consultation.department,
        status: consultation.status,
      },
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing consultation request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get consultations
app.get('/api/consultations', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const result = await consultationRepository.findAll({
      status: status as any,
      skip,
      take,
    });

    res.json({
      success: true,
      data: result.consultations,
      pagination: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(result.total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Automation workflow endpoints
app.get('/api/automation/workflows', async (req: Request, res: Response) => {
  try {
    // For now, using a demo user ID. In production, this would come from auth
    const userId = req.query.userId as string || 'demo-user';
    
    const result = await workflowRepository.findByUserId(userId, {
      isActive: req.query.active === 'true' ? true : undefined,
    });

    res.json({
      success: true,
      workflows: result.workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        type: workflow.type,
        frequency: workflow.frequency,
        enabled: workflow.isActive,
        lastRunAt: workflow.lastRunAt,
        nextRunAt: workflow.nextRunAt,
      })),
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workflows',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create workflow
app.post('/api/automation/workflows', async (req: Request, res: Response) => {
  try {
    const { name, description, type, trigger, actions, frequency } = req.body;
    const userId = req.body.userId || 'demo-user';

    const workflow = await workflowRepository.create({
      userId,
      name,
      description,
      type,
      trigger,
      actions,
      frequency,
    });

    res.json({
      success: true,
      message: 'Workflow created successfully',
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        type: workflow.type,
        frequency: workflow.frequency,
        enabled: workflow.isActive,
      },
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating workflow',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Analytics endpoint
app.get('/api/analytics/summary', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'demo-user';
    const period = (req.query.period as 'week' | 'month' | 'year') || 'month';

    const summary = await analyticsRepository.getSummary(userId, period);

    res.json({
      success: true,
      summary: {
        timeSaved: {
          weekly: summary.timeSaved.average * 7,
          monthly: summary.timeSaved.total,
          unit: 'hours',
        },
        tasksAutomated: summary.tasksAutomated.total,
        efficiencyGain: summary.efficiencyScore.current,
        activeWorkflows: summary.activeWorkflows.current,
        trends: {
          timeSaved: summary.timeSaved.trend,
          tasksAutomated: summary.tasksAutomated.trend,
          efficiency: summary.efficiencyScore.trend,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Director of One API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
export default app; 