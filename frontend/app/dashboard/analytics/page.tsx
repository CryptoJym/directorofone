'use client';

import React from 'react';
import { Heading, Text } from '@/components/ui/Typography';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MetricCard, AnalyticsChart } from '@/components/dashboard';

// Sample analytics data
const weeklyData = [
  { label: 'Mon', value: 15 },
  { label: 'Tue', value: 22 },
  { label: 'Wed', value: 18 },
  { label: 'Thu', value: 25 },
  { label: 'Fri', value: 20 },
  { label: 'Sat', value: 8 },
  { label: 'Sun', value: 5 },
];

const categoryData = [
  { label: 'Strategic', value: 35 },
  { label: 'Operational', value: 45 },
  { label: 'Admin', value: 20 },
  { label: 'Meetings', value: 15 },
];

const productivityTrend = [
  { label: 'Week 1', value: 72 },
  { label: 'Week 2', value: 78 },
  { label: 'Week 3', value: 85 },
  { label: 'Week 4', value: 92 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Heading as="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </Heading>
        <Text variant="muted">Track your productivity and performance metrics</Text>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Productivity Score"
          value="92%"
          change="+5%"
          trend="up"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <MetricCard
          label="Tasks Completed"
          value="147"
          change="+12%"
          trend="up"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          label="Avg. Time per Task"
          value="32m"
          change="-8%"
          trend="up"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          label="Focus Time"
          value="6.5h"
          change="+15%"
          trend="up"
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart
          title="Tasks Completed This Week"
          data={weeklyData}
          type="bar"
          color="rgb(59, 130, 246)" // blue-500
        />
        
        <AnalyticsChart
          title="Productivity Trend"
          data={productivityTrend}
          type="line"
          color="rgb(34, 197, 94)" // green-500
        />
      </div>

      {/* Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart
            title="Time by Category"
            data={categoryData}
            type="bar"
            color="rgb(168, 85, 247)" // purple-500
          />
        </div>

        {/* Insights Card */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <div>
                <p className="font-medium text-sm">Productivity Increasing</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your productivity score has increased by 20% over the last month
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <div>
                <p className="font-medium text-sm">Peak Performance</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You're most productive on Thursdays between 9-11 AM
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
              <div>
                <p className="font-medium text-sm">Time Optimization</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Consider automating administrative tasks to save ~2 hours weekly
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
              <div>
                <p className="font-medium text-sm">Strategic Focus</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Allocate more time to strategic tasks for better outcomes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}