# Analytics & Reporting System Guide

## Overview

The Analytics & Reporting system provides comprehensive tracking, analysis, and reporting capabilities for the Director of One application. It includes real-time analytics dashboards, customizable reports, and export functionality.

## Features

### 1. Analytics Dashboard
- **Real-time Metrics**: View key performance indicators including task completion rates, user activity, and productivity metrics
- **Interactive Charts**: Visual representations of data using pie charts, bar graphs, and line charts
- **Date Range Selection**: Filter data by predefined ranges (Today, Yesterday, Last 7/30 days) or custom dates
- **Insights & Recommendations**: AI-generated insights based on current metrics

### 2. Event Tracking
- Automatic tracking of user actions and system events
- Support for custom events
- Session tracking for user behavior analysis

### 3. Report Generation
- **Report Types**:
  - Productivity Reports
  - Task Analysis
  - User Activity Reports
  - Performance Reports
  - Custom Reports
- **Export Formats**: CSV, HTML, PDF (PDF requires additional setup)
- **Scheduled Reports**: Configure reports to be generated automatically

## Implementation Details

### Backend Architecture

#### Analytics Service (`backend/src/utils/analytics.service.js`)
- Manages event tracking and metric collection
- Provides dashboard metrics calculation
- Generates chart data for visualization

#### Report Service (`backend/src/utils/report.service.js`)
- Handles report generation and storage
- Provides export functionality
- Generates insights and recommendations

#### API Endpoints

**Analytics Endpoints:**
- `POST /api/analytics/events` - Track an analytics event
- `POST /api/analytics/metrics` - Record a metric
- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/timeseries/:metric` - Get time series data
- `GET /api/analytics/charts/:type` - Get chart data

**Reporting Endpoints:**
- `POST /api/analytics/reports` - Generate a new report
- `GET /api/analytics/reports` - List all reports
- `GET /api/analytics/reports/:id` - Get specific report
- `GET /api/analytics/reports/:id/export` - Export report

### Frontend Components

#### Analytics Page (`frontend/app/analytics/page.tsx`)
Main page with tabs for Dashboard and Reports sections.

#### Dashboard Components
- `AnalyticsDashboard.tsx` - Main dashboard container
- `MetricCard.tsx` - Displays individual metrics
- `ChartCard.tsx` - Container for charts
- `DateRangePicker.tsx` - Date range selection

#### Reports Components
- `ReportsSection.tsx` - Reports management interface
- `ReportGenerator.tsx` - Form for creating new reports
- `ReportsList.tsx` - List view of generated reports

## Usage Examples

### Tracking Events

Use the `useAnalytics` hook in your React components:

```typescript
import { useAnalytics } from '@/src/hooks/useAnalytics';

function MyComponent() {
  const { trackTaskCreated, trackPageView } = useAnalytics();

  const handleTaskCreate = (taskId: string) => {
    // Your task creation logic
    trackTaskCreated(taskId, { priority: 'high' });
  };

  useEffect(() => {
    trackPageView('MyComponent');
  }, []);
}
```

### Generating Reports

1. Navigate to Analytics & Reporting page
2. Click "Generate New Report"
3. Fill in report details:
   - Name
   - Type (Productivity, Task Analysis, etc.)
   - Date Range
   - Select metrics to include
4. Click "Generate Report"

### Viewing Analytics

The dashboard automatically displays:
- Task metrics (total, completed, active)
- User activity metrics (DAU, WAU, MAU)
- Visual charts showing trends
- AI-generated insights

## Configuration

### Environment Variables

Add to your `.env` file:

```
# Analytics Configuration
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=90
```

### Database Integration

The current implementation uses in-memory storage. For production:

1. Replace the `AnalyticsStore` class with database queries
2. Implement data persistence for events and reports
3. Add data retention policies

## Best Practices

1. **Event Naming**: Use consistent, descriptive event names
2. **Metadata**: Include relevant context in event metadata
3. **Performance**: Batch analytics calls when possible
4. **Privacy**: Ensure user consent before tracking
5. **Data Retention**: Implement cleanup for old analytics data

## Troubleshooting

### Common Issues

1. **No data showing**: Check that events are being tracked correctly
2. **Charts not rendering**: Ensure date ranges contain data
3. **Export failing**: Verify file permissions and format support

### Debug Mode

Enable debug logging:

```javascript
// In analytics service
const DEBUG = process.env.ANALYTICS_DEBUG === 'true';
if (DEBUG) console.log('Analytics event:', event);
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live metrics
2. **Advanced Filtering**: More granular report filters
3. **Custom Dashboards**: User-configurable dashboard layouts
4. **Predictive Analytics**: ML-based trend predictions
5. **Integration APIs**: Connect with external analytics platforms

## API Reference

See the backend route files for detailed API documentation:
- `backend/src/routes/analytics.routes.js`

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API endpoints are accessible
3. Ensure proper authentication/authorization
4. Review the implementation files for detailed comments