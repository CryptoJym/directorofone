import React from 'react';
import Link from 'next/link';
import { Grid } from '../layout/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';

const integrations = [
  { name: 'Slack', icon: '💬', status: 'connected' },
  { name: 'Google Calendar', icon: '📅', status: 'connected' },
  { name: 'Trello', icon: '📋', status: 'available' },
  { name: 'Google Drive', icon: '📁', status: 'available' },
  { name: 'Microsoft Teams', icon: '👥', status: 'available' },
  { name: 'Notion', icon: '📝', status: 'coming-soon' },
];

export function IntegrationsPreview() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Connect Your Favorite Tools
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Seamlessly integrate with the tools you already use. Automate workflows and save hours every week.
        </p>
      </div>

      <Grid cols={6} className="mb-12 max-w-4xl mx-auto">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="text-center p-4"
          >
            <div className={`
              text-4xl mb-2 p-4 rounded-lg inline-block
              ${integration.status === 'connected' ? 'bg-green-100' : 
                integration.status === 'coming-soon' ? 'bg-gray-100' : 'bg-blue-50'}
            `}>
              {integration.icon}
            </div>
            <p className="text-sm font-medium">{integration.name}</p>
            {integration.status === 'connected' && (
              <p className="text-xs text-green-600">Connected</p>
            )}
            {integration.status === 'coming-soon' && (
              <p className="text-xs text-gray-500">Coming Soon</p>
            )}
          </div>
        ))}
      </Grid>

      <div className="text-center">
        <Link href="/integrations">
          <Button size="lg" variant="primary">
            View All Integrations
          </Button>
        </Link>
        <p className="text-sm text-gray-600 mt-4">
          8+ integrations available • Connect in seconds • No coding required
        </p>
      </div>
    </section>
  );
}