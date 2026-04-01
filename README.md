# Zorvyn – Advanced Finance Intelligence Architecture

A production-ready, full-stack finance dashboard system featuring granular Role-Based Access Control (RBAC), real-time financial analytics, and a premium glassmorphic interface. Built as part of a backend engineering internship assessment.

## 🚀 Live Implementation

- **Platform:** [https://zorvyn.hitanshu.xyz](https://zorvyn.hitanshu.xyz)
- **Deployment Strategy:** Managed via **Holonet PaaS** (Self-hosted on AWS EC2)
- **API Documentation:** [https://zorvyn-backend.hitanshu.xyz/api-docs](https://zorvyn-backend.hitanshu.xyz/api-docs)

---

## 🛠️ The Stack

### **Backend (The Engine)**
- **Runtime:** [Bun](https://bun.sh) (Native TypeScript support & high-perf I/O)
- **Framework:** Express.js v5 (Standardized RESTful architecture)
- **Database:** PostgreSQL (Relational integrity & ACID compliance)
- **Auth:** Dual-Token JWT (Access + Refresh tokens with httpOnly cookies)
- **Validation:** Type-safe custom validators & Zod-inspired schema check

### **Frontend (The Interface)**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (Modern glassmorphic utility-first design)
- **Icons:** Lucide React (Clean, minimal visual language)
- **State Management:** React Context API (Identity & Auth synchronization)
- **Charts:** Recharts (High-fidelity financial data visualization)

---

## ⚙️ Architecture

```bash
zorvyn/
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
    ├── utils/                  # Validation & Parsing helpers
    └── db/                     # SQL Schemas & Initializers
```

---

## 🔐 Role-Based Access Control (RBAC)

Zorvyn implements a strict permission hierarchy designed for organizational financial management:

| Role        | Records Management  | Analytics | User Ops | Permissions Profile |
|-------------|---------------------|-----------|----------|---------------------|
| **Admin**   | Full CRUD + Delete  | ✅ Full    | ✅ Full   | System over-watch & audit |
| **Analyst** | Create / Update     | ✅ Full    | ❌ None  | Data processing & reporting |
| **Viewer**  | 👁️ Read-only        | 👁️ Read   | ❌ None  | Observations & auditing |

> **Note:** Registration defaults to `viewer`. Role escalation must be performed by an existing `admin` via the User Management interface.

---

## 📊 Analytics Suite (API Endpoints)

The dashboard is powered by a set of high-performance aggregation queries:

- **`/api/dashboard/summary`**: Real-time Net Balance, Total Income, and Total Expense calculations.
- **`/api/dashboard/category-totals`**: Spend distribution across categories (Food, Rent, Salary, etc.).
- **`/api/dashboard/trends`**: Monthly historical analysis for the last 12 months.
- **`/api/dashboard/recent`**: Stream of the last 10 transactions with role-aware detail levels.

---

## 🛠️ Local Development

### 1. Requirements
- [Bun](https://bun.sh) installed.
- PostgreSQL instance running.

### 2. Configuration
Create a `.env` in the root (and `server/` directory) with the following:
```env
PORT=5555
PG_CONNECTION_STRING=postgres://user:pass@localhost:5432/zorvyn
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:3000
```

### 3. Execution
```bash
# Install dependencies
bun install

# Initialize DB
psql -d zorvyn -f server/db/init.sql

# Start development environment
bun run dev:all # Starts both client and server
```

---

## 🧪 Testing Suite

Tests are built with **Vitest** and **Supertest** to ensure architectural reliability:
- **Auth Integrity:** Validates token issuance, rotation, and rejection of malformed identity signatures.
- **RBAC Guarding:** Strictly tests that `Viewers` cannot invoke `POST/PUT/DELETE` methods.
- **Data Validation:** Ensures UUID formats, currency precision, and date ranges.

```bash
cd server
bun test
```

---

## 🏁 Design Philosophy & Choices

1. **Self-Contained PaaS:** Deployed on **Holonet**, a custom-built PaaS platform that demonstrates infrastructure management skills alongside backend coding.
2. **Stateless Scalability:** JWT tokens allow the backend to scale horizontally without session synchronization.
3. **Glassmorphism UI:** Chosen to give the application a "High-End Fintech" feel, moving away from generic dashboards.
4. **Soft-Delete Patterns:** Financial data is never truly lost; records are marked `is_deleted: true` to preserve audit trails while hiding them from standard views.

---

**Developed & Maintained by Hitanshu Gala**
[GitHub](https://github.com/indra55) | [LinkedIn](https://www.linkedin.com/in/hitanshugala/) | [Portfolio](https://hitanshu.xyz)
