import React from 'react';

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date | string;
  assignee?: string;
  tags?: string[];
}

interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string | number, status: Task['status']) => void;
  onSelect?: (task: Task) => void;
  showDetails?: boolean;
  className?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onSelect,
  showDetails = false,
  className,
}) => {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    urgent: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  };

  const statusColors = {
    pending: 'text-gray-500',
    'in-progress': 'text-blue-600',
    completed: 'text-green-600',
    archived: 'text-gray-400',
  };

  const handleCheckboxChange = () => {
    if (onStatusChange) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <div
      className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
      onClick={() => onSelect?.(task)}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="flex-1">
          <p className={`font-medium ${
            task.status === 'completed' 
              ? 'line-through text-gray-500 dark:text-gray-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </p>
          {showDetails && task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-xs ${statusColors[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.tags && task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4"
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(task);
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};