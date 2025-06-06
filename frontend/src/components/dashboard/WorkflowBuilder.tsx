import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  description?: string;
  config?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  active: boolean;
}

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  className?: string;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onSave,
  className,
}) => {
  const [steps, setSteps] = useState<WorkflowStep[]>(workflow?.steps || []);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');

  const stepTypes = {
    trigger: {
      icon: '⚡',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      borderColor: 'border-blue-500',
    },
    action: {
      icon: '🔧',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
      borderColor: 'border-green-500',
    },
    condition: {
      icon: '🔀',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
      borderColor: 'border-purple-500',
    },
  };

  const availableSteps = [
    { type: 'trigger' as const, name: 'On Task Creation', description: 'Triggers when a new task is created' },
    { type: 'trigger' as const, name: 'Daily Schedule', description: 'Runs at a specified time each day' },
    { type: 'action' as const, name: 'Send Email', description: 'Send an email notification' },
    { type: 'action' as const, name: 'Create Task', description: 'Create a new task automatically' },
    { type: 'action' as const, name: 'Update Status', description: 'Update task or project status' },
    { type: 'condition' as const, name: 'If Priority High', description: 'Check if task priority is high' },
    { type: 'condition' as const, name: 'If Due Today', description: 'Check if task is due today' },
  ];

  const addStep = (step: typeof availableSteps[0]) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type: step.type,
      name: step.name,
      description: step.description,
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: workflow?.id || Date.now().toString(),
        name: workflowName,
        steps,
        active: workflow?.active || true,
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Workflow Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workflow Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workflow Name
          </label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Enter workflow name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        {/* Current Steps */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workflow Steps
          </label>
          <div className="space-y-2">
            {steps.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No steps added yet. Add a trigger to get started.
              </p>
            ) : (
              steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${stepTypes[step.type].borderColor} ${stepTypes[step.type].color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stepTypes[step.type].icon}</span>
                    <div>
                      <p className="font-medium">{step.name}</p>
                      {step.description && (
                        <p className="text-xs opacity-75">{step.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Steps */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Step
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => addStep(step)}
                className="flex items-start gap-2 p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">{stepTypes[step.type].icon}</span>
                <div>
                  <p className="font-medium text-sm">{step.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!workflowName || steps.length === 0}
          >
            Save Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};