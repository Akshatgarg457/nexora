import { apiClient, executeApiCall } from './client';
import { AnalyticsSummary, TimeSeriesPoint, CategoryMetric } from '../types';
import {
  initialAnalyticsSummary,
  analyticsTrends30d,
  analyticsTrends7d,
  analyticsTrends90d,
  usageByCategory,
  simulatedInsights,
} from '../mocks/analytics';

export const analyticsApi = {
  /**
   * GET /api/analytics/summary?range=30d
   */
  async getSummary(range: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsSummary> {
    return executeApiCall<AnalyticsSummary>(
      () => apiClient.get(`/analytics/summary?range=${range}`),
      () => ({ ...initialAnalyticsSummary, dateRange: range })
    );
  },

  /**
   * GET /api/analytics/trends?range=30d
   */
  async getTrends(range: '7d' | '30d' | '90d' = '30d'): Promise<TimeSeriesPoint[]> {
    return executeApiCall<TimeSeriesPoint[]>(
      () => apiClient.get(`/analytics/trends?range=${range}`),
      () => {
        if (range === '7d') return analyticsTrends7d;
        if (range === '90d') return analyticsTrends90d;
        return analyticsTrends30d;
      }
    );
  },

  /**
   * GET /api/analytics/categories
   */
  async getCategoryMetrics(): Promise<CategoryMetric[]> {
    return executeApiCall<CategoryMetric[]>(
      () => apiClient.get('/analytics/categories'),
      () => usageByCategory
    );
  },

  /**
   * GET /api/analytics/insights
   */
  async getInsights() {
    return executeApiCall(
      () => apiClient.get('/analytics/insights'),
      () => simulatedInsights
    );
  },
};
