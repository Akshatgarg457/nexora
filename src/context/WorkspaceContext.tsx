import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkspaceId,
  AestheticTheme,
  AdaptiveConfiguration,
  Meeting,
  MessageItem,
  Course,
  Project,
  ProjectTask,
  TaskStatus,
  PriorityLevel,
  ChatMessage,
  User,
} from '../types';
import { classifyIntent } from '../features/adaptive/intentClassifier';
import { initialMeetings } from '../mocks/meetings';
import { initialMessages } from '../mocks/communications';
import { initialCourses } from '../mocks/courses';
import { initialProjects, initialTasks } from '../mocks/projects';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'meeting' | 'message' | 'task' | 'alert';
}

interface WorkspaceContextType {
  // Aesthetic Theme Engine
  theme: AestheticTheme;
  setTheme: (t: AestheticTheme) => void;

  // Navigation & Workspace State
  activeWorkspace: WorkspaceId;
  setActiveWorkspace: (id: WorkspaceId) => void;

  // Adaptive Engine
  currentIntentText: string;
  activeAdaptiveConfig: AdaptiveConfiguration | null;
  isAdapting: boolean;
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
  adaptationHistory: { intent: string; timestamp: string; targetWorkspace: WorkspaceId }[];
  adaptWorkspace: (query: string) => void;
  clearAdaptation: () => void;

  // Slide-over & Global Overlays
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;

  // Data Stores & Mutators
  currentUser: User;
  meetings: Meeting[];
  selectedMeetingId: string;
  setSelectedMeetingId: (id: string) => void;
  updateMeetingNotes: (meetingId: string, notes: string) => void;
  toggleMeetingChecklist: (meetingId: string, checklistId: string) => void;
  toggleMeetingAgenda: (meetingId: string, agendaId: string) => void;
  toggleActionItem: (meetingId: string, actionId: string) => void;
  addMeeting: (newMeeting: Meeting) => void;

  messages: MessageItem[];
  selectedMessageId: string;
  setSelectedMessageId: (id: string) => void;
  markMessageRead: (messageId: string, isRead?: boolean) => void;
  addMessage: (msg: MessageItem) => void;

  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  toggleTopicCompletion: (courseId: string, topicId: string) => void;

  projects: Project[];
  tasks: ProjectTask[];
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  updateTaskPriority: (taskId: string, newPriority: PriorityLevel) => void;
  addTask: (task: ProjectTask) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  resetDemoData: () => void;
}

const defaultUser: User = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@nexora.io',
  role: 'Engineering Lead & Architect',
  team: 'Adaptive Workspace Engineering',
};

const defaultNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Acme Corp Review in 1 Hour',
    message: 'Agenda items and 18ms latency benchmark are ready for review.',
    time: '10m ago',
    unread: true,
    type: 'meeting',
  },
  {
    id: 'notif-2',
    title: '2 Overdue Blocker Tasks',
    message: 'Frankfurt staging latency & Acme DR document require attention.',
    time: '25m ago',
    unread: true,
    type: 'task',
  },
  {
    id: 'notif-3',
    title: 'New Priority Message',
    message: 'David Vance sent an urgent request regarding SLA guarantees.',
    time: '1h ago',
    unread: false,
    type: 'message',
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(defaultUser);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('overview');

  // Aesthetic Theme Engine (defaults to dark Obsidian aesthetic)
  const [theme, setThemeState] = useState<AestheticTheme>(() => {
    const saved = localStorage.getItem('nexora_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'midnight' || saved === 'forest') {
      return saved as AestheticTheme;
    }
    return 'dark';
  });

  const setTheme = (newTheme: AestheticTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('nexora_theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Adaptive Engine State
  const [currentIntentText, setCurrentIntentText] = useState<string>('');
  const [activeAdaptiveConfig, setActiveAdaptiveConfig] = useState<AdaptiveConfiguration | null>(null);
  const [isAdapting, setIsAdapting] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [adaptationHistory, setAdaptationHistory] = useState<
    { intent: string; timestamp: string; targetWorkspace: WorkspaceId }[]
  >([]);

  // Overlays
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);

  // Workspace Data
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(initialMeetings[0].id);

  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string>(initialMessages[0].id);

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourses[0].id);

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'cm-init',
      sender: 'assistant',
      content:
        'Welcome to Nexora. I am your adaptive intelligence engine. Describe what you want to achieve today (e.g. preparing for a meeting, reviewing overdue tasks, or studying), and I will reshape your workspace automatically.',
      timestamp: 'Today, 09:00 AM',
    },
  ]);

  // Core Adaptive Dispatcher
  const adaptWorkspace = (query: string) => {
    if (!query.trim()) return;
    setIsAdapting(true);
    setCurrentIntentText(query);

    const config = classifyIntent(query);
    setActiveAdaptiveConfig(config);
    setActiveWorkspace(config.targetWorkspace);
    setShowExplanation(true);

    setAdaptationHistory((prev) => [
      {
        intent: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        targetWorkspace: config.targetWorkspace,
      },
      ...prev.slice(0, 9),
    ]);

    setTimeout(() => {
      setIsAdapting(false);
    }, 350);
  };

  const clearAdaptation = () => {
    setActiveAdaptiveConfig(null);
    setCurrentIntentText('');
    setShowExplanation(false);
  };

  // Mutators for Meetings
  const updateMeetingNotes = (meetingId: string, notes: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, notes } : m))
    );
  };

  const toggleMeetingChecklist = (meetingId: string, checklistId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          checklist: m.checklist.map((c) =>
            c.id === checklistId ? { ...c, done: !c.done } : c
          ),
        };
      })
    );
  };

  const toggleMeetingAgenda = (meetingId: string, agendaId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          agenda: m.agenda.map((a) =>
            a.id === agendaId ? { ...a, completed: !a.completed } : a
          ),
        };
      })
    );
  };

  const toggleActionItem = (meetingId: string, actionId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: m.actionItems.map((a) =>
            a.id === actionId ? { ...a, completed: !a.completed } : a
          ),
        };
      })
    );
  };

  const addMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    setSelectedMeetingId(newMeeting.id);
  };

  // Mutators for Messages
  const markMessageRead = (messageId: string, isRead = true) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isRead } : msg))
    );
  };

  const addMessage = (msg: MessageItem) => {
    setMessages((prev) => [msg, ...prev]);
    setSelectedMessageId(msg.id);
  };

  // Mutators for Study
  const toggleTopicCompletion = (courseId: string, topicId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedTopics = c.topics.map((t) =>
          t.id === topicId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = updatedTopics.filter((t) => t.completed).length;
        const progressPercent = Math.round((completedCount / updatedTopics.length) * 100);
        return {
          ...c,
          topics: updatedTopics,
          progressPercent,
        };
      })
    );
  };

  // Mutators for Tasks
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const updateTaskPriority = (taskId: string, newPriority: PriorityLevel) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
    );
  };

  const addTask = (task: ProjectTask) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Chat
  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `cm-${Date.now()}`,
        sender: 'assistant',
        content: 'Conversation history reset. How can Nexora adapt for you next?',
        timestamp: 'Just now',
      },
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const resetDemoData = () => {
    setMeetings(initialMeetings);
    setSelectedMeetingId(initialMeetings[0].id);
    setMessages(initialMessages);
    setSelectedMessageId(initialMessages[0].id);
    setCourses(initialCourses);
    setSelectedCourseId(initialCourses[0].id);
    setProjects(initialProjects);
    setTasks(initialTasks);
    setNotifications(defaultNotifications);
    clearAdaptation();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        theme,
        setTheme,
        activeWorkspace,
        setActiveWorkspace,
        currentIntentText,
        activeAdaptiveConfig,
        isAdapting,
        showExplanation,
        setShowExplanation,
        adaptationHistory,
        adaptWorkspace,
        clearAdaptation,
        isAssistantOpen,
        setIsAssistantOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationRead,
        currentUser,
        meetings,
        selectedMeetingId,
        setSelectedMeetingId,
        updateMeetingNotes,
        toggleMeetingChecklist,
        toggleMeetingAgenda,
        toggleActionItem,
        addMeeting,
        messages,
        selectedMessageId,
        setSelectedMessageId,
        markMessageRead,
        addMessage,
        courses,
        selectedCourseId,
        setSelectedCourseId,
        toggleTopicCompletion,
        projects,
        tasks,
        updateTaskStatus,
        updateTaskPriority,
        addTask,
        chatMessages,
        addChatMessage,
        clearChat,
        resetDemoData,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
