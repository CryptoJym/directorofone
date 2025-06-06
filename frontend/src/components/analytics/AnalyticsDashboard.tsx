'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DashboardMetrics, ChartData, DateRange } from '@/src/types/analytics';
import DateRangePicker from './DateRangePicker';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';

interface AnalyticsDashboardProps {
  metrics: DashboardMetrics | null;
  chartData: Record<string, ChartData>;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  loading: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsDashboard({
  metrics,
  chartData,
  dateRange,
  onDateRangeChange,
  loading
}: AnalyticsDashboardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available for the selected period</p>
      </div>
    );
  }

  // Transform chart data for recharts
  const taskStatusData = chartData.taskStatus?.labels?.map((label: string, index: number) => ({
    name: label,
    value: chartData.taskStatus.datasets[0].data[index]
  })) || [];

  const userActivityData = chartData.userActivity?.labels?.map((label: string, index: number) => ({
    day: label,
    users: chartData.userActivity.datasets[0].data[index]
  })) || [];

  const productivityData = chartData.productivity?.labels?.map((label: string, index: number) => ({
    day: label,
    tasks: chartData.productivity.datasets[0].data[index]
  })) || [];

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="bg-white p-4 rounded-lg shadow">
        <DateRangePicker
          dateRange={dateRange}
          onChange={onDateRangeChange}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tasks"
          value={metrics.totalTasks}
          icon="📋"
          trend={null}
        />
        <MetricCard
          title="Completed Tasks"
          value={metrics.completedTasks}
          icon="✅"
          trend={{ value: metrics.taskCompletionRate, suffix: '%' }}
          trendLabel="Completion Rate"
        />
        <MetricCard
          title="Active Tasks"
          value={metrics.activeTasks}
          icon="⚡"
          trend={null}
        />
        <MetricCard
          title="Avg Completion Time"
          value={metrics.averageCompletionTime.toFixed(1)}
          suffix=" hrs"
          icon="⏱️"
          trend={null}
        />
      </div>

      {/* User Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Daily Active Users"
          value={metrics.dailyActiveUsers}
          icon="👤"
          trend={null}
        />
        <MetricCard
          title="Weekly Active Users"
          value={metrics.weeklyActiveUsers}
          icon="👥"
          trend={null}
        />
        <MetricCard
          title="Monthly Active Users"
          value={metrics.monthlyActiveUsers}
          icon="👨‍👩‍👧‍👦"
          trend={null}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <ChartCard title="Task Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Activity Bar Chart */}
        <ChartCard title="User Activity (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Productivity Line Chart */}
        <ChartCard title="Task Completion Trend (Last 30 Days)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-2">
          <InsightItem
            type={metrics.taskCompletionRate > 80 ? 'success' : 'warning'}
            text={`Task completion rate is ${metrics.taskCompletionRate.toFixed(1)}%`}
          />
          <InsightItem
            type="info"
            text={`Average task completion time is ${metrics.averageCompletionTime.toFixed(1)} hours`}
          />
          {metrics.activeTasks > metrics.completedTasks && (
            <InsightItem
              type="warning"
              text={`There are more active tasks (${metrics.activeTasks}) than completed ones`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface InsightItemProps {
  type: 'success' | 'warning' | 'info';
  text: string;
}

function InsightItem({ type, text }: InsightItemProps) {
  const colors = {
    success: 'text-green-700 bg-green-50 border-green-200',
    warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    info: 'text-blue-700 bg-blue-50 border-blue-200'
  };

  const icons = {
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`flex items-center p-3 rounded-lg border ${colors[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}