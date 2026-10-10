export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'INTERN';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type LearningStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface EmployeeDto {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  position: string;
  avatar: string;
  status: string;
  active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  department: string;
  position: string;
  avatar?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  role?: Role;
  department?: string;
  position?: string;
  avatar?: string;
}

export interface MeetingDto {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: number;
  organizerName: string;
  participantIds: number[];
  participantNames: string[];
  agenda: string;
  notes: string;
  status: string;
}

export interface CreateMeetingRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: number;
  participantIds: number[];
  agenda?: string;
  notes?: string;
}

export interface MessageDto {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  content: string;
}

export interface LearningResourceDto {
  id: number;
  title: string;
  category: string;
  description: string;
  resourceUrl: string;
  estimatedTime: string;
  level: string;
  sampleTranscript: string;
}

export interface LearningProgressDto {
  id: number;
  employeeId: number;
  employeeName: string;
  resourceId: number;
  resourceTitle: string;
  status: LearningStatus;
  progressPercentage: number;
  videoNotes: string;
  aiSummary: string;
  lastAccessed: string;
}

export interface UpdateProgressRequest {
  employeeId: number;
  resourceId: number;
  status: LearningStatus;
  progressPercentage: number;
  videoNotes?: string;
}

export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  managerId: number;
  managerName: string;
  completionPercentage: number;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  managerId: number;
}

export interface TaskDto {
  id: number;
  projectId: number;
  projectName: string;
  title: string;
  description: string;
  assigneeId: number;
  assigneeName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface CreateTaskRequest {
  projectId: number;
  title: string;
  description: string;
  assigneeId: number;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface ProgressReportDto {
  id: number;
  projectId: number;
  projectName: string;
  authorId: number;
  authorName: string;
  summary: string;
  reportDate: string;
  progressPercentage: number;
  blockers: string;
}

export interface CreateReportRequest {
  projectId: number;
  authorId: number;
  summary: string;
  progressPercentage: number;
  blockers?: string;
}

export interface AnalyticsSummaryDto {
  totalEmployees: number;
  activeMeetings: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  learningModulesCompleted: number;
  avgProjectCompletion: number;
  departmentCountMap: Record<string, number>;
  projectStatusMap: Record<string, number>;
}

export interface AiRequestDto {
  prompt: string;
  contextWorkspace?: string;
  employeeId?: number;
}

export interface AiResponseDto {
  prompt: string;
  response: string;
  suggestedAction?: string;
  targetWorkspace?: string;
  timestamp: string;
}

export interface PreferenceDto {
  id: number;
  employeeId: number;
  theme: string;
  workspaceOrder: string[];
  widgetsEnabled: Record<string, boolean>;
  layoutDensity: string;
}
