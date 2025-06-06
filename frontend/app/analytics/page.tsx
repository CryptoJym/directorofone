'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AnalyticsDashboard from '@/src/components/analytics/AnalyticsDashboard';
import ReportsSection from '@/src/components/analytics/ReportsSection';
import { 
  DashboardMetrics, 
  ChartData,
  DateRange 
} from '@/src/types/analytics';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports'>('dashboard');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    preset: 'last30days'
  });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<Record<string, ChartData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard metrics
      const metricsResponse = await fetch(
        `/api/analytics/dashboard?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
      );
      const metricsData = await metricsResponse.json();
      setMetrics(metricsData);

      // Fetch chart data
      const chartTypes = ['taskStatus', 'userActivity', 'productivity'];
      const chartPromises = chartTypes.map(async (type) => {
        const response = await fetch(
          `/api/analytics/charts/${type}?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`
        );
        const data = await response.json();
        return { type, data };
      });

      const chartResults = await Promise.all(chartPromises);
      const newChartData: Record<string, ChartData> = {};
      chartResults.forEach(({ type, data }) => {
        newChartData[type] = data;
      });
      setChartData(newChartData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="mt-2 text-gray-600">
            Track performance metrics and generate comprehensive reports
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 mb-8 rounded-t-lg">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' ? (
          <AnalyticsDashboard
            metrics={metrics}
            chartData={chartData}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            loading={loading}
          />
        ) : (
          <ReportsSection />
        )}
      </div>
    </div>
  );
}