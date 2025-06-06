const { EventType } = require('./analytics.types');

// In-memory storage for demo purposes - replace with database in production
class AnalyticsStore {
  constructor() {
    this.events = [];
    this.metrics = [];
  }

  addEvent(event) {
    this.events.push(event);
  }

  addMetric(metric) {
    this.metrics.push(metric);
  }

  getEvents(filters) {
    if (!filters) return this.events;
    
    return this.events.filter(event => {
      return Object.entries(filters).every(([key, value]) => {
        return event[key] === value;
      });
    });
  }

  getEventsByDateRange(start, end) {
    return this.events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= start && eventDate <= end;
    });
  }

  getMetrics(name) {
    if (!name) return this.metrics;
    return this.metrics.filter(metric => metric.name === name);
  }
}

class AnalyticsService {
  constructor() {
    this.store = new AnalyticsStore();
  }

  // Track an analytics event
  trackEvent(eventData) {
    const event = {
      ...eventData,
      id: this.generateId(),
      timestamp: new Date()
    };
    
    this.store.addEvent(event);
    
    // Update related metrics
    this.updateMetricsForEvent(event);
    
    return event;
  }

  // Record a metric
  recordMetric(name, value, tags) {
    const metric = {
      name,
      value,
      timestamp: new Date(),
      tags
    };
    
    this.store.addMetric(metric);
    return metric;
  }

  // Get dashboard metrics
  getDashboardMetrics(dateRange) {
    const events = dateRange 
      ? this.store.getEventsByDateRange(dateRange.start, dateRange.end)
      : this.store.getEvents();

    const taskEvents = events.filter(e => 
      [EventType.TASK_CREATED, EventType.TASK_COMPLETED, EventType.TASK_UPDATED].includes(e.eventType)
    );

    const completedTasks = taskEvents.filter(e => e.eventType === EventType.TASK_COMPLETED);
    const createdTasks = taskEvents.filter(e => e.eventType === EventType.TASK_CREATED);

    // Calculate average completion time (mock data for demo)
    const avgCompletionTime = completedTasks.length > 0 ? 4.5 : 0; // hours

    // Calculate active users
    const uniqueUsers = new Set(events.map(e => e.userId));
    const dau = this.calculateDAU(events);
    const wau = this.calculateWAU(events);
    const mau = this.calculateMAU(events);

    return {
      totalTasks: createdTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: createdTasks.length - completedTasks.length,
      averageCompletionTime: avgCompletionTime,
      taskCompletionRate: createdTasks.length > 0 
        ? (completedTasks.length / createdTasks.length) * 100 
        : 0,
      dailyActiveUsers: dau,
      weeklyActiveUsers: wau,
      monthlyActiveUsers: mau
    };
  }

  // Get time series data for charts
  getTimeSeriesData(
    metricName, 
    dateRange, 
    interval
  ) {
    const events = this.store.getEventsByDateRange(dateRange.start, dateRange.end);
    const data = [];
    
    // Group events by interval
    const groupedData = this.groupEventsByInterval(events, interval);
    
    Object.entries(groupedData).forEach(([timestamp, events]) => {
      data.push({
        timestamp: new Date(timestamp),
        value: events.length,
        label: this.formatTimestamp(new Date(timestamp), interval)
      });
    });

    return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Get chart data for various metrics
  getChartData(chartType, dateRange) {
    const events = dateRange 
      ? this.store.getEventsByDateRange(dateRange.start, dateRange.end)
      : this.store.getEvents();

    switch (chartType) {
      case 'taskStatus':
        return this.getTaskStatusChartData(events);
      case 'userActivity':
        return this.getUserActivityChartData(events);
      case 'productivity':
        return this.getProductivityChartData(events);
      default:
        return { labels: [], datasets: [] };
    }
  }

  // Private helper methods
  updateMetricsForEvent(event) {
    switch (event.eventType) {
      case EventType.TASK_COMPLETED:
        this.recordMetric('tasks_completed', 1, { userId: event.userId });
        break;
      case EventType.TASK_CREATED:
        this.recordMetric('tasks_created', 1, { userId: event.userId });
        break;
      case EventType.USER_LOGIN:
        this.recordMetric('user_logins', 1, { userId: event.userId });
        break;
    }
  }

  calculateDAU(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = events.filter(e => {
      const eventDate = new Date(e.timestamp);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
    
    return new Set(todayEvents.map(e => e.userId)).size;
  }

  calculateWAU(events) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEvents = events.filter(e => new Date(e.timestamp) >= weekAgo);
    return new Set(weekEvents.map(e => e.userId)).size;
  }

  calculateMAU(events) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const monthEvents = events.filter(e => new Date(e.timestamp) >= monthAgo);
    return new Set(monthEvents.map(e => e.userId)).size;
  }

  groupEventsByInterval(events, interval) {
    const grouped = {};
    
    events.forEach(event => {
      const key = this.getIntervalKey(event.timestamp, interval);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(event);
    });
    
    return grouped;
  }

  getIntervalKey(date, interval) {
    const d = new Date(date);
    
    switch (interval) {
      case 'hour':
        d.setMinutes(0, 0, 0);
        break;
      case 'day':
        d.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        break;
      case 'month':
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        break;
    }
    
    return d.toISOString();
  }

  formatTimestamp(date, interval) {
    switch (interval) {
      case 'hour':
        return date.toLocaleString('en-US', { hour: 'numeric', day: 'numeric', month: 'short' });
      case 'day':
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      case 'week':
        return `Week of ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  }

  getTaskStatusChartData(events) {
    const created = events.filter(e => e.eventType === EventType.TASK_CREATED).length;
    const completed = events.filter(e => e.eventType === EventType.TASK_COMPLETED).length;
    const active = created - completed;
    
    return {
      labels: ['Active', 'Completed'],
      datasets: [{
        label: 'Task Status',
        data: [active, completed],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  }

  getUserActivityChartData(events) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });
    
    const activityByDay = last7Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayEvents = events.filter(e => {
        const eventDate = new Date(e.timestamp);
        return eventDate >= date && eventDate < nextDay;
      });
      
      return new Set(dayEvents.map(e => e.userId)).size;
    });
    
    return {
      labels: last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        label: 'Active Users',
        data: activityByDay,
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 2
      }]
    };
  }

  getProductivityChartData(events) {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });
    
    const tasksByDay = last30Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      return events.filter(e => {
        const eventDate = new Date(e.timestamp);
        return e.eventType === EventType.TASK_COMPLETED && 
               eventDate >= date && eventDate < nextDay;
      }).length;
    });
    
    return {
      labels: last30Days.map(d => d.getDate().toString()),
      datasets: [{
        label: 'Tasks Completed',
        data: tasksByDay,
        backgroundColor: '#06b6d4',
        borderColor: '#0891b2',
        borderWidth: 1
      }]
    };
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
module.exports = { analyticsService };