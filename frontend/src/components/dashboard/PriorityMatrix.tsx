import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Task } from './TaskItem';

interface PriorityMatrixProps {
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({
  tasks,
  onTaskSelect,
  className,
}) => {
  // Categorize tasks into quadrants
  const categorizedTasks = {
    urgent: tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed'),
    important: tasks.filter(t => t.priority === 'medium' && t.status !== 'completed'),
    delegate: tasks.filter(t => t.priority === 'low' && t.status !== 'completed'),
    schedule: tasks.filter(t => t.status === 'pending' && !['urgent', 'high'].includes(t.priority)),
  };

  const quadrants = [
    {
      title: 'Do First',
      subtitle: 'Urgent & Important',
      tasks: categorizedTasks.urgent,
      color: 'border-red-500 bg-red-50 dark:bg-red-900/10',
      textColor: 'text-red-700 dark:text-red-300',
    },
    {
      title: 'Schedule',
      subtitle: 'Important, Not Urgent',
      tasks: categorizedTasks.important,
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Delegate',
      subtitle: 'Urgent, Not Important',
      tasks: categorizedTasks.delegate,
      color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
      textColor: 'text-yellow-700 dark:text-yellow-300',
    },
    {
      title: 'Later',
      subtitle: 'Neither Urgent nor Important',
      tasks: categorizedTasks.schedule.slice(0, 5),
      color: 'border-gray-500 bg-gray-50 dark:bg-gray-900/10',
      textColor: 'text-gray-700 dark:text-gray-300',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {quadrants.map((quadrant, index) => (
        <Card
          key={index}
          className={`border-2 ${quadrant.color} hover:shadow-lg transition-shadow`}
        >
          <CardHeader>
            <CardTitle className={quadrant.textColor}>{quadrant.title}</CardTitle>
            <p className={`text-sm ${quadrant.textColor} opacity-75`}>
              {quadrant.subtitle}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {quadrant.tasks.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 dark:text-gray-400 italic">
                No tasks in this quadrant
              </p>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {quadrant.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => onTaskSelect?.(task)}
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};