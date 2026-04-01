# CloudVault v3.0 — Intelligent Secure Cloud Storage Platform

## Project Overview

CloudVault v3.0 is a comprehensive cloud storage management platform featuring a modern glassmorphism UI design, AI-powered file intelligence, security scanning, analytics dashboard, and a unique digital afterlife mode. Built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.4 (Glassmorphism design system)
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Charts**: Recharts (Area, Pie, Bar, Line charts)
- **Icons**: Lucide React
- **Animations**: CSS animations + Framer Motion

## Features Implemented

### 🔐 Authentication & Security
- JWT-based login/signup simulation
- Role-based access (Admin/User)
- Password visibility toggle
- Protected routes with auth guards
- Security alerts system with severity levels
- Access logs tracking

### 📁 File Management
- File upload with drag & drop and progress bar
- Grid and list view modes
- File search, filter by type/access, sort by name/date/size
- File detail panel with AI analysis, version history, access logs
- Risk score display (Low/Medium/High)
- Access level management (Private/Public/Shared)
- Sensitive data detection display

### 🧠 AI File Intelligence
- Automatic file summary generation (simulated)
- Keyword extraction
- Sensitive data detection (emails, phone numbers, credential patterns)
- Risk scoring based on content analysis

### 📊 Analytics Dashboard
- Upload activity area chart
- File type distribution pie chart
- Storage per user bar chart
- Upload trend line chart
- Active share links management
- PDF report generation trigger

### 🔔 Real-time Features
- Notification system (upload, security, login, share, warning)
- Real-time notification dropdown with mark all read
- Unread notification count badge
- Floating AI chatbot with keyword-based NLP

### 🛡️ Security Center
- Security health score (0-100)
- Active/resolved alerts management
- Security features toggle (2FA, IP Whitelisting, Encryption)
- Access logs with export
- Security scan simulation

### 📁 File Versioning
- Version history per file
- Restore previous versions
- Version changelog

### 🌐 File Sharing
- Shareable link generation
- Permission control (View/Edit)
- Expiration settings
- Access count tracking

### 🤖 AI Chatbot Assistant
- Floating chatbot interface
- Keyword-based intent matching
- Quick action buttons
- Responses for: files, security, storage, afterlife, reports

### 🧬 Digital Afterlife Mode
- Inactivity timer configuration (1-24 months)
- Trusted contacts management
- Legacy file marking
- Trigger simulation
- AI summary & email notification plan

### 🎨 UI Design
- Modern glassmorphism design system
- Responsive sidebar navigation
- Ambient background effects
- Custom scrollbar styling
- Smooth animations and transitions
- Dark theme with indigo/purple accent colors

## Architecture

```
src/
├── types/index.ts              # TypeScript interfaces
├── store/
│   ├── authStore.ts            # Auth state (Zustand)
│   ├── fileStore.ts            # File management state
│   ├── notificationStore.ts    # Notification state
│   └── chatStore.ts            # Chatbot state
├── services/
│   └── mockData.ts             # Mock data for all features
├── utils/
│   └── format.ts               # Utility functions
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Header.tsx          # Top header with notifications
│   │   └── AppLayout.tsx       # Main layout wrapper
│   └── chatbot/
│       └── ChatBot.tsx         # Floating AI assistant
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx       # Login page
│   │   └── SignupPage.tsx      # Signup page
│   ├── dashboard/
│   │   └── DashboardPage.tsx   # Main dashboard
│   ├── files/
│   │   └── FileManagerPage.tsx # File manager with full CRUD
│   ├── analytics/
│   │   └── AnalyticsPage.tsx   # Charts & analytics
│   ├── security/
│   │   └── SecurityPage.tsx    # Security center
│   └── digital-afterlife/
│       └── AfterlifePage.tsx   # Digital afterlife mode
├── index.css                   # Global styles & glassmorphism
├── App.tsx                     # Router configuration
└── main.tsx                    # Entry point
```

## Design System

- **Background**: Deep navy (#0a0e1a) with grid pattern
- **Glass Effect**: backdrop-blur with semi-transparent borders
- **Primary Color**: Indigo (#6366f1) to Purple gradient
- **Cards**: Rounded corners (16px) with hover glow effects
- **Text**: Slate scale for hierarchy
- **Badges**: Color-coded severity/access indicators

## Backend Simulation

This application uses Zustand stores with mock data to simulate a full-stack experience. In production, these would connect to:
- **Express.js** backend with JWT auth
- **MongoDB** with Mongoose for data persistence
- **Cloudinary** for cloud file storage
- **Python Flask/FastAPI** microservice for AI analysis
- **Socket.IO** for real-time notifications
