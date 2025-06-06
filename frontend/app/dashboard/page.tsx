'use client';

import React from 'react';
import { Container } from '@/components/layout/Container';
import { Heading, Text } from '@/components/ui/Typography';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Sample data for the dashboard
const metrics = [
  {
    label: 'Tasks Completed',
    value: '24',
    change: '+12%',
    trend: 'up',
  },
  {
    label: 'Hours Saved',
    value: '16.5',
    change: '+8%',
    trend: 'up',
  },
  {
    label: 'Active Workflows',
    value: '7',
    change: '0%',
    trend: 'neutral',
  },
  {
    label: 'Efficiency Score',
    value: '92%',
    change: '+5%',
    trend: 'up',
  },
];

const recentTasks = [
  { id: 1, title: 'Review Q4 budget proposal', status: 'completed', priority: 'high' },
  { id: 2, title: 'Update team documentation', status: 'in-progress', priority: 'medium' },
  { id: 3, title: 'Schedule stakeholder meetings', status: 'pending', priority: 'high' },
  { id: 4, title: 'Analyze performance metrics', status: 'pending', priority: 'low' },
];

const quickActions = [
  { label: 'Create Task', icon: '➕', action: '/dashboard/tasks/new' },
  { label: 'New Workflow', icon: '⚡', action: '/dashboard/workflows/new' },
  { label: 'View Reports', icon: '📊', action: '/dashboard/analytics' },
  { label: 'Set Priority', icon: '🎯', action: '/dashboard/priorities' },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Heading as="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, John
        </Heading>
        <Text variant="muted">Here's what's happening in your department today</Text>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader>
              <Text variant="muted" className="text-sm">{metric.label}</Text>
              <div className="flex items-baseline justify-between">
                <CardTitle className="text-3xl font-bold">{metric.value}</CardTitle>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {metric.change}
                </span>
              </div>
            </CardHeader>
            <div className={`absolute inset-x-0 bottom-0 h-1 ${
              metric.trend === 'up' ? 'bg-green-500' : 
              metric.trend === 'down' ? 'bg-red-500' : 
              'bg-gray-300'
            }`} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/tasks'}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTasks.map((task) => (
                  <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        readOnly
                      />
                      <div>
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs ${
                            task.status === 'completed' ? 'text-green-600' :
                            task.status === 'in-progress' ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => window.location.href = action.action}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Assistant Preview */}
          <Card className="mt-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-700 dark:text-primary-300">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                "Based on your patterns, I suggest prioritizing the stakeholder meetings today. You typically handle these best in the morning."
              </Text>
              <Button size="sm" className="w-full">
                Get More Suggestions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}