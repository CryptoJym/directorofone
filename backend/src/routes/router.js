const config = require('../config/config');
const { jsonResponse } = require('../middleware/middleware');

// Import route handlers
const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const taskRoutes = require('./task.routes');
const analyticsRoutes = require('./analytics.routes');

// Route registry
const routes = new Map();

// Route class
class Route {
  constructor(method, path, handler, middleware = []) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.middleware = middleware;
    this.regex = this.pathToRegex(path);
  }

  pathToRegex(path) {
    // Convert path parameters to regex
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)')
      .replace(/\*/g, '.*');
    return new RegExp(`^${pattern}$`);
  }

  match(pathname) {
    const match = pathname.match(this.regex);
    if (!match) return null;
    return match.groups || {};
  }
}

// Router class
class Router {
  constructor() {
    this.routes = [];
  }

  // Add route methods
  get(path, ...handlers) {
    this.addRoute('GET', path, handlers);
  }

  post(path, ...handlers) {
    this.addRoute('POST', path, handlers);
  }

  put(path, ...handlers) {
    this.addRoute('PUT', path, handlers);
  }

  delete(path, ...handlers) {
    this.addRoute('DELETE', path, handlers);
  }

  patch(path, ...handlers) {
    this.addRoute('PATCH', path, handlers);
  }

  // Add route to registry
  addRoute(method, path, handlers) {
    const middleware = handlers.slice(0, -1);
    const handler = handlers[handlers.length - 1];
    const route = new Route(method, path, handler, middleware);
    this.routes.push(route);
  }

  // Handle incoming request
  async handle(req, res) {
    const method = req.method;
    const pathname = req.pathname;

    // Find matching route
    for (const route of this.routes) {
      if (route.method !== method) continue;
      
      const params = route.match(pathname);
      if (params) {
        req.params = params;
        
        try {
          // Execute middleware
          for (const middleware of route.middleware) {
            await middleware(req, res);
          }
          
          // Execute handler
          await route.handler(req, res);
          return;
        } catch (error) {
          throw error;
        }
      }
    }

    // No route found
    jsonResponse(res, 404, {
      error: {
        message: 'Route not found',
        path: pathname,
        method: method
      }
    });
  }

  // Use sub-router
  use(prefix, subRouter) {
    for (const route of subRouter.routes) {
      const newPath = prefix + route.path;
      const newRoute = new Route(route.method, newPath, route.handler, route.middleware);
      this.routes.push(newRoute);
    }
  }
}

// Create main router
const mainRouter = new Router();

// Health check routes
mainRouter.get('/health', healthRoutes.healthCheck);
mainRouter.get('/api/v1/health', healthRoutes.healthCheck);
mainRouter.get('/api/v1/status', healthRoutes.detailedStatus);

// API routes
const apiRouter = new Router();

// User routes
apiRouter.get('/users', userRoutes.getAllUsers);
apiRouter.get('/users/:id', userRoutes.getUserById);
apiRouter.post('/users', userRoutes.createUser);
apiRouter.put('/users/:id', userRoutes.updateUser);
apiRouter.delete('/users/:id', userRoutes.deleteUser);

// Task routes
apiRouter.get('/tasks', taskRoutes.getAllTasks);
apiRouter.get('/tasks/:id', taskRoutes.getTaskById);
apiRouter.post('/tasks', taskRoutes.createTask);
apiRouter.put('/tasks/:id', taskRoutes.updateTask);
apiRouter.delete('/tasks/:id', taskRoutes.deleteTask);
apiRouter.patch('/tasks/:id/status', taskRoutes.updateTaskStatus);

// Analytics routes
apiRouter.post('/analytics/events', analyticsRoutes.trackEvent);
apiRouter.post('/analytics/metrics', analyticsRoutes.recordMetric);
apiRouter.get('/analytics/dashboard', analyticsRoutes.getDashboardMetrics);
apiRouter.get('/analytics/timeseries/:metric', analyticsRoutes.getTimeSeriesData);
apiRouter.get('/analytics/charts/:type', analyticsRoutes.getChartData);

// Report routes
apiRouter.post('/analytics/reports', analyticsRoutes.generateReport);
apiRouter.get('/analytics/reports', analyticsRoutes.getReports);
apiRouter.get('/analytics/reports/:id', analyticsRoutes.getReport);
apiRouter.get('/analytics/reports/:id/export', analyticsRoutes.exportReport);

// Mount API routes
mainRouter.use(config.apiPrefix, apiRouter);

// Welcome route
mainRouter.get('/', (req, res) => {
  jsonResponse(res, 200, {
    message: 'Welcome to DirectorOfOne API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: config.apiPrefix,
      documentation: '/api/v1/docs'
    }
  });
});

module.exports = mainRouter;