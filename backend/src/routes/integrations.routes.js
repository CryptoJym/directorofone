const crypto = require('crypto');

// Available integrations catalog
const AVAILABLE_INTEGRATIONS = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'calendar',
    description: 'Sync meetings, automate scheduling, and manage your calendar',
    icon: '📅',
    features: ['Event sync', 'Auto-scheduling', 'Meeting reminders', 'Availability tracking'],
    authType: 'oauth2',
    status: 'available'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Automate status updates and team communications',
    icon: '💬',
    features: ['Status updates', 'Automated reports', 'Task notifications', 'Team alerts'],
    authType: 'oauth2',
    status: 'available'
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'task-management',
    description: 'Sync tasks and automate project workflows',
    icon: '📋',
    features: ['Task sync', 'Board automation', 'Progress tracking', 'Due date alerts'],
    authType: 'api-key',
    status: 'available'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'file-storage',
    description: 'Automate document organization and sharing',
    icon: '📁',
    features: ['File organization', 'Auto-backup', 'Sharing automation', 'Version control'],
    authType: 'oauth2',
    status: 'available'
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    category: 'communication',
    description: 'Integrate with Teams for automated updates',
    icon: '👥',
    features: ['Channel updates', 'Meeting automation', 'Status sync', 'File sharing'],
    authType: 'oauth2',
    status: 'available'
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'task-management',
    description: 'Connect your Asana projects and tasks',
    icon: '🎯',
    features: ['Project sync', 'Task automation', 'Timeline tracking', 'Team updates'],
    authType: 'oauth2',
    status: 'coming-soon'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'knowledge-base',
    description: 'Sync your knowledge base and documentation',
    icon: '📝',
    features: ['Page sync', 'Database automation', 'Template management', 'Content updates'],
    authType: 'api-key',
    status: 'coming-soon'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    description: 'Connect to 5000+ apps through Zapier',
    icon: '⚡',
    features: ['Multi-app workflows', 'Custom triggers', 'Data transformation', 'Error handling'],
    authType: 'api-key',
    status: 'premium'
  }
];

// In-memory storage for user integrations
let userIntegrations = new Map();

// Helper function to get user integrations
function getUserIntegrations(userId) {
  if (!userIntegrations.has(userId)) {
    userIntegrations.set(userId, []);
  }
  return userIntegrations.get(userId);
}

// GET /api/v1/integrations/available - Get all available integrations
function getAvailableIntegrations(req, res) {
  const { category, status } = req.query;
  
  let integrations = [...AVAILABLE_INTEGRATIONS];
  
  // Filter by category if provided
  if (category) {
    integrations = integrations.filter(i => i.category === category);
  }
  
  // Filter by status if provided
  if (status) {
    integrations = integrations.filter(i => i.status === status);
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    integrations,
    categories: [...new Set(AVAILABLE_INTEGRATIONS.map(i => i.category))],
    total: integrations.length
  }));
}

// GET /api/v1/integrations/connected - Get user's connected integrations
function getConnectedIntegrations(req, res) {
  const userId = req.headers['x-user-id'] || 'default-user';
  const connected = getUserIntegrations(userId);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    integrations: connected,
    total: connected.length
  }));
}

// POST /api/v1/integrations/connect - Connect a new integration
function connectIntegration(req, res) {
  const userId = req.headers['x-user-id'] || 'default-user';
  const { integrationId, config = {} } = req.body;
  
  // Validate integration exists
  const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId);
  if (!integration) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Integration not found'
    }));
    return;
  }
  
  // Check if already connected
  const userIntsList = getUserIntegrations(userId);
  const existing = userIntsList.find(i => i.integrationId === integrationId);
  if (existing) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Integration already connected'
    }));
    return;
  }
  
  // Create connection
  const connection = {
    id: crypto.randomBytes(8).toString('hex'),
    integrationId,
    name: integration.name,
    category: integration.category,
    icon: integration.icon,
    config,
    connectedAt: new Date().toISOString(),
    status: 'active',
    lastSync: null,
    syncCount: 0
  };
  
  userIntsList.push(connection);
  
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    connection
  }));
}

// DELETE /api/v1/integrations/:connectionId - Disconnect an integration
function disconnectIntegration(req, res) {
  const userId = req.headers['x-user-id'] || 'default-user';
  const connectionId = req.params.connectionId;
  
  const userIntsList = getUserIntegrations(userId);
  const index = userIntsList.findIndex(i => i.id === connectionId);
  
  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Connection not found'
    }));
    return;
  }
  
  const removed = userIntsList.splice(index, 1)[0];
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    message: `Disconnected ${removed.name}`,
    connectionId: removed.id
  }));
}

// POST /api/v1/integrations/:connectionId/sync - Trigger sync for an integration
function syncIntegration(req, res) {
  const userId = req.headers['x-user-id'] || 'default-user';
  const connectionId = req.params.connectionId;
  
  const userIntsList = getUserIntegrations(userId);
  const connection = userIntsList.find(i => i.id === connectionId);
  
  if (!connection) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Connection not found'
    }));
    return;
  }
  
  // Simulate sync process
  connection.lastSync = new Date().toISOString();
  connection.syncCount += 1;
  
  // Generate mock sync results
  const syncResults = {
    itemsSynced: Math.floor(Math.random() * 50) + 10,
    errors: 0,
    duration: Math.floor(Math.random() * 3000) + 1000,
    nextSync: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    connection,
    syncResults
  }));
}

// GET /api/v1/integrations/stats - Get integration statistics
function getIntegrationStats(req, res) {
  const userId = req.headers['x-user-id'] || 'default-user';
  const connected = getUserIntegrations(userId);
  
  const stats = {
    totalAvailable: AVAILABLE_INTEGRATIONS.length,
    totalConnected: connected.length,
    byCategory: {},
    recentActivity: [],
    recommendations: []
  };
  
  // Calculate by category
  const categories = [...new Set(AVAILABLE_INTEGRATIONS.map(i => i.category))];
  categories.forEach(cat => {
    stats.byCategory[cat] = {
      available: AVAILABLE_INTEGRATIONS.filter(i => i.category === cat).length,
      connected: connected.filter(i => i.category === cat).length
    };
  });
  
  // Add recent activity (mock data)
  if (connected.length > 0) {
    stats.recentActivity = connected.slice(0, 3).map(c => ({
      integration: c.name,
      action: 'Synced',
      timestamp: c.lastSync || c.connectedAt,
      items: Math.floor(Math.random() * 20) + 5
    }));
  }
  
  // Add recommendations
  const connectedIds = new Set(connected.map(c => c.integrationId));
  stats.recommendations = AVAILABLE_INTEGRATIONS
    .filter(i => !connectedIds.has(i.id) && i.status === 'available')
    .slice(0, 3)
    .map(i => ({
      id: i.id,
      name: i.name,
      reason: `Popular with other ${i.category} users`
    }));
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    stats
  }));
}

// Export routes
module.exports = {
  getAvailableIntegrations,
  getConnectedIntegrations,
  connectIntegration,
  disconnectIntegration,
  syncIntegration,
  getIntegrationStats
};