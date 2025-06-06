'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Heading, Text } from '@/components/ui/Typography';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TaskItem, Task } from '@/components/dashboard';

// Sample tasks data
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Quarterly budget review',
    description: 'Review and approve Q4 budget allocations',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['finance', 'review'],
  },
  {
    id: '2',
    title: 'Update team documentation',
    description: 'Ensure all process documentation is current',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['documentation'],
  },
  {
    id: '3',
    title: 'Performance metrics analysis',
    description: 'Analyze KPIs for the current quarter',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['analytics', 'kpi'],
  },
  {
    id: '4',
    title: 'Vendor contract renewal',
    description: 'Review and negotiate vendor contracts',
    status: 'pending',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['procurement'],
  },
  {
    id: '5',
    title: 'Weekly team sync',
    description: 'Conduct weekly team meeting',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['meeting'],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate'>('priority');

  const handleStatusChange = (taskId: string | number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
    }
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Heading as="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tasks
          </Heading>
          <Text variant="muted">Manage and track your tasks efficiently</Text>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/tasks/new'}>
          <span className="mr-2">➕</span> New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="py-4">
            <Text variant="muted" className="text-sm">Total Tasks</Text>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-4">
            <Text variant="muted" className="text-sm">Pending</Text>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-4">
            <Text variant="muted" className="text-sm">In Progress</Text>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-4">
            <Text variant="muted" className="text-sm">Completed</Text>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Text className="text-sm font-medium">Filter:</Text>
            <div className="flex gap-2">
              {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Text className="text-sm font-medium">Sort by:</Text>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'dueDate')}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedTasks.length === 0 ? (
            <p className="p-6 text-center text-gray-500 dark:text-gray-400">
              No tasks found. Create your first task to get started.
            </p>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onSelect={(task) => console.log('Selected task:', task)}
                  showDetails={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}