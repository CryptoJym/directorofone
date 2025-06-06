'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from '@/src/types/analytics';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  const presets = [
    { label: 'Today', value: 'today', days: 0 },
    { label: 'Yesterday', value: 'yesterday', days: 1 },
    { label: 'Last 7 days', value: 'last7days', days: 7 },
    { label: 'Last 30 days', value: 'last30days', days: 30 },
    { label: 'Last Month', value: 'lastMonth', days: 'lastMonth' },
    { label: 'Custom', value: 'custom', days: null }
  ];

  const handlePresetClick = (preset: string, days: number | string | null) => {
    if (preset === 'custom') {
      setShowCustom(true);
      return;
    }

    let start: Date;
    let end = new Date();

    if (days === 'lastMonth') {
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (typeof days === 'number') {
      start = new Date();
      start.setDate(start.getDate() - days);
      if (days === 1) {
        end = new Date(start);
      }
    } else {
      return;
    }

    onChange({
      start,
      end,
      preset: preset as DateRange['preset']
    });
    setShowCustom(false);
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    onChange({
      ...dateRange,
      [type]: date,
      preset: 'custom'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Date Range</h3>
        <div className="text-sm text-gray-500">
          {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value, preset.days)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              dateRange.preset === preset.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={format(dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={format(dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}