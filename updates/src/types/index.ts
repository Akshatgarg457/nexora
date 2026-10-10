export type WorkspaceId =
  | 'overview'
  | 'meetings'
  | 'communication'
  | 'study'
  | 'projects'
  | 'analytics'
  | 'assistant'
  | 'settings';

export type AestheticTheme = 'dark' | 'midnight' | 'forest' | 'light';

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  team: string;
}

// Meeting Workspace Types
export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  client: string;
  company: string;
  date: string;
  time: string;
  durationMinutes: number;
  location: string;
  attendees: string[];
  agenda: AgendaItem[];
  notes: string;
  actionItems: ActionItem[];
  checklist: { id: string; item: string; done: boolean }[];
  isToday?: boolean;
}

// Communication Workspace Types
export interface MessageItem {
  id: string;
  sender: string;
  senderEmail: string;
  senderRole: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  priority: 'normal' | 'high' | 'urgent';
  tag: 'client' | 'team' | 'product' | 'support';
  threadCount: number;
  suggestedFollowUp?: string;
}

// Study Workspace Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  completed: boolean;
  durationEst: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  topics: StudyTopic[];
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
  nextAssessmentDate: string;
  streakDays: number;
}

// Project Management Types
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: PriorityLevel;
  assignee: TeamMember;
  dueDate: string;
  isOverdue?: boolean;
  tags: string[];
  blockerNotes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'completed';
  progress: number;
  dueDate: string;
  taskCount: number;
  completedTaskCount: number;
  color: string;
}

// Data Analytics Types
export interface TimeSeriesPoint {
  date: string;
  revenue: number;
  activeUsers: number;
  conversionRate: number;
  sessions: number;
}

export interface CategoryMetric {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsSummary {
  revenue: number;
  revenueChange: number;
  activeUsers: number;
  activeUsersChange: number;
  conversionRate: number;
  conversionRateChange: number;
  productUsageHours: number;
  usageChange: number;
  dateRange: '7d' | '30d' | '90d' | '1y';
}

// AI Assistant Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void | string }[];
  relatedWorkspace?: WorkspaceId;
  metadata?: {
    intent?: string;
    confidence?: number;
  };
}

// Adaptive Workspace Engine Types
export type IntentCategory =
  | 'meeting_prep'
  | 'communication_triage'
  | 'study_revision'
  | 'project_overview'
  | 'analytics_investigation'
  | 'general_assistance'
  | 'default';

export interface ContextualAction {
  id: string;
  label: string;
  description?: string;
  iconName: string;
  variant?: 'primary' | 'secondary' | 'accent';
  handlerKey: string;
}

export interface WidgetConfig {
  id: string;
  title: string;
  spanCols: number; // 1, 2, or 3 columns in grid
  priority: number; // 1 = highest
  visible: boolean;
  highlighted?: boolean;
  reason?: string;
}

export interface AdaptiveConfiguration {
  id: string;
  targetWorkspace: WorkspaceId;
  detectedIntent: string;
  confidence: number;
  explanation: {
    intentSummary: string;
    rationale: string;
    prioritizedWidgets: string[];
    suggestedNextSteps: string[];
  };
  widgets: WidgetConfig[];
  contextualActions: ContextualAction[];
  filterKeywords?: string[];
}
