import { apiClient, executeApiCall } from './client';
import { Project, ProjectTask, TaskStatus, PriorityLevel } from '../types';
import { initialProjects, initialTasks, initialTeamMembers } from '../mocks/projects';

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: PriorityLevel;
  assigneeId: string;
  dueDate: string;
  tags: string[];
}

export const projectsApi = {
  /**
   * GET /api/projects
   */
  async getProjects(): Promise<Project[]> {
    return executeApiCall<Project[]>(
      () => apiClient.get('/projects'),
      () => initialProjects
    );
  },

  /**
   * GET /api/projects/tasks
   */
  async getTasks(): Promise<ProjectTask[]> {
    return executeApiCall<ProjectTask[]>(
      () => apiClient.get('/projects/tasks'),
      () => initialTasks
    );
  },

  /**
   * PUT /api/projects/tasks/{id}/status
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<{ success: boolean; taskId: string; status: TaskStatus }> {
    return executeApiCall(
      () => apiClient.put(`/projects/tasks/${taskId}/status`, { status }),
      () => ({ success: true, taskId, status })
    );
  },

  /**
   * POST /api/projects/tasks
   */
  async createTask(request: CreateTaskRequest): Promise<ProjectTask> {
    return executeApiCall<ProjectTask>(
      () => apiClient.post('/projects/tasks', request),
      () => {
        const project = initialProjects.find((p) => p.id === request.projectId) || initialProjects[0];
        const assignee = initialTeamMembers.find((m) => m.id === request.assigneeId) || initialTeamMembers[0];
        return {
          id: `task-${Date.now()}`,
          title: request.title,
          description: request.description,
          projectId: project.id,
          projectName: project.name,
          status: request.status,
          priority: request.priority,
          assignee,
          dueDate: request.dueDate,
          isOverdue: false,
          tags: request.tags,
        };
      }
    );
  },
};
