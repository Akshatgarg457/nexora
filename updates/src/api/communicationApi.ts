import { apiClient, executeApiCall } from './client';
import { MessageItem } from '../types';
import { initialMessages } from '../mocks/communications';

export interface SendMessageRequest {
  recipient: string;
  recipientEmail: string;
  subject: string;
  body: string;
  priority?: 'normal' | 'high' | 'urgent';
}

export const communicationApi = {
  /**
   * GET /api/messages
   * Proposed Spring Boot endpoint: MessageController.getAllMessages()
   */
  async getMessages(): Promise<MessageItem[]> {
    return executeApiCall<MessageItem[]>(
      () => apiClient.get('/messages'),
      () => initialMessages
    );
  },

  /**
   * PUT /api/messages/{id}/read
   */
  async markAsRead(id: string, isRead = true): Promise<{ success: boolean; id: string; isRead: boolean }> {
    return executeApiCall(
      () => apiClient.put(`/messages/${id}/read`, { isRead }),
      () => ({ success: true, id, isRead })
    );
  },

  /**
   * POST /api/messages/send
   */
  async sendMessage(request: SendMessageRequest): Promise<MessageItem> {
    return executeApiCall<MessageItem>(
      () => apiClient.post('/messages', request),
      () => ({
        id: `msg-${Date.now()}`,
        sender: 'You',
        senderEmail: 'alex.rivera@nexora.io',
        senderRole: 'Fullstack Lead',
        subject: request.subject,
        snippet: request.body.slice(0, 90) + '...',
        body: request.body,
        timestamp: 'Just now',
        isRead: true,
        priority: request.priority || 'normal',
        tag: 'team',
        threadCount: 1,
      })
    );
  },

  /**
   * POST /api/messages/rewrite
   * Simulates tone adjustment / professional rewriting
   */
  async rewriteMessage(rawText: string, tone: 'executive' | 'concise' | 'friendly' = 'executive'): Promise<string> {
    return executeApiCall<string>(
      () => apiClient.post('/messages/rewrite', { text: rawText, tone }),
      async () => {
        await new Promise((r) => setTimeout(r, 500));
        if (tone === 'concise') {
          return `Please find the requested update below. We have validated the metrics against our SLA targets and are ready to finalize next steps during our upcoming sync.`;
        }
        if (tone === 'friendly') {
          return `Thanks for following up! We've made great progress on these points and everything looks aligned for tomorrow. Let me know if you need anything else in the meantime!`;
        }
        return `Dear Colleague,\n\nI have reviewed the relevant documentation and verified our performance benchmarks against agreed SLA criteria. Everything is situated to proceed smoothly with sign-off. Please let me know if you require additional technical details ahead of our meeting.\n\nWarm regards,\nAlex Rivera`;
      }
    );
  },
};
