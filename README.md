# Assignment Management System (EduAssign) — Level 2 Edition

A complete full-stack academic platform built with **React.js, Vite, Node.js, Express.js, MongoDB, and Mongoose**. Features role-based assignment management, automatic server-side deadline tracking (**ON TIME** vs **LATE**), professor review workflows (**Marks & Written Feedback**), and **Multi-Version History Resubmission** capabilities.

---

## 🌟 Level 2 Extension Features Overview

### 1. 👨‍🏫 Admin / Professor Review System
- **Dashboard Review Summary**: Live statistics for Total Assignments, Total Submissions, **Pending Reviews**, **Needs Changes**, and **Accepted** work.
- **Dedicated Review Interface** (`/admin/submissions/:id/review`):
  - **Desktop 2-Column Layout**: Left column displays complete student submission details (Version, timing status, text response, project repository link, and version history trigger). Right column provides the evaluation panel.
  - **Marks & Feedback**: Input marks ($0 \le \text{marks} \le \text{maxMarks}$) and plain-text written feedback.
  - **Review Status Decisions**: Set status to **`ACCEPTED`** or **`NEEDS_CHANGES`**.
- **Automated Student Notifications**: Generating in-app notification alerts upon review completion.

### 2. 🎓 Student Multi-Version Resubmission & History
- **Multi-Version Tracking**: Every resubmission creates a **brand new version record** (`Version 1`, `Version 2`, ...) in MongoDB. Previous versions are **never deleted or overwritten**.
- **Student Feedback Page** (`/student/submissions/:assignmentId`): Displays current version, marks, review status badge, and professor feedback notes.
- **Resubmission Workflow** (`/student/submissions/:assignmentId/update`): Visible when professor requests `NEEDS_CHANGES`. Allows students to submit an updated text response or repository link.
- **Vertical Timeline History** (`/student/submissions/:assignmentId/history`): Visual chronological timeline showing all versions submitted, respective timestamps, timing badges, marks awarded, and professor feedback per version.
- **Accepted Protection**: Once a submission is **`ACCEPTED`**, resubmission is locked.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, React Router DOM v6, Axios, Lucide Icons, Enhanced Glassmorphism Design System.
- **Backend**: Node.js, Express.js REST API, CORS, dotenv, JSONWebToken, bcryptjs.
- **Database**: MongoDB & Mongoose ORM (Supports remote `MONGODB_URI` connection and `mongodb-memory-server` fallback).

---

## 🔑 Pre-Seeded Level 2 Demo Accounts

When the backend starts, demo accounts and sample multi-version submissions are seeded automatically into MongoDB:

| Role | Email | Password | Identifier / ID |
|---|---|---|---|
| **Admin / Professor** | `admin@example.com` | `admin123` | Admin ID: `ADM-2026-01` |
| **Student** | `student@example.com` | `student123` | Student ID: `STU-2026001` |

---

## 📡 REST API Endpoints

### Auth Routes (`/api/auth`)
- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `POST /api/auth/student/register`
- `POST /api/auth/student/login`
- `GET /api/auth/me`

### Assignment Routes (`/api/assignments`)
- `POST /api/assignments` (Admin: title, description, deadline, maxMarks)
- `GET /api/assignments`
- `GET /api/assignments/:id`
- `DELETE /api/assignments/:id`

### Submission Routes (`/api/submissions`)
- `POST /api/submissions` (Student initial submission)
- `POST /api/submissions/:assignmentId/versions` (Student resubmission)
- `PUT /api/submissions/:id/review` (Admin review: marks, status, feedback)
- `GET /api/submissions` (Admin list + review stats)
- `GET /api/submissions/assignment/:assignmentId/history` (Version history timeline)
- `GET /api/submissions/student/:studentId` (Student latest submissions)

---

## 🛡️ License
Built for College Project & Internship Demonstration.
