// Analytics Types and Interfaces

export interface AnalyticsEvent {
  id: string;
  eventType: EventType;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  sessionId?: string;
}

export enum EventType {
  PAGE_VIEW = 'page_view',
  TASK_CREATED = 'task_created',
  TASK_COMPLETED = 'task_completed',
  TASK_UPDATED = 'task_updated',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  REPORT_GENERATED = 'report_generated',
  CUSTOM = 'custom'
}

export interface MetricData {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  averageCompletionTime: number;
  taskCompletionRate: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface ReportConfig {
  id: string;
  name: string;
  type: ReportType;
  dateRange: DateRange;
  metrics: string[];
  filters?: Record<string, any>;
  schedule?: ReportSchedule;
}

export enum ReportType {
  PRODUCTIVITY = 'productivity',
  TASK_ANALYSIS = 'task_analysis',
  USER_ACTIVITY = 'user_activity',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

export interface DateRange {
  start: Date;
  end: Date;
  preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'lastMonth' | 'custom';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  recipients: string[];
}

export interface GeneratedReport {
  id: string;
  config: ReportConfig;
  generatedAt: Date;
  data: any;
  format: 'pdf' | 'csv' | 'json' | 'html';
  url?: string;
}