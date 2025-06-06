import { format } from 'date-fns';
import { GeneratedReport, ReportType } from '@/src/types/analytics';

interface ReportsListProps {
  reports: GeneratedReport[];
  loading: boolean;
  onView: (reportId: string) => void;
  onExport: (reportId: string, format: 'csv' | 'html' | 'pdf') => void;
}

export default function ReportsList({ reports, loading, onView, onExport }: ReportsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new report.
        </p>
      </div>
    );
  }

  const getReportTypeLabel = (type: ReportType): string => {
    const labels: Record<ReportType, string> = {
      [ReportType.PRODUCTIVITY]: 'Productivity',
      [ReportType.TASK_ANALYSIS]: 'Task Analysis',
      [ReportType.USER_ACTIVITY]: 'User Activity',
      [ReportType.PERFORMANCE]: 'Performance',
      [ReportType.CUSTOM]: 'Custom'
    };
    return labels[type] || type;
  };

  const getReportTypeColor = (type: ReportType): string => {
    const colors: Record<ReportType, string> = {
      [ReportType.PRODUCTIVITY]: 'bg-blue-100 text-blue-800',
      [ReportType.TASK_ANALYSIS]: 'bg-green-100 text-green-800',
      [ReportType.USER_ACTIVITY]: 'bg-purple-100 text-purple-800',
      [ReportType.PERFORMANCE]: 'bg-yellow-100 text-yellow-800',
      [ReportType.CUSTOM]: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {reports.map((report) => (
          <li key={report.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {report.config.name}
                    </h3>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      getReportTypeColor(report.config.type)
                    }`}>
                      {getReportTypeLabel(report.config.type)}
                    </span>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Generated {format(new Date(report.generatedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {format(new Date(report.config.dateRange.start), 'MMM d')} - {format(new Date(report.config.dateRange.end), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(report.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <div className="relative group">
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      Export
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => onExport(report.id, 'csv')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export CSV
                        </button>
                        <button
                          onClick={() => onExport(report.id, 'html')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export HTML
                        </button>
                        <button
                          onClick={() => onExport(report.id, 'pdf')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}