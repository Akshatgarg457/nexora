# NEXORA — Adaptive AI Workspace Platform (React Frontend)

> **"Your Intent. Your Workspace."**  
> Problem Statement: *Intent-to-Interface: An interface that reshapes itself around the user's current goal.*

Nexora is an intelligent workspace platform that unifies meetings, communications, learning, project management, and analytics into a single adaptive interface. Instead of forcing users through rigid, static menus, Nexora's **Adaptive Intent Engine** actively detects the user's objective and dynamically reshapes the layout, widget prioritization, visibility, and contextual actions around that goal.

---

## 1. Architecture Overview

- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS
- **Routing**: React Router (`react-router-dom`)
- **State Management**: Centralized React Context (`WorkspaceContext`) with deterministic intent classification
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Backend Readiness**: Decoupled HTTP API client configured for Java Spring Boot REST microservices (`src/api/client.ts`), with zero-breakage mock fallbacks for standalone execution.

---

## 2. Getting Started & Running Locally

### Prerequisites
- Node.js 18+ or 20+
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start the Vite development server (Port 3000)
npm run dev

# Build for production
npm run build

# Run TypeScript checks
npm run lint
```

---

## 3. Environment Variables

Create or configure `.env` (refer to `.env.example`):

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Java Spring Boot REST backend | `http://localhost:8080/api` |
| `VITE_ENABLE_LIVE_SPRING_BOOT` | Toggle to force live network requests vs client-side mock fallback | `false` |

> **Offline Independence**: When `VITE_ENABLE_LIVE_SPRING_BOOT` is not set or when the Spring Boot server is unreachable on port 8080, the application automatically invokes client-side mock service providers so all screens, quizzes, kanban boards, and AI generators remain fully functional.

---

## 4. Workspaces & Key Routes

| Route | Workspace | Key Features |
|---|---|---|
| `/` | Landing Page | Value proposition, interactive adaptive demonstration, workspace directory |
| `/login` | Authentication | Sign-in with client validation and 1-click lead architect demo entry |
| `/register` | Registration | New user onboarding with confirmation validation |
| `/app` | Main Dashboard | High-level summary of upcoming meetings, overdue blockers, study streak, and intent bar |
| `/app/meetings` | Meeting Workspace | Agendas, client profiles, editable notes, action items checklist, AI executive summary synthesis |
| `/app/communication` | Communication Workspace | Inbox triage, urgent indicators, thread summarization, AI executive tone rewriters |
| `/app/study` | Study Workspace | Operating Systems & Cloud curricula, topic checklists, interactive flashcards, 3-question diagnostic quiz with instant feedback |
| `/app/projects` | Project Management | Sprint 24 Kanban board (To Do, In Progress, Done), overdue task blocker warning, assignee workloads, task creator |
| `/app/analytics` | Data Analytics | Revenue, active users, conversion rate, usage hours, Recharts area/bar trends, mobile funnel dropoff breakdown, automated insight cards |
| `/app/assistant` | AI Assistant | Conversational interface with domain-aware responses and 1-click workspace reshape triggers |
| `/app/settings` | Settings | Profile preferences, Spring Boot REST health check ping, factory demo data reset |

---

## 5. Primary Adaptive Scenarios

Users can type natural language or click suggested chips in the **Adaptive Intent Bar**:

1. **Meeting Intent**: *"Prepare for tomorrow's client meeting."*
   - Routes to Meeting Workspace
   - Prioritizes Acme Corporation agenda & David Vance profile
   - Surfaces 18ms Frankfurt latency SLA benchmark & open DR action items
2. **Communication Intent**: *"Summarize my unread messages."*
   - Routes to Communication Workspace
   - Isolates 3 unread priority emails
   - Activates 1-click AI executive reply rewriters
3. **Study Intent**: *"Help me study operating systems."*
   - Routes to Study Workspace
   - Highlights incomplete topic: Deadlock Characterization & Banker's Algorithm
   - Displays active recall flashcards & diagnostic practice quiz
4. **Project Management Intent**: *"Review overdue project tasks."*
   - Routes to Project Management Workspace
   - Highlights critical overdue deliverables (EU cluster network latency & Acme DR document)
   - Enables fast status updates and blocker triage
5. **Analytics Intent**: *"Investigate declining product usage."*
   - Routes to Data Analytics
   - Displays 30-day active user drop (-4.3%) alongside steady revenue
   - Isolates Onboarding Funnel Step 3 (Workspace Customization) 28% dropoff on mobile devices

---

## 6. Proposed Spring Boot REST API Contracts (Coordination Layer)

The frontend API layer in `src/api/` is designed to map directly to Java Spring Boot controllers:

### 1. Authentication (`AuthController`)
- `POST /api/auth/login`
  - **Request**: `{ "email": string, "password"?: string, "rememberMe"?: boolean }`
  - **Response**: `{ "user": UserDTO, "token": string, "expiresIn": number }`
- `POST /api/auth/register`
  - **Request**: `{ "name": string, "email": string, "password"?: string }`
  - **Response**: `{ "user": UserDTO, "token": string, "expiresIn": number }`

### 2. Meetings (`MeetingController`)
- `GET /api/meetings` -> `List<MeetingDTO>`
- `GET /api/meetings/{id}` -> `MeetingDTO`
- `POST /api/meetings` -> `MeetingDTO`
- `PUT /api/meetings/{id}/notes` -> `{ "notes": string }`
- `POST /api/meetings/{id}/summary` -> `{ "summary": string }`

### 3. Communications (`MessageController`)
- `GET /api/messages` -> `List<MessageDTO>`
- `PUT /api/messages/{id}/read` -> `{ "isRead": boolean }`
- `POST /api/messages` -> `MessageDTO`
- `POST /api/messages/rewrite` -> `{ "rewrittenText": string }`

### 4. Projects & Tasks (`ProjectController`)
- `GET /api/projects` -> `List<ProjectDTO>`
- `GET /api/projects/tasks` -> `List<ProjectTaskDTO>`
- `PUT /api/projects/tasks/{id}/status` -> `{ "status": "todo" | "in_progress" | "done" }`
- `POST /api/projects/tasks` -> `ProjectTaskDTO`

### 5. Study & Curricula (`StudyController`)
- `GET /api/study/courses` -> `List<CourseDTO>`
- `PUT /api/study/courses/{courseId}/topics/{topicId}` -> `{ "completed": boolean }`

### 6. Analytics (`AnalyticsController`)
- `GET /api/analytics/summary?range={range}` -> `AnalyticsSummaryDTO`
- `GET /api/analytics/trends?range={range}` -> `List<TimeSeriesPointDTO>`

### 7. AI Assistant & Intent (`AdaptiveController`)
- `POST /api/adaptive/evaluate-intent` -> `AdaptiveConfigurationDTO`
- `POST /api/assistant/chat` -> `ChatMessageDTO`
