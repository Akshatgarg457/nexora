import { apiClient, executeApiCall } from './client';
import { Meeting, ActionItem, AgendaItem } from '../types';
import { initialMeetings } from '../mocks/meetings';

export interface CreateMeetingRequest {
  title: string;
  client: string;
  company: string;
  date: string;
  time: string;
  durationMinutes: number;
  location: string;
  attendees: string[];
}

export const meetingsApi = {
  /**
   * GET /api/meetings
   * Proposed Spring Boot endpoint: MeetingController.getAllMeetings()
   */
  async getMeetings(): Promise<Meeting[]> {
    return executeApiCall<Meeting[]>(
      () => apiClient.get('/meetings'),
      () => initialMeetings
    );
  },

  /**
   * GET /api/meetings/{id}
   */
  async getMeetingById(id: string): Promise<Meeting | undefined> {
    return executeApiCall<Meeting | undefined>(
      () => apiClient.get(`/meetings/${id}`).then((r) => r.data),
      () => initialMeetings.find((m) => m.id === id)
    );
  },

  /**
   * POST /api/meetings
   */
  async createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
    return executeApiCall<Meeting>(
      () => apiClient.post('/meetings', data),
      () => ({
        id: `meet-${Date.now()}`,
        ...data,
        agenda: [{ id: `ag-${Date.now()}`, title: 'Opening remarks & Alignment', durationMinutes: 15, completed: false }],
        notes: '',
        actionItems: [],
        checklist: [{ id: `chk-${Date.now()}`, item: 'Review preliminary discussion topics', done: false }],
      })
    );
  },

  /**
   * PUT /api/meetings/{id}/notes
   */
  async updateMeetingNotes(id: string, notes: string): Promise<{ success: boolean; notes: string }> {
    return executeApiCall(
      () => apiClient.put(`/meetings/${id}/notes`, { notes }),
      () => ({ success: true, notes })
    );
  },

  /**
   * POST /api/meetings/{id}/generate-summary
   * Simulates AI meeting synthesis (to be implemented by Spring Boot + LLM endpoint)
   */
  async generateMeetingSummary(meeting: Meeting): Promise<string> {
    return executeApiCall<string>(
      () => apiClient.post(`/meetings/${meeting.id}/summary`, { notes: meeting.notes }),
      async () => {
        await new Promise((r) => setTimeout(r, 600));
        return `Executive Synthesis (${meeting.company}):
• Core Objective: Complete technical validation and SLA agreement for rollout.
• Critical Risk: European cluster latency must adhere to <30ms requirement; verified at 18ms by Solutions team.
• Agreed Next Step: Submit Disaster Recovery architecture diagram to ${meeting.client} and confirm tier-1 support escalation path.
• Status: On track for sign-off.`;
      }
    );
  },
};
