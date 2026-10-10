# Nexora Temporary Demo Frontend

This directory contains the temporary corporate SaaS integration demo frontend for the **Nexora Workspace Platform**. It connects to the Spring Boot 3 backend REST API on `http://localhost:8080/api`.

---

## Technical Stack
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios (with JWT Interceptor & Auth Guard)
- **Icons:** Lucide React
- **Data Visualization:** Recharts

---

## Configuration

Environment configuration is managed via `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## How to Run

### Step 1: Start the Spring Boot Backend
From the root directory (`nexora-backend`):
```bash
.\mvnw.cmd spring-boot:run
```

### Step 2: Start the Demo Frontend
From the `demo-frontend` directory:
```bash
cd demo-frontend
npm install
npm run dev
```

The demo frontend will run at: **http://localhost:5174** (or http://localhost:5173).

---

## Demo Credentials

You can use the following default bootstrap credentials or the Quick Fill buttons on the Login page:

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@nexora.com` | `Admin@Nexora2026!` |
| **Manager** | `alex.morgan@nexora.com` | `Password123!` |
| **Employee** | `sarah.chen@nexora.com` | `Password123!` |
| **Intern** | `david.vance@nexora.com` | `Password123!` |

---

## Workspaces Included
1. **Overview Dashboard:** Executive KPI overview, upcoming meetings, active projects, learning progress.
2. **Meetings Workspace:** Schedule sessions, invite directory members, set location & agenda.
3. **Communication Workspace:** Direct peer-to-peer messaging via REST APIs.
4. **Study & Learning Workspace:** Technical course catalog, progress tracker, sample transcripts.
5. **Project Management Workspace:** Milestone tracking, task assignment board, status updates, progress reports.
6. **Data Analytics Workspace:** Live database analytics and Recharts visualizations.
7. **Nexora AI Assistant:** Sliding drawer query panel connected to `POST /api/ai/query`.
8. **Admin Employee Directory:** Provision new employee accounts and manage active status (secured with `@PreAuthorize("hasRole('ADMIN')")`).
