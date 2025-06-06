'use client';

import { useState } from 'react';
import { ReportConfig, ReportType, DateRange } from '@/src/types/analytics';

interface ReportGeneratorProps {
  onGenerate: (config: Omit<ReportConfig, 'id'>) => void;
  onCancel: () => void;
}

export default function ReportGenerator({ onGenerate, onCancel }: ReportGeneratorProps) {
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState<ReportType>(ReportType.PRODUCTIVITY);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    preset: 'last30days'
  });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'totalTasks',
    'completedTasks',
    'taskCompletionRate'
  ]);

  const reportTypes = [
    { value: ReportType.PRODUCTIVITY, label: 'Productivity Report' },
    { value: ReportType.TASK_ANALYSIS, label: 'Task Analysis' },
    { value: ReportType.USER_ACTIVITY, label: 'User Activity' },
    { value: ReportType.PERFORMANCE, label: 'Performance Report' },
    { value: ReportType.CUSTOM, label: 'Custom Report' }
  ];

  const availableMetrics = [
    { value: 'totalTasks', label: 'Total Tasks' },
    { value: 'completedTasks', label: 'Completed Tasks' },
    { value: 'activeTasks', label: 'Active Tasks' },
    { value: 'taskCompletionRate', label: 'Task Completion Rate' },
    { value: 'averageCompletionTime', label: 'Average Completion Time' },
    { value: 'dailyActiveUsers', label: 'Daily Active Users' },
    { value: 'weeklyActiveUsers', label: 'Weekly Active Users' },
    { value: 'monthlyActiveUsers', label: 'Monthly Active Users' }
  ];

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handleGenerate = () => {
    if (!reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    onGenerate({
      name: reportName,
      type: reportType,
      dateRange,
      metrics: selectedMetrics,
      filters: {}
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Name
        </label>
        <input
          type="text"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter report name"
        />
      </div>

      {/* Report Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {reportTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({
                ...dateRange,
                start: new Date(e.target.value),
                preset: 'custom'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({
                ...dateRange,
                end: new Date(e.target.value),
                preset: 'custom'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Metrics Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Metrics
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
          {availableMetrics.map(metric => (
            <label key={metric.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.value)}
                onChange={() => handleMetricToggle(metric.value)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{metric.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}