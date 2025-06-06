const { ReportType, EventType } = require('./analytics.types');
const { analyticsService } = require('./analytics.service');

class ReportService {
  constructor() {
    this.reports = [];
  }

  // Generate a report based on configuration
  async generateReport(config) {
    const reportData = await this.collectReportData(config);
    
    const report = {
      id: this.generateId(),
      config,
      generatedAt: new Date(),
      data: reportData,
      format: 'json' // Default format
    };

    // Store the report
    this.reports.push(report);

    // Track report generation event
    analyticsService.trackEvent({
      eventType: EventType.REPORT_GENERATED,
      userId: 'system',
      metadata: {
        reportType: config.type,
        reportId: report.id
      }
    });

    return report;
  }

  // Get all generated reports
  getReports(filters) {
    if (!filters) return this.reports;

    return this.reports.filter(report => {
      if (filters.type && report.config.type !== filters.type) return false;
      return true;
    });
  }

  // Get a specific report
  getReport(id) {
    return this.reports.find(report => report.id === id);
  }

  // Export report in different formats
  async exportReport(reportId, format) {
    const report = this.getReport(reportId);
    if (!report) throw new Error('Report not found');

    switch (format) {
      case 'csv':
        return this.exportToCSV(report);
      case 'html':
        return this.exportToHTML(report);
      case 'pdf':
        // PDF generation would require additional libraries
        return this.exportToPDF(report);
      default:
        throw new Error('Unsupported format');
    }
  }

  // Private methods
  async collectReportData(config) {
    const metrics = analyticsService.getDashboardMetrics(config.dateRange);
    
    const charts = {
      taskStatus: analyticsService.getChartData('taskStatus', config.dateRange),
      userActivity: analyticsService.getChartData('userActivity', config.dateRange),
      productivity: analyticsService.getChartData('productivity', config.dateRange)
    };

    const insights = this.generateInsights(metrics, config);
    const recommendations = this.generateRecommendations(metrics, config);

    return {
      summary: {
        title: this.getReportTitle(config),
        description: this.getReportDescription(config),
        generatedAt: new Date(),
        dateRange: config.dateRange
      },
      metrics,
      charts,
      insights,
      recommendations
    };
  }

  getReportTitle(config) {
    const titles = {
      [ReportType.PRODUCTIVITY]: 'Productivity Report',
      [ReportType.TASK_ANALYSIS]: 'Task Analysis Report',
      [ReportType.USER_ACTIVITY]: 'User Activity Report',
      [ReportType.PERFORMANCE]: 'Performance Report',
      [ReportType.CUSTOM]: config.name || 'Custom Report'
    };
    return titles[config.type];
  }

  getReportDescription(config) {
    const descriptions = {
      [ReportType.PRODUCTIVITY]: 'Analysis of team productivity metrics and task completion rates',
      [ReportType.TASK_ANALYSIS]: 'Detailed breakdown of task creation, completion, and lifecycle',
      [ReportType.USER_ACTIVITY]: 'User engagement and activity patterns analysis',
      [ReportType.PERFORMANCE]: 'System and user performance metrics overview',
      [ReportType.CUSTOM]: 'Custom report based on selected metrics'
    };
    return descriptions[config.type];
  }

  generateInsights(metrics, config) {
    const insights = [];

    // Task completion insights
    if (metrics.taskCompletionRate > 80) {
      insights.push(`Excellent task completion rate of ${metrics.taskCompletionRate.toFixed(1)}%`);
    } else if (metrics.taskCompletionRate < 50) {
      insights.push(`Task completion rate is below 50% - consider reviewing task complexity`);
    }

    // User activity insights
    if (metrics.dailyActiveUsers > metrics.weeklyActiveUsers * 0.7) {
      insights.push('High daily user engagement - users are actively using the platform');
    }

    // Productivity insights
    if (metrics.averageCompletionTime > 0) {
      insights.push(`Average task completion time is ${metrics.averageCompletionTime.toFixed(1)} hours`);
    }

    // Active tasks insights
    if (metrics.activeTasks > metrics.completedTasks * 2) {
      insights.push('High number of active tasks - consider prioritization strategies');
    }

    return insights;
  }

  generateRecommendations(metrics, config) {
    const recommendations = [];

    // Task management recommendations
    if (metrics.taskCompletionRate < 60) {
      recommendations.push('Consider breaking down large tasks into smaller, manageable subtasks');
      recommendations.push('Review and prioritize tasks based on importance and urgency');
    }

    if (metrics.activeTasks > 50) {
      recommendations.push('Implement task batching to improve focus and completion rates');
    }

    // User engagement recommendations
    if (metrics.dailyActiveUsers < metrics.monthlyActiveUsers * 0.3) {
      recommendations.push('Increase user engagement through notifications or reminders');
      recommendations.push('Consider gamification elements to boost daily usage');
    }

    // Performance recommendations
    if (metrics.averageCompletionTime > 8) {
      recommendations.push('Analyze tasks with long completion times for optimization opportunities');
      recommendations.push('Provide better task templates and automation tools');
    }

    return recommendations;
  }

  exportToCSV(report) {
    const data = report.data;
    const rows = [];

    // Header
    rows.push('Metric,Value');

    // Metrics
    rows.push(`Total Tasks,${data.metrics.totalTasks}`);
    rows.push(`Completed Tasks,${data.metrics.completedTasks}`);
    rows.push(`Active Tasks,${data.metrics.activeTasks}`);
    rows.push(`Task Completion Rate,${data.metrics.taskCompletionRate.toFixed(1)}%`);
    rows.push(`Average Completion Time,${data.metrics.averageCompletionTime.toFixed(1)} hours`);
    rows.push(`Daily Active Users,${data.metrics.dailyActiveUsers}`);
    rows.push(`Weekly Active Users,${data.metrics.weeklyActiveUsers}`);
    rows.push(`Monthly Active Users,${data.metrics.monthlyActiveUsers}`);

    return rows.join('\n');
  }

  exportToHTML(report) {
    const data = report.data;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.summary.title}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2, h3 { color: #333; }
        .metric { margin: 10px 0; }
        .metric-label { font-weight: bold; }
        .insight { margin: 5px 0; padding: 10px; background: #f0f0f0; }
        .recommendation { margin: 5px 0; padding: 10px; background: #e8f4f8; }
    </style>
</head>
<body>
    <h1>${data.summary.title}</h1>
    <p>${data.summary.description}</p>
    <p>Generated: ${data.summary.generatedAt.toLocaleString()}</p>
    
    <h2>Key Metrics</h2>
    <div class="metric">
        <span class="metric-label">Total Tasks:</span> ${data.metrics.totalTasks}
    </div>
    <div class="metric">
        <span class="metric-label">Completed Tasks:</span> ${data.metrics.completedTasks}
    </div>
    <div class="metric">
        <span class="metric-label">Task Completion Rate:</span> ${data.metrics.taskCompletionRate.toFixed(1)}%
    </div>
    <div class="metric">
        <span class="metric-label">Daily Active Users:</span> ${data.metrics.dailyActiveUsers}
    </div>
    
    <h2>Insights</h2>
    ${data.insights.map(insight => `<div class="insight">${insight}</div>`).join('')}
    
    <h2>Recommendations</h2>
    ${data.recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('')}
</body>
</html>
    `;
  }

  exportToPDF(report) {
    // This would require a PDF generation library like jsPDF or puppeteer
    // For now, return a placeholder
    return 'PDF export requires additional libraries';
  }

  generateId() {
    return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
const reportService = new ReportService();
module.exports = { reportService };