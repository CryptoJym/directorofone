import { useCallback } from 'react';
import { EventType } from '@/src/types/analytics';

interface TrackEventOptions {
  eventType: EventType;
  metadata?: Record<string, any>;
  sessionId?: string;
}

export function useAnalytics() {
  const trackEvent = useCallback(async (options: TrackEventOptions) => {
    try {
      // Get user ID from session/auth (placeholder)
      const userId = 'user-123'; // Replace with actual user ID from auth

      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options,
          userId,
          sessionId: options.sessionId || generateSessionId(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to track event');
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  const trackPageView = useCallback((pageName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: EventType.PAGE_VIEW,
      metadata: {
        ...metadata,
        page: pageName,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackTaskCreated = useCallback((taskId: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: EventType.TASK_CREATED,
      metadata: {
        ...metadata,
        taskId,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackTaskCompleted = useCallback((taskId: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: EventType.TASK_COMPLETED,
      metadata: {
        ...metadata,
        taskId,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackCustomEvent = useCallback((eventName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: EventType.CUSTOM,
      metadata: {
        ...metadata,
        eventName,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackTaskCreated,
    trackTaskCompleted,
    trackCustomEvent,
  };
}

// Generate a simple session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}