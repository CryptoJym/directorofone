'use client';

import React, { useState } from 'react';
import { Heading, Text } from '@/components/ui/Typography';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WorkflowBuilder, Workflow } from '@/components/dashboard';

// Sample workflows
const sampleWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Daily Task Review',
    description: 'Automatically review and prioritize tasks each morning',
    steps: [
      { id: '1', type: 'trigger', name: 'Daily Schedule', description: 'Runs at 9:00 AM every day' },
      { id: '2', type: 'action', name: 'Create Task', description: 'Create daily review task' },
      { id: '3', type: 'action', name: 'Send Email', description: 'Send task summary email' },
    ],
    active: true,
  },
  {
    id: '2',
    name: 'High Priority Alert',
    description: 'Alert when high-priority tasks are created',
    steps: [
      { id: '1', type: 'trigger', name: 'On Task Creation', description: 'Triggers when a new task is created' },
      { id: '2', type: 'condition', name: 'If Priority High', description: 'Check if task priority is high' },
      { id: '3', type: 'action', name: 'Send Email', description: 'Send urgent notification' },
    ],
    active: true,
  },
  {
    id: '3',
    name: 'Weekly Report',
    description: 'Generate and send weekly productivity report',
    steps: [
      { id: '1', type: 'trigger', name: 'Weekly Schedule', description: 'Runs every Friday at 5:00 PM' },
      { id: '2', type: 'action', name: 'Generate Report', description: 'Create weekly summary report' },
      { id: '3', type: 'action', name: 'Send Email', description: 'Email report to stakeholders' },
    ],
    active: false,
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | undefined>(undefined);

  const handleSaveWorkflow = (workflow: Workflow) => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w => w.id === workflow.id ? workflow : w));
    } else {
      setWorkflows([...workflows, workflow]);
    }
    setShowBuilder(false);
    setEditingWorkflow(undefined);
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(workflows.map(w => 
      w.id === workflowId ? { ...w, active: !w.active } : w
    ));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Heading as="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Workflows
          </Heading>
          <Text variant="muted">Automate repetitive tasks and streamline your processes</Text>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <span className="mr-2">⚡</span> New Workflow
        </Button>
      </div>

      {showBuilder ? (
        <WorkflowBuilder
          workflow={editingWorkflow}
          onSave={handleSaveWorkflow}
          className="mb-8"
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="py-4">
                <Text variant="muted" className="text-sm">Total Workflows</Text>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workflows.length}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <Text variant="muted" className="text-sm">Active</Text>
                <p className="text-2xl font-bold text-green-600">{workflows.filter(w => w.active).length}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <Text variant="muted" className="text-sm">Tasks Automated</Text>
                <p className="text-2xl font-bold text-blue-600">127</p>
              </CardContent>
            </Card>
          </div>

          {/* Workflows List */}
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{workflow.name}</CardTitle>
                    {workflow.description && (
                      <Text variant="muted" className="text-sm mt-1">{workflow.description}</Text>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWorkflow(workflow.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        workflow.active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          workflow.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingWorkflow(workflow);
                        setShowBuilder(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {workflow.steps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            step.type === 'trigger' ? 'bg-blue-100 text-blue-700' :
                            step.type === 'action' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {step.name}
                          </span>
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}