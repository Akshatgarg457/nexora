export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'INTERN';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
export type LearningStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: Role;
  department?: string;
  position?: string;
  avatar?: string;
  status?: string;
  active: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  id: number;
  name: string;
  email: string;
  role: Role;
  department?: string;
  position?: string;
  avatar?: string;
}

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  organizer: Employee;
  participants: Employee[];
  agenda?: string;
  notes?: string;
  status: string;
}

export interface Message {
  id: number;
  sender: Employee;
  receiver: Employee;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface LearningResource {
  id: number;
  title: string;
  category: string;
  description: string;
  resourceUrl?: string;
  estimatedTime?: string;
  level?: string;
  sampleTranscript?: string;
}

export interface LearningProgress {
  id: number;
  employeeId: number;
  resource: LearningResource;
  status: LearningStatus;
  progressPercentage: number;
  videoNotes?: string;
  aiSummary?: string;
  lastAccessed?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  category?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  manager: Employee;
  completionPercentage: number;
}

export interface ProjectTask {
  id: number;
  projectId: number;
  projectName: string;
  title: string;
  description?: string;
  assignee?: Employee;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  isOverdue?: boolean;
}

export interface ProgressReport {
  id: number;
  projectId: number;
  projectName: string;
  author: Employee;
  summary: string;
  reportDate: string;
  progressPercentage?: number;
  blockers?: string;
}

export interface AnalyticsSummary {
  totalEmployees: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  totalTasksCount: number;
  completedTasksCount: number;
  overdueTasksCount: number;
  taskCompletionRate: number;
  upcomingMeetingsCount: number;
  avgProjectCompletion: number;
  activeLearnersCount: number;
  dataSourceNote: string;
  projectStatusDistribution: Record<string, number>;
  taskStatusDistribution: Record<string, number>;
  learningCategoryStats: { category: string; totalResources: number; completedCount: number }[];
}

export interface AiResponse {
  response: string;
  source: string;
  targetWorkspace?: string;
  suggestedActions?: string[];
  isSimulated: boolean;
}

export interface Preference {
  id?: number;
  employeeId: number;
  customPrompt: string;
  prioritizedWorkspaces: string[];
  explanationText: string;
}
