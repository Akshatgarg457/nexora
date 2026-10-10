import { apiClient, executeApiCall } from './client';
import { ChatMessage } from '../types';

export interface AssistantRequest {
  query: string;
  history?: ChatMessage[];
  currentWorkspace?: string;
}

export const assistantApi = {
  /**
   * POST /api/assistant/chat
   * Proposed Spring Boot endpoint: AssistantController.processChat(@RequestBody ChatRequestDTO dto)
   */
  async sendMessage(query: string, currentWorkspace = 'overview'): Promise<ChatMessage> {
    return executeApiCall<ChatMessage>(
      () => apiClient.post('/assistant/chat', { query, currentWorkspace }),
      async () => {
        // High quality intent-aware simulated responses
        await new Promise((r) => setTimeout(r, 650));
        const q = query.toLowerCase();

        let content = '';
        let relatedWorkspace: ChatMessage['relatedWorkspace'] = undefined;

        if (q.includes('meeting') || q.includes('client') || q.includes('agenda') || q.includes('acme')) {
          relatedWorkspace = 'meetings';
          content = `I’ve pulled together your preparation dossier for the upcoming Acme Corp meeting.
• Key Focus: Reviewing the European cluster latency (18ms verified) and DR topology diagram.
• Open Blocker: Marcus needs to confirm the Frankfurt benchmark log with Sarah.
• Suggestion: Would you like me to open the Meeting Workspace with the agenda and notes highlighted?`;
        } else if (q.includes('message') || q.includes('unread') || q.includes('email') || q.includes('reply') || q.includes('inbox')) {
          relatedWorkspace = 'communication';
          content = `You have 3 unread priority messages in your triage queue:
1. David Vance (Acme Corp) requesting DR topology & SLA confirmation.
2. Sarah Jenkins with confirmed 18ms latency benchmark numbers.
3. Devin Vance with Spring Boot REST contract specs.
• Action: I recommend sending a concise confirmation to David acknowledging the 18ms benchmarks.`;
        } else if (q.includes('study') || q.includes('exam') || q.includes('operating system') || q.includes('quiz') || q.includes('course')) {
          relatedWorkspace = 'study';
          content = `Let's tackle your Operating Systems review.
• Current Progress: 68% complete with a 14-day study streak!
• Recommended Focus: Topic 4 ("Deadlock Characterization, Prevention & Banker’s Algorithm") is currently incomplete.
• Practice: You have 3 revision flashcards and a 3-question diagnostic quiz ready to test your knowledge.`;
        } else if (q.includes('task') || q.includes('project') || q.includes('overdue') || q.includes('blocker') || q.includes('kanban')) {
          relatedWorkspace = 'projects';
          content = `Project Health Analysis:
• Overdue Tasks: 2 high-priority items need immediate attention (EU cluster latency spike & Acme DR documentation).
• In Progress: Spring Boot REST contract implementation is at 58% completion.
• Suggestion: Priority re-assignment can unblock Sarah so the Acme deliverable goes out today.`;
        } else if (q.includes('usage') || q.includes('decline') || q.includes('analytics') || q.includes('churn') || q.includes('metric')) {
          relatedWorkspace = 'analytics';
          content = `Analytics Investigation:
• Primary Finding: Overall revenue is up +12.8%, but active user retention dipped -4.3%.
• Root Cause: User telemetry points to a 28% dropoff on mobile devices during Step 3 (Workspace Customization).
• Recommended Action: Add 1-tap quick intent templates on mobile screens to minimize friction.`;
        } else {
          content = `Nexora’s Adaptive Engine is ready. You can ask me to:
• Prepare for upcoming client meetings and synthesize notes
• Triage unread messages and generate professional replies
• Create customized revision quizzes for operating systems & cloud architecture
• Highlight overdue blockers across active project boards
• Diagnose business metrics and user retention dropoffs`;
        }

        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content,
          timestamp: 'Just now',
          relatedWorkspace,
          metadata: {
            confidence: 0.96,
          },
        };
      }
    );
  },
};
