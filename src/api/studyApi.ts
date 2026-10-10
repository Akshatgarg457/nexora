import { apiClient, executeApiCall } from './client';
import { Course } from '../types';
import { initialCourses } from '../mocks/courses';

export const studyApi = {
  /**
   * GET /api/study/courses
   * Proposed Spring Boot endpoint: CourseController.getCourses()
   */
  async getCourses(): Promise<Course[]> {
    return executeApiCall<Course[]>(
      () => apiClient.get('/study/courses'),
      () => initialCourses
    );
  },

  /**
   * PUT /api/study/courses/{courseId}/topics/{topicId}/toggle
   */
  async toggleTopic(courseId: string, topicId: string, completed: boolean): Promise<{ success: boolean }> {
    return executeApiCall(
      () => apiClient.put(`/study/courses/${courseId}/topics/${topicId}`, { completed }),
      () => ({ success: true })
    );
  },
};
