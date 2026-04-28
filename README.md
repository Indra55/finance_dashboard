# Advanced Finance Intelligence Architecture

A production-ready, full-stack finance dashboard system featuring granular Role-Based Access Control (RBAC), real-time financial analytics, and a premium glassmorphic interface. Built as part of a backend engineering internship assessment.

## Live Implementation

* **Deployment Strategy:** Managed via **Holonet PaaS** (Self-hosted on AWS EC2)

---

## 🔐 Identity & Access Flow

### **User Archetypes**

To evaluate the system, use these pre-seeded credentials:

| Role        | Email                 | Password     | Capabilities Profile                  |
| ----------- | --------------------- | ------------ | ------------------------------------- |
| **Admin**   | `admin@example.com`   | `admin123`   | Full CRUD + User Registry + Analytics |
| **Analyst** | `analyst@example.com` | `analyst123` | Creation/Editing + Analytics          |
| **Viewer**  | `viewer@example.com`  | `viewer123`  | Read-Only Ledger + Analytics          |

### **Flow Diagram**

```mermaid
graph TD
    A[Landing Page] --> B{Identity Known?}
    B -- No --> C[Sign Up / Sign In]
    C --> D[Vault Dashboard]
    B -- Yes --> D
    
    D --> E[Record Management]
    D --> F[Financial Analytics]
    D --> G{Is Admin?}
    G -- Yes --> H[Identity Registry]
    G -- No --> D
    
    E --> I[Logout]
    H --> I
    I --> A
```

---

## 📊 Data Schema

Utilizes a relational PostgreSQL model designed for ACID compliance and audit trails.

```mermaid
erDiagram
    USERS ||--o{ FINANCIAL_RECORDS : "owns"
    USERS {
        uuid id PK
        string name
        string email UK
        string password_hash
        string role "admin | analyst | viewer"
        string status "active | inactive"
        string refresh_token
        timestamp created_at
    }
    FINANCIAL_RECORDS {
        uuid id PK
        uuid user_id FK
        decimal magnitude "15,2 precision"
        string flow_type "income | expense"
        string category
        text narrative
        date origin_date
        bool is_deleted
        timestamp created_at
    }
```

---

## The Stack

### **Backend (The Engine)**

* **Runtime:** [Bun](https://bun.sh) (Native TypeScript support & high-perf I/O)
* **Framework:** Express.js v5 (Standardized RESTful architecture)
* **Database:** PostgreSQL (Relational integrity & ACID compliance)
* **Auth:** Dual-Token JWT (Access + Refresh tokens with httpOnly cookies)
* **Validation:** Type-safe custom validators & Zod-inspired schema check

### **Frontend (The Interface)**

* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS (Modern glassmorphic utility-first design)
* **Architecture:** Unified Responsive Dashboard (Desktop Sidebar + Mobile Floating Dock)
* **State Management:** React Context API (Identity & Auth synchronization)

---

## Architecture

```bash
project/
├── client/                     # Next.js Frontend
│   ├── app/                    # App Router (Dashboard, Login, Landing)
│   ├── components/             # Reusable UI & Complex Layouts
│   ├── context/                # Auth & Identity state management
│   └── lib/                    # API clients and utility functions
└── server/                     # Bun + Express Backend
    ├── config/                 # DB Pool & Swagger definitions
    ├── controllers/            # Business logic handlers
    ├── middleware/             # Auth, RBAC, and Error filters
    ├── routes/                 # REST Endpoint definitions
```

---

## Role-Based Access Control (RBAC)

Implements a strict permission hierarchy:

| Role        | Records Management | Analytics | User Ops | Permissions Profile         |
| ----------- | ------------------ | --------- | -------- | --------------------------- |
| **Admin**   | Full CRUD + Delete | Full      | Full     | System over-watch & audit   |
| **Analyst** | Create / Update    | Full      | None     | Data processing & reporting |
| **Viewer**  | Read-only          | Read      | None     | Observations & auditing     |

> **Note:** Registration defaults to `viewer`. Role escalation must be performed by an existing `admin` via the User Management interface.

---

## Local Development

### 1. Requirements

* [Bun](https://bun.sh) installed.
* PostgreSQL instance running.

### 2. Configuration

Create a `.env` in the `server/` directory:

```env
PORT=5555
PG_CONNECTION_STRING=postgres://user:pass@localhost:5432/finance_db
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:3000
```

### 3. Execution

```bash
# Install dependencies
bun install

# Initialize DB
psql -d finance_db -f server/db/init.sql

# Seed the database
cd server && bun run scripts/seed.ts

# Start development environment
bun run dev:all
```

---

## Testing Suite

Tests are built with **Vitest** and **Supertest** to ensure architectural reliability.

```bash
cd server
bun test
```

---

## Design Philosophy & Choices

1. **Self-Contained PaaS:** Deployed on **Holonet** to demonstrate end-to-end infrastructure knowledge.
2. **Stateless Scalability:** JWT-based auth handles sessions efficiently without server-side state.
3. **Glassmorphism UI:** Premium fintech aesthetic using backdrop blurs and luminescent accents.
4. **Soft-Delete Patterns:** Financial data is never truly lost; records are marked `is_deleted: true` to preserve audit trails.

---

**Developed & Maintained by Hitanshu Gala**
[GitHub](https://github.com/indra55) | [LinkedIn](https://www.linkedin.com/in/hitanshugala/) | [Portfolio](https://hitanshu.xyz)


