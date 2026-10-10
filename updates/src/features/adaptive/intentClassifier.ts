import { AdaptiveConfiguration, WorkspaceId, WidgetConfig, ContextualAction } from '../../types';

export interface IntentMatchResult {
  category: string;
  confidence: number;
  config: AdaptiveConfiguration;
}

export function classifyIntent(query: string): AdaptiveConfiguration {
  const text = query.toLowerCase().trim();

  // Scenario 1: Meeting intent
  // "Prepare for tomorrow's client meeting."
  if (
    text.includes('meeting') ||
    text.includes('client') ||
    text.includes('agenda') ||
    text.includes('schedule') ||
    text.includes('acme') ||
    text.includes('prepare for')
  ) {
    return {
      id: 'cfg-meeting-prep',
      targetWorkspace: 'meetings',
      detectedIntent: 'Client Meeting Preparation & Executive Alignment',
      confidence: 0.96,
      explanation: {
        intentSummary: "Your goal is to prepare for tomorrow's client meeting with Acme Corporation.",
        rationale: "Nexora has dynamically reshaped your workspace to prioritize high-stakes discussion topics: the verified meeting agenda, David Vance's client profile, recent technical communications, and outstanding action items.",
        prioritizedWidgets: [
          "Executive Meeting Agenda (Prioritized)",
          "Client Information & Account History",
          "Recent Direct Communications (18ms Latency benchmark)",
          "Open Action Items & Verification Checklist"
        ],
        suggestedNextSteps: [
          "Confirm completion of DR Architecture verification checklist item",
          "Generate instant AI executive summary from current meeting notes",
          "Review Sarah Jenkins's 18ms latency benchmark attachment"
        ],
      },
      widgets: [
        { id: 'w-agenda', title: 'Meeting Agenda & Timeline', spanCols: 2, priority: 1, visible: true, highlighted: true, reason: 'Core discussion flow for 10:00 AM call' },
        { id: 'w-client-info', title: 'Client Profile & Enterprise Context', spanCols: 1, priority: 2, visible: true, highlighted: true, reason: 'Key stakeholders and historical SLA demands' },
        { id: 'w-actions', title: 'Open Action Items & Deliverables', spanCols: 2, priority: 3, visible: true, highlighted: true, reason: 'Items required for security sign-off' },
        { id: 'w-prep-checklist', title: 'Pre-Meeting Readiness Checklist', spanCols: 1, priority: 4, visible: true, highlighted: true, reason: 'Verify European cluster latency status' },
        { id: 'w-notes', title: 'Live Meeting Notes & AI Synthesis', spanCols: 3, priority: 5, visible: true },
        { id: 'w-calendar-preview', title: 'Calendar Grid', spanCols: 1, priority: 6, visible: false },
      ],
      contextualActions: [
        { id: 'act-gen-summary', label: 'Synthesize Meeting Dossier', iconName: 'Sparkles', variant: 'primary', handlerKey: 'generateSummary' },
        { id: 'act-open-notes', label: 'Edit Agenda Items', iconName: 'Edit3', variant: 'secondary', handlerKey: 'editAgenda' },
        { id: 'act-view-client-email', label: 'View David Vance Email', iconName: 'Mail', variant: 'accent', handlerKey: 'viewClientEmail' },
      ],
      filterKeywords: ['acme', 'review', 'sla'],
    };
  }

  // Scenario 2: Communication intent
  // "Summarize my unread messages." or "reply"
  if (
    text.includes('message') ||
    text.includes('unread') ||
    text.includes('email') ||
    text.includes('summarize') ||
    text.includes('reply') ||
    text.includes('inbox') ||
    text.includes('communication')
  ) {
    return {
      id: 'cfg-comm-triage',
      targetWorkspace: 'communication',
      detectedIntent: 'Triage Unread Priority Communications & Draft Replies',
      confidence: 0.94,
      explanation: {
        intentSummary: "Your goal is to summarize unread messages and quickly draft professional responses.",
        rationale: "Nexora prioritized your 3 unread priority messages, brought conversation summaries into primary view, and enabled 1-click executive reply rewriting.",
        prioritizedWidgets: [
          "Unread Priority Messages Queue",
          "Conversation Thread & Detail View",
          "AI Tone Rewriter & Quick Reply Composer",
          "Suggested Follow-Up Reminders"
        ],
        suggestedNextSteps: [
          "Reply to David Vance regarding the Disaster Recovery diagram",
          "Acknowledge Sarah Jenkins's Frankfurt latency milestone",
          "Set a reminder for the Starlight expansion pricing sheet"
        ],
      },
      widgets: [
        { id: 'w-unread-inbox', title: 'Unread Priority Messages', spanCols: 1, priority: 1, visible: true, highlighted: true, reason: '3 urgent threads needing response' },
        { id: 'w-msg-detail', title: 'Conversation Thread & Context', spanCols: 2, priority: 2, visible: true, highlighted: true, reason: 'Selected high-priority thread' },
        { id: 'w-reply-composer', title: 'Draft Response & AI Rewriter', spanCols: 2, priority: 3, visible: true, highlighted: true, reason: 'Assisted reply drafting' },
        { id: 'w-follow-ups', title: 'Smart Follow-up Reminders', spanCols: 1, priority: 4, visible: true },
      ],
      contextualActions: [
        { id: 'act-mark-all-read', label: 'Mark Non-Urgent Read', iconName: 'CheckCheck', variant: 'secondary', handlerKey: 'markRead' },
        { id: 'act-ai-rewrite', label: 'Rewrite as Executive Tone', iconName: 'Wand2', variant: 'primary', handlerKey: 'rewriteReply' },
        { id: 'act-compose', label: 'Compose New Message', iconName: 'PlusCircle', variant: 'accent', handlerKey: 'compose' },
      ],
      filterKeywords: ['unread', 'urgent'],
    };
  }

  // Scenario 3: Study intent
  // "Help me study operating systems."
  if (
    text.includes('study') ||
    text.includes('operating system') ||
    text.includes('exam') ||
    text.includes('revision') ||
    text.includes('quiz') ||
    text.includes('flashcard') ||
    text.includes('course') ||
    text.includes('learn')
  ) {
    return {
      id: 'cfg-study-os',
      targetWorkspace: 'study',
      detectedIntent: 'Mastery & Active Recall: Operating Systems & Distributed Systems',
      confidence: 0.98,
      explanation: {
        intentSummary: "Your goal is to prepare for your Operating Systems assessment with active recall.",
        rationale: "Nexora adapted your workspace to surface uncompleted high-yield topics (Deadlocks & Banker's Algorithm), interactive self-assessment quizzes, and spaced-repetition flashcards.",
        prioritizedWidgets: [
          "Topic Checklist (Focus: Deadlock Characterization)",
          "Active Recall Flashcard Deck",
          "Diagnostic Exam Practice Quiz with Explanations",
          "14-Day Study Streak & Progress Counter"
        ],
        suggestedNextSteps: [
          "Complete the 3-question diagnostic quiz on CPU scheduling & deadlocks",
          "Flip through the 4 core revision flashcards (Belady's Anomaly, TLB, Deadlocks)",
          "Mark Topic 4 as complete after reviewing Banker's algorithm"
        ],
      },
      widgets: [
        { id: 'w-study-quiz', title: 'Interactive Knowledge Quiz', spanCols: 2, priority: 1, visible: true, highlighted: true, reason: 'Immediate active recall testing' },
        { id: 'w-study-streak', title: 'Learning Goal & 14-Day Streak', spanCols: 1, priority: 2, visible: true },
        { id: 'w-study-flashcards', title: 'Spaced Repetition Flashcards', spanCols: 2, priority: 3, visible: true, highlighted: true, reason: 'Memory consolidation' },
        { id: 'w-study-topics', title: 'Curriculum & Incomplete Topics', spanCols: 1, priority: 4, visible: true, reason: 'Targeting remaining 32% coursework' },
      ],
      contextualActions: [
        { id: 'act-start-quiz', label: 'Take 3-Min Practice Quiz', iconName: 'Award', variant: 'primary', handlerKey: 'startQuiz' },
        { id: 'act-next-flashcard', label: 'Cycle Flashcards', iconName: 'RotateCw', variant: 'secondary', handlerKey: 'cycleFlashcards' },
        { id: 'act-switch-course', label: 'Switch to Cloud Microservices', iconName: 'BookOpen', variant: 'accent', handlerKey: 'switchCourse' },
      ],
      filterKeywords: ['operating systems', 'deadlock'],
    };
  }

  // Scenario 4: Project management intent
  // "Review overdue project tasks."
  if (
    text.includes('task') ||
    text.includes('project') ||
    text.includes('overdue') ||
    text.includes('blocker') ||
    text.includes('kanban') ||
    text.includes('deadline') ||
    text.includes('sprint')
  ) {
    return {
      id: 'cfg-proj-overdue',
      targetWorkspace: 'projects',
      detectedIntent: 'Critical Path & Blocker Resolution (Overdue Tasks)',
      confidence: 0.95,
      explanation: {
        intentSummary: "Your goal is to inspect overdue project tasks, clear blockers, and rebalance priorities.",
        rationale: "Nexora highlighted your 2 overdue critical-path deliverables (EU cluster network latency & Acme DR document), surfaced blocker notes, and prioritized team reassignment controls.",
        prioritizedWidgets: [
          "Overdue Tasks & Blocker Warning Strip",
          "Interactive Kanban Board (Filtered for In Progress & To Do)",
          "Team Workload & Assignee Distribution",
          "Sprint 24 Completion Velocity"
        ],
        suggestedNextSteps: [
          "Re-assign staging network latency spike to Marcus Lee with urgent priority",
          "Unblock Sarah Jenkins on Acme DR documentation once benchmarks arrive",
          "Move completed 'Deterministic keyword classifier' to Done column"
        ],
      },
      widgets: [
        { id: 'w-overdue-alert', title: 'Urgent Overdue Deliverables', spanCols: 3, priority: 1, visible: true, highlighted: true, reason: '2 tasks past due date requiring intervention' },
        { id: 'w-kanban-board', title: 'Task Kanban Board', spanCols: 2, priority: 2, visible: true, highlighted: true },
        { id: 'w-team-workload', title: 'Team Workload & Capacity', spanCols: 1, priority: 3, visible: true },
        { id: 'w-project-metrics', title: 'Project Health & Velocity', spanCols: 3, priority: 4, visible: true },
      ],
      contextualActions: [
        { id: 'act-filter-overdue', label: 'Focus Overdue Only', iconName: 'AlertTriangle', variant: 'primary', handlerKey: 'filterOverdue' },
        { id: 'act-add-task', label: 'New Task', iconName: 'Plus', variant: 'secondary', handlerKey: 'createTask' },
        { id: 'act-reprioritize', label: 'Auto-Sort by Urgency', iconName: 'ArrowUpDown', variant: 'accent', handlerKey: 'sortUrgency' },
      ],
      filterKeywords: ['overdue', 'blocker'],
    };
  }

  // Scenario 5: Analytics intent
  // "Investigate declining product usage."
  if (
    text.includes('usage') ||
    text.includes('declin') ||
    text.includes('analytic') ||
    text.includes('metric') ||
    text.includes('revenue') ||
    text.includes('conversion') ||
    text.includes('retention') ||
    text.includes('drop') ||
    text.includes('user')
  ) {
    return {
      id: 'cfg-analytics-investigation',
      targetWorkspace: 'analytics',
      detectedIntent: 'Root-Cause Telemetry: Product Usage & Retention Decline',
      confidence: 0.97,
      explanation: {
        intentSummary: "Your goal is to investigate why active users and product usage hours experienced a decline (-4.3%).",
        rationale: "Nexora reshaped the analytics workspace to surface 30-day time series trends, user funnel dropoff benchmarks, and automated AI insight cards highlighting the mobile onboarding bottleneck.",
        prioritizedWidgets: [
          "Active Users & Usage Hours Anomaly Metric Cards",
          "30-Day Multi-Metric Trend Line & Area Chart",
          "Funnel Dropoff Analysis (Step 3 Workspace Customization)",
          "Prescriptive AI Insight & Action Recommendations"
        ],
        suggestedNextSteps: [
          "Inspect mobile vs desktop conversion breakdown",
          "Review user dropoff on onboarding step 3 (28% drop rate)",
          "Switch chart view to 7-day trend to evaluate recent recovery"
        ],
      },
      widgets: [
        { id: 'w-kpi-cards', title: 'Key Performance Indicators', spanCols: 3, priority: 1, visible: true, highlighted: true },
        { id: 'w-trend-chart', title: 'Active Users vs Revenue Trends', spanCols: 2, priority: 2, visible: true, highlighted: true, reason: 'Visual correlation of user dip vs steady revenue' },
        { id: 'w-dropoff-funnel', title: 'Onboarding Funnel Dropoff', spanCols: 1, priority: 3, visible: true, highlighted: true, reason: 'Identifies exact Step 3 bottleneck' },
        { id: 'w-ai-insights', title: 'Automated Root-Cause Insights', spanCols: 3, priority: 4, visible: true, highlighted: true },
      ],
      contextualActions: [
        { id: 'act-filter-7d', label: 'Switch to 7-Day View', iconName: 'Calendar', variant: 'secondary', handlerKey: 'range7d' },
        { id: 'act-focus-mobile', label: 'Filter Mobile Cohort', iconName: 'Smartphone', variant: 'primary', handlerKey: 'filterMobile' },
        { id: 'act-export-pdf', label: 'Export Telemetry Digest', iconName: 'Download', variant: 'accent', handlerKey: 'exportReport' },
      ],
      filterKeywords: ['active users', 'usage', 'dropoff'],
    };
  }

  // Scenario 6: AI Assistant / Help intent
  // "How can Nexora help me manage my work?"
  if (
    text.includes('how can') ||
    text.includes('help') ||
    text.includes('assistant') ||
    text.includes('guide') ||
    text.includes('what can')
  ) {
    return {
      id: 'cfg-assistant-help',
      targetWorkspace: 'assistant',
      detectedIntent: 'Nexora Feature Guidance & Intelligent Navigation',
      confidence: 0.99,
      explanation: {
        intentSummary: "Your goal is to understand how Nexora adapts to your daily productivity goals.",
        rationale: "Nexora routed you to the AI Assistant with an interactive onboarding walkthrough showing how natural-language intent transforms meetings, communications, study, and project execution.",
        prioritizedWidgets: [
          "Conversational Guidance & Command Prompts",
          "Workspace Capability Directory",
          "Intent Recognition Demonstration"
        ],
        suggestedNextSteps: [
          "Try typing: 'Prepare for tomorrow's client meeting'",
          "Try typing: 'Summarize my unread messages'",
          "Try typing: 'Help me study operating systems'"
        ],
      },
      widgets: [
        { id: 'w-assistant-chat', title: 'Nexora AI Assistant', spanCols: 2, priority: 1, visible: true, highlighted: true },
        { id: 'w-quick-prompts', title: 'Suggested Intent Commands', spanCols: 1, priority: 2, visible: true },
      ],
      contextualActions: [
        { id: 'act-try-meeting', label: 'Try Meeting Intent', iconName: 'Calendar', variant: 'primary', handlerKey: 'presetMeeting' },
        { id: 'act-try-study', label: 'Try Study Intent', iconName: 'BookOpen', variant: 'secondary', handlerKey: 'presetStudy' },
      ],
    };
  }

  // Default Fallback
  return {
    id: 'cfg-default-overview',
    targetWorkspace: 'overview',
    detectedIntent: 'Unified Dashboard Overview',
    confidence: 0.85,
    explanation: {
      intentSummary: "Standard workspace layout active.",
      rationale: "Nexora is showing your high-level overview. You can type any goal or click one of the suggested prompts above to automatically reshape the interface.",
      prioritizedWidgets: ["Upcoming Schedule", "Active Projects", "Study Progress", "Inbox Summary"],
      suggestedNextSteps: [
        "Select a suggested intent prompt to see the adaptive workspace in action",
        "Explore any of the 6 specialized workspaces in the sidebar"
      ],
    },
    widgets: [
      { id: 'w-kpi-stats', title: 'Daily Overview Stats', spanCols: 3, priority: 1, visible: true },
      { id: 'w-today-meetings', title: "Today's Meetings", spanCols: 2, priority: 2, visible: true },
      { id: 'w-tasks-summary', title: 'My Priority Tasks', spanCols: 1, priority: 3, visible: true },
      { id: 'w-study-widget', title: 'Active Course Progress', spanCols: 1, priority: 4, visible: true },
      { id: 'w-unread-widget', title: 'Unread Communications', spanCols: 2, priority: 5, visible: true },
    ],
    contextualActions: [],
  };
}
