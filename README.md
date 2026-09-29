# Assignment Management System (EduAssign)

A full-stack, role-based academic platform built with **React.js, Vite, Node.js, Express.js, MongoDB, and Mongoose**. Designed for professors/admins to create assignments and students to submit work with automatic server-side deadline tracking (**ON TIME** vs **LATE**).

---

## 🌟 Features Overview

### 1. 🛡️ Role-Based Authentication & Authorization
- Separate **Admin/Professor** and **Student** registration and login portals.
- **JWT (JSON Web Token)** authentication stored securely.
- Passwords salted and hashed with **bcryptjs**.
- Backend middleware (`authenticateUser`, `authorizeRole`) enforcing role-based endpoint access.

### 2. 👨‍🏫 Admin / Professor Capabilities
- **Admin Dashboard**: Summary cards for Total Assignments, Active Assignments, and Total Submissions.
- **Create Assignment**: Form to set Title, Description, and Submission Deadline.
- **My Assignments**: Card/Table view of created assignments, active/closed status, submission counters, and delete actions.
- **Submissions View**: Table listing student submissions with student info, exact submission time, and automatic ON TIME vs LATE badges.
- **Submission Modal**: Inspect full text responses and open project repository links safely in a new tab.

### 3. 🎓 Student Capabilities
- **Student Dashboard**: Overview of Active Assignments, Submitted tasks, and Pending submissions.
- **View Active Assignments**: Filtered view of course tasks with deadline countdowns.
- **Assignment Details & Submission**: Submit either Option 1 (Text response) OR Option 2 (GitHub/Drive URL link).
- **Deadline Logic**: Server-side timestamping compares submission time with assignment deadline (`submissionTime <= deadline` → **ON TIME**, else → **LATE**).
- **My Submissions**: Track past submission history, status badges, and submission timestamps.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, React Router DOM v6, Axios, Lucide Icons, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js REST API, CORS, dotenv, JSONWebToken, bcryptjs.
- **Database**: MongoDB & Mongoose ORM (Supports remote `MONGODB_URI` and built-in `mongodb-memory-server` for zero-configuration local runs).

---

## 📂 Project Structure

```
assignment-management-system/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, TopHeader, Modal, Toast, ProtectedRoute
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # LandingPage, Auth Pages, Admin Pages, Student Pages
│   │   ├── services/           # Axios API configuration
│   │   ├── App.jsx             # Main router configuration
│   │   ├── main.jsx            # React root entry
│   │   └── index.css           # Global dark design system stylesheet
│   └── package.json
│
├── server/                     # Express + Node.js Backend
│   ├── config/                 # Database connection (supports MONGODB_URI + MemoryServer)
│   ├── controllers/            # Auth, Assignment, and Submission controllers
│   ├── middleware/             # JWT Auth & Role Authorization middlewares
│   ├── models/                 # User, Assignment, and Submission Mongoose models
│   ├── routes/                 # Express API routes
│   ├── utils/                  # Seed script for initial demo accounts
│   ├── server.js               # Express server entry point
│   └── package.json
│
├── .env.example                # Sample environment variables
├── .gitignore
└── package.json                # Root package for concurrent execution
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+) and npm.

### 2. Installation
Run the following command in the root directory:
```bash
npm run install:all
```
This installs dependencies for root, server, and client.

### 3. Running the Application

To run both backend and frontend concurrently:
```bash
npm run dev
```

Or start them individually:
- **Backend**: `cd server && npm run dev` (Runs on `http://localhost:5001`)
- **Frontend**: `cd client && npm run dev` (Runs on `http://localhost:3000`)

---

## 🔑 Pre-Seeded Demo Accounts

When the backend starts for the first time, demo accounts and sample assignments are seeded automatically:

| Role | Email | Password | Identifier |
|---|---|---|---|
| **Admin / Professor** | `admin@example.com` | `admin123` | Admin ID: `ADM-2026-01` |
| **Student** | `student@example.com` | `student123` | Student ID: `STU-2026001` |

---

## 📡 Key REST API Endpoints

### Auth Routes (`/api/auth`)
- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `POST /api/auth/student/register`
- `POST /api/auth/student/login`
- `GET /api/auth/me` (Protected)

### Assignment Routes (`/api/assignments`)
- `POST /api/assignments` (Admin only)
- `GET /api/assignments` (Protected)
- `GET /api/assignments/:id` (Protected)
- `DELETE /api/assignments/:id` (Admin only)

### Submission Routes (`/api/submissions`)
- `POST /api/submissions` (Student only)
- `GET /api/submissions` (Admin only)
- `GET /api/submissions/assignment/:assignmentId` (Admin only)
- `GET /api/submissions/student/:studentId` (Student only)

---

## 📋 Database Schemas

### User Schema
- `name` (String, required)
- `email` (String, unique, lowercase)
- `password` (String, hashed via bcrypt)
- `role` (Enum: `admin`, `student`)
- `adminId` / `studentId` (String, sparse unique)
- `department` (String)
- `academicYear` (String, student only)

### Assignment Schema
- `title` (String, required)
- `description` (String, required)
- `deadline` (Date, required)
- `createdBy` (ObjectId, ref `User`)

### Submission Schema
- `assignmentId` (ObjectId, ref `Assignment`)
- `studentId` (ObjectId, ref `User`)
- `response` (String)
- `submissionLink` (String)
- `submittedAt` (Date, server timestamp)
- `status` (Enum: `ON_TIME`, `LATE`)

---

## 🛡️ License
Built for College Project & Internship Demonstration.
