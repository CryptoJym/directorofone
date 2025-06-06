'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  GeneratedReport, 
  ReportConfig, 
  ReportType,
  DateRange 
} from '@/src/types/analytics';
import ReportGenerator from './ReportGenerator';
import ReportsList from './ReportsList';

export default function ReportsSection() {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (config: Omit<ReportConfig, 'id'>) => {
    try {
      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports([newReport, ...reports]);
        setShowGenerator(false);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleExportReport = async (reportId: string, format: 'csv' | 'html' | 'pdf') => {
    try {
      const response = await fetch(`/api/analytics/reports/${reportId}/export?format=${format}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const handleViewReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/analytics/reports/${reportId}`);
      if (response.ok) {
        const report = await response.json();
        setSelectedReport(report);
      }
    } catch (error) {
      console.error('Failed to view report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="mt-1 text-sm text-gray-600">
            Generate and manage analytics reports
          </p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate New Report
        </button>
      </div>

      {/* Report Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Generate New Report</h3>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ReportGenerator
                onGenerate={handleGenerateReport}
                onCancel={() => setShowGenerator(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Report View */}
      {selectedReport && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{selectedReport.data.summary.title}</h3>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">{selectedReport.data.summary.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Generated: {format(new Date(selectedReport.generatedAt), 'PPP')}
              </p>
            </div>
            
            {/* Metrics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{selectedReport.data.metrics.totalTasks}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{selectedReport.data.metrics.completedTasks}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{selectedReport.data.metrics.taskCompletionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{selectedReport.data.metrics.dailyActiveUsers}</p>
              </div>
            </div>

            {/* Insights */}
            {selectedReport.data.insights && selectedReport.data.insights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {selectedReport.data.insights.map((insight: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {selectedReport.data.recommendations && selectedReport.data.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {selectedReport.data.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Export Options */}
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleExportReport(selectedReport.id, 'csv')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExportReport(selectedReport.id, 'html')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export HTML
              </button>
              <button
                onClick={() => handleExportReport(selectedReport.id, 'pdf')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      {!selectedReport && (
        <ReportsList
          reports={reports}
          loading={loading}
          onView={handleViewReport}
          onExport={handleExportReport}
        />
      )}
    </div>
  );
}