// Analytics Types and Constants

const EventType = {
  PAGE_VIEW: 'page_view',
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  TASK_UPDATED: 'task_updated',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  REPORT_GENERATED: 'report_generated',
  CUSTOM: 'custom'
};

const ReportType = {
  PRODUCTIVITY: 'productivity',
  TASK_ANALYSIS: 'task_analysis',
  USER_ACTIVITY: 'user_activity',
  PERFORMANCE: 'performance',
  CUSTOM: 'custom'
};

module.exports = {
  EventType,
  ReportType
};