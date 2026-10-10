import { AnalyticsSummary, CategoryMetric, TimeSeriesPoint } from '../types';

export const initialAnalyticsSummary: AnalyticsSummary = {
  revenue: 148520,
  revenueChange: 12.8,
  activeUsers: 8420,
  activeUsersChange: -4.3, // Reflects the declining product usage prompt
  conversionRate: 3.82,
  conversionRateChange: 0.65,
  productUsageHours: 32400,
  usageChange: -8.1,
  dateRange: '30d',
};

export const analyticsTrends30d: TimeSeriesPoint[] = [
  { date: 'Sep 12', revenue: 4100, activeUsers: 9100, conversionRate: 4.1, sessions: 18200 },
  { date: 'Sep 16', revenue: 4400, activeUsers: 9050, conversionRate: 4.0, sessions: 18100 },
  { date: 'Sep 20', revenue: 4800, activeUsers: 8900, conversionRate: 3.9, sessions: 17800 },
  { date: 'Sep 24', revenue: 5200, activeUsers: 8820, conversionRate: 3.9, sessions: 17400 },
  { date: 'Sep 28', revenue: 5100, activeUsers: 8650, conversionRate: 3.8, sessions: 16900 },
  { date: 'Oct 02', revenue: 5350, activeUsers: 8550, conversionRate: 3.8, sessions: 16500 },
  { date: 'Oct 06', revenue: 5600, activeUsers: 8480, conversionRate: 3.75, sessions: 16200 },
  { date: 'Oct 10', revenue: 5900, activeUsers: 8420, conversionRate: 3.82, sessions: 16100 },
];

export const analyticsTrends7d: TimeSeriesPoint[] = [
  { date: 'Mon', revenue: 5300, activeUsers: 8520, conversionRate: 3.7, sessions: 16600 },
  { date: 'Tue', revenue: 5450, activeUsers: 8490, conversionRate: 3.75, sessions: 16500 },
  { date: 'Wed', revenue: 5600, activeUsers: 8470, conversionRate: 3.78, sessions: 16400 },
  { date: 'Thu', revenue: 5750, activeUsers: 8450, conversionRate: 3.80, sessions: 16300 },
  { date: 'Fri', revenue: 5800, activeUsers: 8430, conversionRate: 3.81, sessions: 16200 },
  { date: 'Sat', revenue: 4900, activeUsers: 7900, conversionRate: 3.65, sessions: 14800 },
  { date: 'Sun', revenue: 5200, activeUsers: 8420, conversionRate: 3.82, sessions: 16100 },
];

export const analyticsTrends90d: TimeSeriesPoint[] = [
  { date: 'Jul', revenue: 118000, activeUsers: 9800, conversionRate: 4.4, sessions: 54000 },
  { date: 'Aug', revenue: 132000, activeUsers: 9300, conversionRate: 4.1, sessions: 51000 },
  { date: 'Sep', revenue: 144000, activeUsers: 8700, conversionRate: 3.9, sessions: 48000 },
  { date: 'Oct', revenue: 148520, activeUsers: 8420, conversionRate: 3.82, sessions: 46000 },
];

export const usageByCategory: CategoryMetric[] = [
  { name: 'Meeting Workspace', value: 34, color: '#4F46E5' },
  { name: 'Project Kanban', value: 28, color: '#0F766E' },
  { name: 'Communication Inbox', value: 18, color: '#2563EB' },
  { name: 'Study & Flashcards', value: 12, color: '#D97706' },
  { name: 'Data Analytics', value: 8, color: '#9333EA' },
];

export const userDropoffPoints = [
  { step: 'Landing & Auth', completionRate: 94, dropRate: 6 },
  { step: 'Workspace Selection', completionRate: 88, dropRate: 12 },
  { step: 'Adaptive Intent Setup', completionRate: 72, dropRate: 28 }, // Culprit for dropoff!
  { step: 'First Widget Action', completionRate: 68, dropRate: 32 },
  { step: 'Daily Retention (D7)', completionRate: 54, dropRate: 46 },
];

export const simulatedInsights = [
  {
    id: 'ins-1',
    severity: 'warning' as const,
    title: 'Mobile Onboarding Bottleneck Detected',
    description: 'Active user decline (-4.3%) correlates directly with a 28% dropoff on "Adaptive Intent Setup" on screen widths < 768px.',
    recommendation: 'Enable 1-tap quick intent templates on mobile screens to minimize keyboard typing overhead.',
  },
  {
    id: 'ins-2',
    severity: 'success' as const,
    title: 'Enterprise Meeting Engagement Surging',
    description: 'Meeting Workspace usage grew +24% month-over-month, primarily driven by automated agenda tracking and retrospective summaries.',
    recommendation: 'Promote Meeting Workspace shortcuts directly from client communication threads.',
  },
  {
    id: 'ins-3',
    severity: 'info' as const,
    title: 'Study Workspace Streak Retention',
    description: 'Users maintaining a >7 day study streak exhibit 3.2x higher 30-day retention across all other workspaces.',
    recommendation: 'Incorporate streak milestones into the default dashboard summary.',
  },
];
