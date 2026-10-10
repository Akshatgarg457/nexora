import { Project, ProjectTask, TeamMember } from '../types';

export const initialTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Alex Rivera', avatar: 'AR', role: 'Fullstack Lead' },
  { id: 'tm-2', name: 'Sarah Jenkins', avatar: 'SJ', role: 'Solutions Architect' },
  { id: 'tm-3', name: 'Marcus Lee', avatar: 'ML', role: 'Infrastructure Lead' },
  { id: 'tm-4', name: 'Priya Patel', avatar: 'PP', role: 'UX Designer' },
  { id: 'tm-5', name: 'Devin Vance', avatar: 'DV', role: 'Spring Boot Specialist' },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Enterprise Rollout Q4',
    description: 'Deployment of adaptive workspaces for Acme Corp and tier-1 partner accounts.',
    status: 'active',
    progress: 74,
    dueDate: '2026-10-31',
    taskCount: 14,
    completedTaskCount: 10,
    color: '#4F46E5',
  },
  {
    id: 'proj-2',
    name: 'Spring Boot REST Core Microservice',
    description: 'High-throughput Java Spring Boot backend for intent processing & workspace data synchronization.',
    status: 'active',
    progress: 58,
    dueDate: '2026-11-15',
    taskCount: 12,
    completedTaskCount: 7,
    color: '#0F766E',
  },
  {
    id: 'proj-3',
    name: 'Intent Classification v2 Model',
    description: 'Zero-latency dynamic context inference and proactive widget ordering engine.',
    status: 'planning',
    progress: 35,
    dueDate: '2026-11-30',
    taskCount: 8,
    completedTaskCount: 3,
    color: '#D97706',
  },
];

export const initialTasks: ProjectTask[] = [
  {
    id: 'task-1',
    title: 'Resolve EU cluster network latency spike on staging',
    description: 'Investigate 45ms P99 latency spike observed in Frankfurt cluster during load simulation.',
    projectId: 'proj-1',
    projectName: 'Enterprise Rollout Q4',
    status: 'todo',
    priority: 'urgent',
    assignee: initialTeamMembers[2], // Marcus Lee
    dueDate: '2026-10-09', // Overdue!
    isOverdue: true,
    tags: ['Infrastructure', 'Performance', 'Blocker'],
    blockerNotes: 'Awaiting routing table updates from hosting provider.',
  },
  {
    id: 'task-2',
    title: 'Deliver Acme security and disaster recovery architecture document',
    description: 'Finalize DR topologies and sign off on high-availability failover steps before tomorrow morning.',
    projectId: 'proj-1',
    projectName: 'Enterprise Rollout Q4',
    status: 'in_progress',
    priority: 'urgent',
    assignee: initialTeamMembers[1], // Sarah Jenkins
    dueDate: '2026-10-10', // Overdue/Today!
    isOverdue: true,
    tags: ['Security', 'Acme', 'Client-Facing'],
    blockerNotes: 'Needs verified latency stats from Marcus.',
  },
  {
    id: 'task-3',
    title: 'Implement Spring Boot OpenAPI REST contracts for /api/meetings',
    description: 'Define controller endpoints, DTO models, and error payload structures for meetings sync.',
    projectId: 'proj-2',
    projectName: 'Spring Boot REST Core Microservice',
    status: 'in_progress',
    priority: 'high',
    assignee: initialTeamMembers[4], // Devin Vance
    dueDate: '2026-10-14',
    isOverdue: false,
    tags: ['Backend', 'Spring Boot', 'REST'],
  },
  {
    id: 'task-4',
    title: 'Audit WCAG 2.1 AA accessibility contrast on all workspace themes',
    description: 'Ensure text contrast ratios >= 4.5:1 across dark elements and status badges.',
    projectId: 'proj-3',
    projectName: 'Intent Classification v2 Model',
    status: 'todo',
    priority: 'medium',
    assignee: initialTeamMembers[3], // Priya Patel
    dueDate: '2026-10-16',
    isOverdue: false,
    tags: ['UI/UX', 'Accessibility'],
  },
  {
    id: 'task-5',
    title: 'Build deterministic keyword classifier fallback module',
    description: 'Create zero-latency client-side intent classifier for immediate workspace adaptation when offline.',
    projectId: 'proj-3',
    projectName: 'Intent Classification v2 Model',
    status: 'done',
    priority: 'high',
    assignee: initialTeamMembers[0], // Alex Rivera
    dueDate: '2026-10-08',
    isOverdue: false,
    tags: ['Adaptive Engine', 'Client-Side'],
  },
  {
    id: 'task-6',
    title: 'Finalize OAuth 2.1 token refresh lifecycle in client.ts',
    description: 'Setup Axios request/response interceptors for automatic bearer token injection.',
    projectId: 'proj-2',
    projectName: 'Spring Boot REST Core Microservice',
    status: 'done',
    priority: 'medium',
    assignee: initialTeamMembers[0], // Alex Rivera
    dueDate: '2026-10-07',
    isOverdue: false,
    tags: ['Auth', 'API Integration'],
  },
];
