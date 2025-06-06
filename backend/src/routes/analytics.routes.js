const { analyticsService } = require('../utils/analytics.service');
const { reportService } = require('../utils/report.service');

// Track an analytics event
const trackEvent = async (req, res) => {
  try {
    const { eventType, userId, metadata, sessionId } = req.body;

    if (!eventType || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: eventType and userId' 
      });
    }

    const event = analyticsService.trackEvent({
      eventType,
      userId,
      metadata,
      sessionId
    });

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' });
  }
};

// Record a metric
const recordMetric = async (req, res) => {
  try {
    const { name, value, tags } = req.body;

    if (!name || value === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: name and value' 
      });
    }

    const metric = analyticsService.recordMetric(name, value, tags);
    res.json({ success: true, metric });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record metric' });
  }
};

// Get dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateRange;
    if (startDate && endDate) {
      dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }

    const metrics = analyticsService.getDashboardMetrics(dateRange);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard metrics' });
  }
};

// Get time series data
const getTimeSeriesData = async (req, res) => {
  try {
    const { metric } = req.params;
    const { startDate, endDate, interval = 'day' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required query parameters: startDate and endDate' 
      });
    }

    const dateRange = {
      start: new Date(startDate),
      end: new Date(endDate)
    };

    const data = analyticsService.getTimeSeriesData(
      metric,
      dateRange,
      interval
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get time series data' });
  }
};

// Get chart data
const getChartData = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let dateRange;
    if (startDate && endDate) {
      dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }

    const chartData = analyticsService.getChartData(type, dateRange);
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chart data' });
  }
};

// Generate a report
const generateReport = async (req, res) => {
  try {
    const { name, type, dateRange, metrics, filters, schedule } = req.body;

    if (!name || !type || !dateRange) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, type, and dateRange' 
      });
    }

    const config = {
      id: `config-${Date.now()}`,
      name,
      type,
      dateRange: {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end),
        preset: dateRange.preset
      },
      metrics: metrics || [],
      filters,
      schedule
    };

    const report = await reportService.generateReport(config);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Get all reports
const getReports = async (req, res) => {
  try {
    const { type, userId } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (userId) filters.userId = userId;

    const reports = reportService.getReports(
      Object.keys(filters).length > 0 ? filters : undefined
    );

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reports' });
  }
};

// Get a specific report
const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = reportService.getReport(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get report' });
  }
};

// Export a report
const exportReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'csv' } = req.query;

    const exportData = await reportService.exportReport(id, format);

    // Set appropriate headers based on format
    switch (format) {
      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=report-${id}.csv`);
        break;
      case 'html':
        res.setHeader('Content-Type', 'text/html');
        break;
      case 'pdf':
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report-${id}.pdf`);
        break;
    }

    res.send(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export report' });
  }
};

module.exports = {
  trackEvent,
  recordMetric,
  getDashboardMetrics,
  getTimeSeriesData,
  getChartData,
  generateReport,
  getReports,
  getReport,
  exportReport
};