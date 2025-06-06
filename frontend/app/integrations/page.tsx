'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Grid, Stack } from '@/src/components/layout/Container';
import Card, { CardHeader, CardContent } from '@/src/components/ui/Card';
import Button from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Typography';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  authType: string;
  status: 'available' | 'coming-soon' | 'premium';
}

interface ConnectedIntegration {
  id: string;
  integrationId: string;
  name: string;
  category: string;
  icon: string;
  config: any;
  connectedAt: string;
  status: string;
  lastSync: string | null;
  syncCount: number;
}

interface IntegrationStats {
  totalAvailable: number;
  totalConnected: number;
  byCategory: Record<string, { available: number; connected: number }>;
  recentActivity: Array<{
    integration: string;
    action: string;
    timestamp: string;
    items: number;
  }>;
  recommendations: Array<{
    id: string;
    name: string;
    reason: string;
  }>;
}

export default function IntegrationsPage() {
  const [availableIntegrations, setAvailableIntegrations] = useState<Integration[]>([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState<ConnectedIntegration[]>([]);
  const [stats, setStats] = useState<IntegrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      // Fetch available integrations
      const availableRes = await fetch('/api/v1/integrations/available');
      const availableData = await availableRes.json();
      setAvailableIntegrations(availableData.integrations);
      setCategories(availableData.categories);

      // Fetch connected integrations
      const connectedRes = await fetch('/api/v1/integrations/connected', {
        headers: { 'x-user-id': 'default-user' }
      });
      const connectedData = await connectedRes.json();
      setConnectedIntegrations(connectedData.integrations);

      // Fetch stats
      const statsRes = await fetch('/api/v1/integrations/stats', {
        headers: { 'x-user-id': 'default-user' }
      });
      const statsData = await statsRes.json();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (integrationId: string) => {
    try {
      const res = await fetch('/api/v1/integrations/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'default-user'
        },
        body: JSON.stringify({ integrationId })
      });

      if (res.ok) {
        fetchIntegrations(); // Refresh data
      }
    } catch (error) {
      console.error('Error connecting integration:', error);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/v1/integrations/${connectionId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'default-user' }
      });

      if (res.ok) {
        fetchIntegrations(); // Refresh data
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
    }
  };

  const handleSync = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/v1/integrations/${connectionId}/sync`, {
        method: 'POST',
        headers: { 'x-user-id': 'default-user' }
      });

      if (res.ok) {
        fetchIntegrations(); // Refresh data
      }
    } catch (error) {
      console.error('Error syncing integration:', error);
    }
  };

  const filteredIntegrations = selectedCategory === 'all' 
    ? availableIntegrations 
    : availableIntegrations.filter((i: Integration) => i.category === selectedCategory);

  const connectedIds = new Set(connectedIntegrations.map((c: ConnectedIntegration) => c.integrationId));

  if (loading) {
    return (
      <Container className="min-h-screen py-16">
        <div className="text-center">
          <p className="text-gray-500">Loading integrations...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen py-16">
      <Section>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Integrations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your favorite tools and automate your workflows. Save time and reduce manual work.
          </p>
        </div>

        {/* Stats Section */}
        {stats && (
          <Grid cols={4} className="mb-12">
            <Card className="text-center">
              <CardContent className="py-6">
                <p className="text-3xl font-bold text-primary-600">{stats.totalAvailable}</p>
                <p className="text-gray-600">Available Integrations</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-6">
                <p className="text-3xl font-bold text-green-600">{stats.totalConnected}</p>
                <p className="text-gray-600">Connected</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-6">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.recentActivity.reduce((sum, a) => sum + a.items, 0)}
                </p>
                <p className="text-gray-600">Items Synced Today</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-6">
                <p className="text-3xl font-bold text-purple-600">10+</p>
                <p className="text-gray-600">Hours Saved Weekly</p>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Connected Integrations */}
        {connectedIntegrations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Connected Integrations</h2>
            <Grid cols={3}>
              {connectedIntegrations.map((connection) => (
                <Card key={connection.id} className="border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{connection.icon}</span>
                        <div>
                          <h3 className="font-semibold">{connection.name}</h3>
                          <p className="text-sm text-gray-500">
                            Connected {new Date(connection.connectedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        Last synced: {connection.lastSync 
                          ? new Date(connection.lastSync).toLocaleString() 
                          : 'Never'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total syncs: {connection.syncCount}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(connection.id)}
                      >
                        Sync Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDisconnect(connection.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Integrations</h2>
          <div className="flex gap-2 mb-6">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Available Integrations */}
        <Grid cols={3}>
          {filteredIntegrations.map((integration) => {
            const isConnected = connectedIds.has(integration.id);
            return (
              <Card key={integration.id} className={integration.status === 'available' ? '' : 'opacity-75'}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.category}</p>
                      </div>
                    </div>
                    {integration.status === 'coming-soon' && (
                      <Badge variant="default">Coming Soon</Badge>
                    )}
                    {integration.status === 'premium' && (
                      <Badge variant="warning">Premium</Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Features:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {integration.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="text-green-500">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {integration.status === 'available' && (
                    <Button
                      variant={isConnected ? 'outline' : 'primary'}
                      className="w-full"
                      disabled={isConnected}
                      onClick={() => handleConnect(integration.id)}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </Button>
                  )}
                  {integration.status === 'coming-soon' && (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                  {integration.status === 'premium' && (
                    <Button variant="warning" className="w-full">
                      Upgrade to Premium
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Grid>

        {/* Recommendations */}
        {stats && stats.recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Recommended for You</h2>
            <Grid cols={3}>
              {stats.recommendations.map((rec) => {
                const integration = availableIntegrations.find(i => i.id === rec.id);
                if (!integration) return null;
                
                return (
                  <Card key={rec.id} className="border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{integration.icon}</span>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-blue-600">{rec.reason}</p>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleConnect(integration.id)}
                      >
                        Connect Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>
          </div>
        )}
      </Section>
    </Container>
  );
}