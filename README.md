# RoaaRosa — Full-Stack E-Commerce Platform

A production-ready, full-stack E-Commerce platform built with a high-performance **Next.js 15 (React 19)** storefront and a scalable **NestJS & Prisma ORM** backend powered by **PostgreSQL**.

---

## 🏗️ Repository Architecture

This repository is organized as a clean monorepo separating frontend presentation from backend business logic and database architecture:

```text
RoaaRosa_ECommerce/
├── frontend/                # Next.js 15 Storefront Application
│   ├── src/                 # App router pages, components, redux, services
│   ├── public/              # Brand assets, icons, dynamic OG imagery
│   ├── package.json         # Frontend dependencies and scripts
│   ├── next.config.ts       # Next.js build configuration
│   └── .env.example         # Frontend environment template
│
├── backend/                 # NestJS Application & API Gateway
│   ├── src/                 # Modules, controllers, services, guards, interceptors
│   ├── prisma/              # Prisma schema, migrations, seed data
│   ├── package.json         # Backend dependencies and scripts
│   ├── tsconfig.json        # TypeScript compiler options
│   └── .env.example         # Backend database and environment template
│
├── docs/                    # Technical Architecture & Milestone Documentation
│   ├── milestone-00-requirements-architecture.md
│   ├── milestone-01-database-design.md
│   ├── milestone-02-postgresql-setup.md
│   ├── milestone-03-prisma-migrations-seed.md
│   └── milestone-04-nestjs-setup.md
│
├── BACKEND_IMPLEMENTATION_PLAN.md  # Comprehensive backend development roadmap
├── .gitignore               # Unified monorepo ignore rules
└── README.md                # Project documentation and developer guide
```

---

## 🚀 Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 15 (App Router, Server Components & Actions)
- **UI & Styling**: React 19, Tailwind CSS v4, Radix UI Primitives, Lucide Icons
- **State Management**: Redux Toolkit & React-Redux
- **Authentication**: NextAuth.js
- **Animations & Carousel**: Swiper, Framer Motion
- **Form Handling & Validation**: React Hook Form, Zod

### Backend (`/backend`)
- **Framework**: NestJS 11+ (Modular enterprise architecture)
- **ORM & Database**: Prisma ORM 6+, PostgreSQL
- **Security & Auth**: Bcrypt, JWT, Role-based Access Control (RBAC)
- **Validation**: Class Validator & Class Transformer
- **Observability**: Global Exception Filters, Logging Interceptors, Healthchecks

---

## ⚙️ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+
- **PostgreSQL**: Local or hosted instance (e.g., Supabase / Neon / Docker)

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```
Storefront runs at `http://localhost:3000`.

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma db push

# Seed the database
npm run prisma:seed # or npx tsx prisma/seed.ts

# Start the NestJS backend
npm run start:dev
```
API runs at `http://localhost:4000` (or configured `PORT`).

---

## 📚 Technical Documentation & Milestones

Detailed architecture and engineering milestones are thoroughly documented in [`/docs`](docs/):
- **Milestone 0**: [Requirements & System Architecture](docs/milestone-00-requirements-architecture.md)
- **Milestone 1**: [Database Relational Design & Data Dictionary](docs/milestone-01-database-design.md)
- **Milestone 2**: [PostgreSQL Database Setup & Configuration](docs/milestone-02-postgresql-setup.md)
- **Milestone 3**: [Prisma Migrations & Comprehensive Seed Script](docs/milestone-03-prisma-migrations-seed.md)
- **Milestone 4**: [NestJS Setup & Modular Scaffolding](docs/milestone-04-nestjs-setup.md)
- **Roadmap**: [Backend Implementation Plan](BACKEND_IMPLEMENTATION_PLAN.md)

---

## 👩‍💻 Author & Maintainer
- **Aya Mounis** ([@ayamounis](https://github.com/ayamounis))
- Repository: [RoaaRosa_ECommerce](https://github.com/ayamounis/RoaaRosa_ECommerce)
