import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  EmployeeDto,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  MeetingDto,
  CreateMeetingRequest,
  MessageDto,
  SendMessageRequest,
  LearningResourceDto,
  LearningProgressDto,
  UpdateProgressRequest,
  ProjectDto,
  CreateProjectRequest,
  TaskDto,
  CreateTaskRequest,
  TaskStatus,
  ProgressReportDto,
  CreateReportRequest,
  AnalyticsSummaryDto,
  AiRequestDto,
  AiResponseDto,
  PreferenceDto
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 & 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes('/api/auth/login');
      if (!isAuthRequest) {
        localStorage.removeItem('nexora_token');
        localStorage.removeItem('nexora_user');
        // Prevent redirect loop by checking current path
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('nexora_token', response.data.token);
    }
    return response.data;
  },
  getCurrentUser: async (): Promise<EmployeeDto> => {
    const response = await api.get<EmployeeDto>('/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user');
  }
};

// Employee Service
export const employeeService = {
  getAll: async (): Promise<EmployeeDto[]> => {
    const response = await api.get<EmployeeDto[]>('/employees');
    return response.data;
  },
  getById: async (id: number): Promise<EmployeeDto> => {
    const response = await api.get<EmployeeDto>(`/employees/${id}`);
    return response.data;
  },
};

// Admin Employee Service
export const adminService = {
  getAllEmployees: async (): Promise<EmployeeDto[]> => {
    const response = await api.get<EmployeeDto[]>('/admin/employees');
    return response.data;
  },
  createEmployee: async (data: CreateEmployeeRequest): Promise<EmployeeDto> => {
    const response = await api.post<EmployeeDto>('/admin/employees', data);
    return response.data;
  },
  updateEmployee: async (id: number, data: UpdateEmployeeRequest): Promise<EmployeeDto> => {
    const response = await api.patch<EmployeeDto>(`/admin/employees/${id}`, data);
    return response.data;
  },
  updateStatus: async (id: number, active: boolean): Promise<EmployeeDto> => {
    const response = await api.patch<EmployeeDto>(`/admin/employees/${id}/status`, { active });
    return response.data;
  }
};

// Meeting Service
export const meetingService = {
  getAll: async (): Promise<MeetingDto[]> => {
    const response = await api.get<MeetingDto[]>('/meetings');
    return response.data;
  },
  getById: async (id: number): Promise<MeetingDto> => {
    const response = await api.get<MeetingDto>(`/meetings/${id}`);
    return response.data;
  },
  create: async (data: CreateMeetingRequest): Promise<MeetingDto> => {
    const response = await api.post<MeetingDto>('/meetings', data);
    return response.data;
  }
};

// Communication / Message Service
export const messageService = {
  getConversation: async (user1: number, user2: number): Promise<MessageDto[]> => {
    const response = await api.get<MessageDto[]>('/messages/conversation', {
      params: { user1, user2 }
    });
    return response.data;
  },
  send: async (data: SendMessageRequest): Promise<MessageDto> => {
    const response = await api.post<MessageDto>('/messages', data);
    return response.data;
  }
};

// Study Service
export const studyService = {
  getResources: async (): Promise<LearningResourceDto[]> => {
    const response = await api.get<LearningResourceDto[]>('/study/resources');
    return response.data;
  },
  getProgress: async (employeeId: number): Promise<LearningProgressDto[]> => {
    const response = await api.get<LearningProgressDto[]>(`/study/progress/${employeeId}`);
    return response.data;
  },
  updateProgress: async (data: UpdateProgressRequest): Promise<LearningProgressDto> => {
    const response = await api.post<LearningProgressDto>('/study/progress', data);
    return response.data;
  }
};

// Project Service
export const projectService = {
  getAll: async (): Promise<ProjectDto[]> => {
    const response = await api.get<ProjectDto[]>('/projects');
    return response.data;
  },
  getById: async (id: number): Promise<ProjectDto> => {
    const response = await api.get<ProjectDto>(`/projects/${id}`);
    return response.data;
  },
  create: async (data: CreateProjectRequest): Promise<ProjectDto> => {
    const response = await api.post<ProjectDto>('/projects', data);
    return response.data;
  },
  getTasks: async (): Promise<TaskDto[]> => {
    const response = await api.get<TaskDto[]>('/projects/tasks');
    return response.data;
  },
  getTasksByProject: async (projectId: number): Promise<TaskDto[]> => {
    const response = await api.get<TaskDto[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },
  createTask: async (data: CreateTaskRequest): Promise<TaskDto> => {
    const response = await api.post<TaskDto>('/projects/tasks', data);
    return response.data;
  },
  updateTaskStatus: async (taskId: number, status: TaskStatus): Promise<TaskDto> => {
    const response = await api.patch<TaskDto>(`/projects/tasks/${taskId}/status`, { status });
    return response.data;
  },
  getReportsByProject: async (projectId: number): Promise<ProgressReportDto[]> => {
    const response = await api.get<ProgressReportDto[]>(`/projects/${projectId}/reports`);
    return response.data;
  },
  createReport: async (data: CreateReportRequest): Promise<ProgressReportDto> => {
    const response = await api.post<ProgressReportDto>('/projects/reports', data);
    return response.data;
  }
};

// Analytics Service
export const analyticsService = {
  getSummary: async (): Promise<AnalyticsSummaryDto> => {
    const response = await api.get<AnalyticsSummaryDto>('/analytics/summary');
    return response.data;
  }
};

// AI Assistant Service
export const aiService = {
  query: async (data: AiRequestDto): Promise<AiResponseDto> => {
    const response = await api.post<AiResponseDto>('/ai/query', data);
    return response.data;
  }
};

// Preference Service
export const preferenceService = {
  get: async (employeeId: number): Promise<PreferenceDto> => {
    const response = await api.get<PreferenceDto>(`/preferences/${employeeId}`);
    return response.data;
  }
};
