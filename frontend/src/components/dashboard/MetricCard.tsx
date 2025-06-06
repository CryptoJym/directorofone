import React from 'react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { Text } from '../ui/Typography';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  trend = 'neutral',
  icon,
  className,
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  };

  const trendBgColors = {
    up: 'bg-green-500',
    down: 'bg-red-500',
    neutral: 'bg-gray-300',
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Text variant="muted" className="text-sm mb-1">{label}</Text>
            <CardTitle className="text-3xl font-bold">{value}</CardTitle>
            {change && (
              <Text className={`text-sm font-medium mt-1 ${trendColors[trend]}`}>
                {change}
              </Text>
            )}
          </div>
          {icon && (
            <div className="text-primary-500 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <div className={`absolute inset-x-0 bottom-0 h-1 ${trendBgColors[trend]}`} />
    </Card>
  );
};