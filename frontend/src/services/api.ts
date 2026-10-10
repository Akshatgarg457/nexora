import axios from 'axios';
import {
  AuthResponse,
  Employee,
  Meeting,
  Message,
  LearningResource,
  LearningProgress,
  Project,
  ProjectTask,
  ProgressReport,
  AnalyticsSummary,
  AiResponse,
  Preference
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login attempt failure
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('nexora_token');
        localStorage.removeItem('nexora_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authApi = {
  login: async (credentials: { email: string; password?: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  getCurrentUser: async (): Promise<Employee> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('nexora_token');
    localStorage.removeItem('nexora_user');
  }
};

// Admin Employees Service
export const adminEmployeesApi = {
  getAll: async (): Promise<Employee[]> => {
    const res = await api.get('/admin/employees');
    return res.data;
  },
  getById: async (id: number): Promise<Employee> => {
    const res = await api.get(`/admin/employees/${id}`);
    return res.data;
  },
  create: async (data: Partial<Employee> & { password?: string }): Promise<Employee> => {
    const res = await api.post('/admin/employees', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Employee>): Promise<Employee> => {
    const res = await api.patch(`/admin/employees/${id}`, data);
    return res.data;
  },
  updateStatus: async (id: number, active: boolean): Promise<Employee> => {
    const res = await api.patch(`/admin/employees/${id}/status`, { active });
    return res.data;
  }
};

// Standard Employees API
export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    const res = await api.get('/employees');
    return res.data;
  }
};

// Meetings API
export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    const res = await api.get('/meetings');
    return res.data;
  },
  create: async (data: {
    title: string;
    description?: string;
    date: string;
    time: string;
    location?: string;
    organizerId: number;
    participantIds?: number[];
    agenda?: string;
    notes?: string;
  }): Promise<Meeting> => {
    const res = await api.post('/meetings', data);
    return res.data;
  }
};

// Messages API
export const messagesApi = {
  getConversation: async (user1: number, user2: number): Promise<Message[]> => {
    const res = await api.get('/messages/conversation', { params: { user1, user2 } });
    return res.data;
  },
  send: async (senderId: number, receiverId: number, content: string): Promise<Message> => {
    const res = await api.post('/messages', { senderId, receiverId, content });
    return res.data;
  }
};

// Study API
export const studyApi = {
  getResources: async (): Promise<LearningResource[]> => {
    const res = await api.get('/study/resources');
    return res.data;
  },
  getProgress: async (employeeId: number): Promise<LearningProgress[]> => {
    const res = await api.get(`/study/progress/${employeeId}`);
    return res.data;
  },
  updateProgress: async (data: {
    employeeId: number;
    resourceId: number;
    status?: string;
    progressPercentage?: number;
    videoNotes?: string;
    generateAiSummary?: boolean;
  }): Promise<LearningProgress> => {
    const res = await api.post('/study/progress', data);
    return res.data;
  }
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data;
  },
  create: async (data: {
    name: string;
    description?: string;
    category?: string;
    status: string;
    startDate?: string;
    endDate?: string;
    managerId: number;
    completionPercentage?: number;
  }): Promise<Project> => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  getAllTasks: async (): Promise<ProjectTask[]> => {
    const res = await api.get('/projects/tasks');
    return res.data;
  },
  createTask: async (data: {
    projectId: number;
    title: string;
    description?: string;
    assigneeId?: number;
    status: string;
    priority?: string;
    dueDate?: string;
  }): Promise<ProjectTask> => {
    const res = await api.post('/projects/tasks', data);
    return res.data;
  },
  updateTaskStatus: async (taskId: number, status: string): Promise<ProjectTask> => {
    const res = await api.patch(`/projects/tasks/${taskId}/status`, { status });
    return res.data;
  },
  getReports: async (projectId: number): Promise<ProgressReport[]> => {
    const res = await api.get(`/projects/${projectId}/reports`);
    return res.data;
  },
  createReport: async (data: {
    projectId: number;
    authorId: number;
    summary: string;
    progressPercentage?: number;
    blockers?: string;
  }): Promise<ProgressReport> => {
    const res = await api.post('/projects/reports', data);
    return res.data;
  }
};

// Analytics API
export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const res = await api.get('/analytics/summary');
    return res.data;
  }
};

// AI Assistant API
export const aiApi = {
  query: async (prompt: string, employeeId?: number, activeWorkspace?: string): Promise<AiResponse> => {
    const res = await api.post('/api/ai/query', { prompt, employeeId, activeWorkspace });
    return res.data;
  }
};

// Preferences API
export const preferencesApi = {
  get: async (employeeId: number): Promise<Preference> => {
    const res = await api.get(`/preferences/${employeeId}`);
    return res.data;
  },
  customize: async (employeeId: number, prompt: string): Promise<Preference> => {
    const res = await api.post('/preferences/customize', { employeeId, prompt });
    return res.data;
  }
};
