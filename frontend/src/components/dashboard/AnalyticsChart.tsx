import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line';
  color?: string;
  className?: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  type = 'bar',
  color = 'rgb(99, 102, 241)', // primary color
  className,
}) => {
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 200;
  const chartWidth = 400;
  const barWidth = chartWidth / data.length * 0.8;
  const barGap = chartWidth / data.length * 0.2;

  const renderBarChart = () => (
    <svg
      width="100%"
      height={chartHeight}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="w-full"
    >
      {data.map((point, index) => {
        const barHeight = (point.value / maxValue) * (chartHeight - 40);
        const x = index * (barWidth + barGap) + barGap / 2;
        const y = chartHeight - barHeight - 20;

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              opacity={0.8}
              className="hover:opacity-100 transition-opacity"
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="12"
              className="fill-gray-600 dark:fill-gray-400"
            >
              {point.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              className="fill-gray-700 dark:fill-gray-300"
            >
              {point.value}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((point.value / maxValue) * (chartHeight - 40)) - 20;
      return { x, y };
    });

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full"
      >
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              className="hover:r-6 transition-all"
            />
            <text
              x={point.x}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="12"
              className="fill-gray-600 dark:fill-gray-400"
            >
              {data[index].label}
            </text>
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="10"
              className="fill-gray-700 dark:fill-gray-300"
            >
              {data[index].value}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {type === 'bar' ? renderBarChart() : renderLineChart()}
        </div>
      </CardContent>
    </Card>
  );
};