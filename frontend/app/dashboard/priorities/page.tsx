'use client';

import React from 'react';
import { Heading, Text } from '@/components/ui/Typography';
import Card from '@/components/ui/Card';
import { PriorityMatrix, Task } from '@/components/dashboard';

// Sample tasks data with different priorities
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Quarterly budget review - URGENT',
    description: 'Review and approve Q4 budget allocations before deadline',
    status: 'pending',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Strategic planning session',
    description: 'Plan next year\'s strategic initiatives',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Team performance reviews',
    description: 'Complete annual performance reviews',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update process documentation for new procedures',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Vendor meeting preparation',
    description: 'Prepare materials for vendor negotiation',
    status: 'pending',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Office supply order',
    description: 'Order office supplies for next month',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'Training program development',
    description: 'Develop new employee training program',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    title: 'Emergency system fix',
    description: 'Fix critical system issue affecting operations',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: new Date(Date.now()).toISOString(),
  },
];

export default function PrioritiesPage() {
  const handleTaskSelect = (task: Task) => {
    console.log('Selected task:', task);
    // In a real app, this would navigate to task details or open a modal
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Heading as="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Priorities
        </Heading>
        <Text variant="muted">
          Organize your tasks using the Eisenhower Matrix for optimal productivity
        </Text>
      </div>

      {/* Priority Matrix */}
      <div className="mb-8">
        <PriorityMatrix
          tasks={sampleTasks}
          onTaskSelect={handleTaskSelect}
        />
      </div>

      {/* Tips Section */}
      <Card>
        <div className="p-6">
          <Heading as="h3" className="text-lg font-semibold mb-4">
            How to Use the Priority Matrix
          </Heading>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 font-bold text-xs">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Do First (Urgent & Important)</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Critical tasks that need immediate attention. These are your fires to put out.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Schedule (Important, Not Urgent)</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Strategic tasks that move you forward. Plan and allocate dedicated time for these.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xs">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delegate (Urgent, Not Important)</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Tasks that need to be done but don't require your expertise. Consider automation or delegation.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 dark:text-gray-400 font-bold text-xs">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Later (Neither Urgent nor Important)</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Low-priority tasks that can wait. Consider if these are necessary at all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}