<div align="center">

# ⚡ TALENTX
### 🤖 AI-Powered Local Talent & Service Marketplace (MERN Stack) 🇵🇰

**Connecting Pakistani businesses with top-tier verified local professionals through intelligent neural matching, milestone-based escrow contracts, and local PKR settlement.**

<br />

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

[🚀 Quick Start](#-quick-start--installation) • [🌟 Core Capabilities](#-core-capabilities) • [🏛️ Architecture](#%EF%B8%8F-system-architecture) • [📡 API Reference](#-rest-api-specification) • [🛡️ Portal Matrix](#%EF%B8%8F-role-based-portal-matrix)

---

</div>

> [!NOTE]
> 🇵🇰 **TalentX** is purpose-built for the Pakistani marketplace (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and beyond). It bridges the gap in physical/on-site service hiring (fashion photography, drone cinematography, studio shoots) alongside digital engineering (MERN full-stack development, Figma UI/UX, mobile apps) with zero international card friction.

---

## 💎 Platform Highlights

```
+-----------------------------------------------------------------------------------+
|  🤖 AI SCORING ENGINE    |  🤝 ESCROW CONTRACTS    |  🏛️ TRI-PORTAL WORKSPACE     |
|  🎯 Skills: 40% Weight   |  🔒 50/50 Staged Release|  🏢 Dedicated Client Portal  |
|  📍 Location: 25% Weight |  💰 PKR Local Settlement|  🧑‍💻 Freelancer Career Hub   |
|  ⭐ Past Rating: 20%     |  🛡️ Dispute Protection  |  👑 Master Admin Dashboard   |
|  💵 Budget Fit: 15%      |  ⚡ Zero Dollar Hassles |  💬 Real-Time Chat Suite     |
+-----------------------------------------------------------------------------------+
```

---

## 🌟 Core Capabilities

### 🤖 1. Neural Candidate Matching
- **Multi-Factor Scoring Engine**: Analyzes skill overlap, city proximity, client ratings, and budget feasibility to match the best candidate.
- **Smart AI Generators**: Instant proposal drafting for freelancers and structured job briefs for clients.

### 🤝 2. Milestone Escrow & Payment Protection
- **Staged Deliverables**: Projects are structured into milestones (e.g. Milestone 1: Raw Shoot, Milestone 2: Final Edits).
- **Secure Escrow**: Client funds are safely locked in escrow and released upon work approval.

### 💬 3. Real-Time Chat & Negotiation Suite
- **Direct Workspace Messaging**: Built-in chat with instant hire triggers, unread notification counters, and conversation filters.

### 🛡️ 4. Master Admin Command Center
- **Total Oversight**: User moderation, verification badges, job approvals, escrow monitoring, platform fee settings, and global announcement banners.

---

## 🛡️ Role-Based Portal Matrix

| Feature / Capability | 🏢 Client (Business) | 🧑‍💻 Freelancer (Talent) | 👑 Master Admin |
| :--- | :---: | :---: | :---: |
| **Post Projects & Define Budgets** | ✅ Yes | ❌ No | 🛠️ Full Moderation |
| **Submit Proposals & Bid Quotes** | ❌ No | ✅ Yes | 👁️ Review Only |
| **Direct Milestone Creation** | ✅ Yes | 📩 Review & Accept | ⚡ Override Access |
| **Escrow Fund Release** | ✅ Yes | ❌ No | 🔒 Dispute Override |
| **Visual Portfolio Showcase** | ❌ No | ✅ Yes | 🗑️ Moderation |
| **User Access & Verification Badges** | ❌ No | ❌ No | 🛡️ Grant / Revoke |
| **Broadcast Announcement Banners** | 👁️ View | 👁️ View | 📢 Create & Toggle |
| **Platform Financial Analytics** | 📊 Spent Stats | 💰 Earnings Stats | 📈 Platform-Wide |

---

## 🏛️ System Architecture

For detailed architectural flowcharts, Mermaid sequence diagrams, and database schemas, visit **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

```
TalentX Project Structure
├── 🌐 client/                  # Frontend Application (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # Modals, Hero, Navbar, Footer, Preloaders
│   │   ├── pages/              # 10 Dedicated Workspaces & Dashboards
│   │   ├── services/           # Full-Stack MongoDB Atlas API integration layer
│   │   ├── utils/              # AI Candidate Matcher & Storage synchronizer
│   │   └── data/               # Categories and Pakistani cities dataset
│   └── package.json
│
├── ⚙️ server/                  # Backend REST API (Node.js + Express)
│   ├── config/                 # MongoDB database connection engine
│   ├── controllers/            # Auth, Jobs, Talents, Proposals, Contracts, AI
│   ├── middleware/             # JWT token authentication & role authorization
│   ├── models/                 # Mongoose Schemas (User, Job, Contract, Proposal, Message)
│   ├── routes/                 # Express API route endpoints
│   └── server.js               # Application entry point
│
├── 🏛️ ARCHITECTURE.md          # In-depth system design & technical specification
└── 📖 README.md                # Visual project documentation
```

---

## 🚀 Quick Start & Installation

### 📋 Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Database**: MongoDB Atlas Cluster or Local MongoDB Instance

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/maaz-ahmad06/TalentX.git
cd TalentX
```

### 2️⃣ Configure and Start the Backend Server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/talentx_db
JWT_SECRET=talentx_secret_jwt_key_pakistan_2026
JWT_EXPIRE=30d
```

Launch the backend API:
```bash
npm run dev
```

### 3️⃣ Configure and Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

The application will be live at:
- 🌐 **Web App**: `http://localhost:5173`
- ⚙️ **REST API**: `http://localhost:5000`

---

## 📡 REST API Specification

<details>
<summary><strong>👉 Click to expand Complete API Endpoints Reference</strong></summary>

<br />

### 🔑 Authentication & Users (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new Client or Talent account | No |
| `POST` | `/api/auth/login` | Portal-verified authentication | No |
| `GET` | `/api/auth/me` | Fetch active user session profile | Bearer Token |
| `PUT` | `/api/auth/profile` | Update profile information & bio | Bearer Token |
| `GET` | `/api/auth/users` | List all platform users (Admin view) | Admin |
| `PUT` | `/api/auth/users/:id` | Update user status / verification badge | Admin |
| `DELETE` | `/api/auth/users/:id` | Remove user from platform | Admin |

### 💼 Job Management (`/api/jobs`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/jobs` | Retrieve open jobs with city & category filters | No |
| `POST` | `/api/jobs` | Publish a new project brief with PKR budget | Optional |
| `GET` | `/api/jobs/:id` | Get detailed job view by ID | No |

### 🧑‍💻 Talents & Portfolios (`/api/talents`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/talents` | Filter verified freelancers by rate & city | No |
| `GET` | `/api/talents/:id` | Get single talent profile & gallery | No |
| `POST` | `/api/talents/portfolio` | Add new project case study to portfolio | Bearer Token |

### 📝 Proposals & Escrow Contracts (`/api/proposals` & `/api/contracts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/proposals` | List submitted proposals | No |
| `POST` | `/api/proposals` | Submit project pitch with delivery timeline | Optional |
| `GET` | `/api/contracts` | Fetch all active contracts | No |
| `POST` | `/api/contracts` | Create milestone contract with escrow amount | Optional |
| `PUT` | `/api/contracts/:id/milestone/:mId` | Release individual milestone payment | Optional |

### 💬 Messaging & AI Matcher (`/api/messages` & `/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/messages` | Get direct conversation thread | No |
| `POST` | `/api/messages` | Send a new message | No |
| `PUT` | `/api/messages/read/:senderId` | Mark conversation messages as read | No |
| `POST` | `/api/ai/match` | Run multi-factor candidate match calculation | No |

</details>

---

## 📦 Quality & Production Build

```bash
# Build frontend for production
cd client
npm run build

# Start production server
cd server
npm start
```

---

## 📄 License & Attribution

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with ❤️ for the **Full-Stack MERN / AKTI-NAVTTC** Initiative.
