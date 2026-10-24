# 🚜 Tractor Record (Rural Fleet & Khata Management)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.js.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/Language-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A4%8 need-orange)](#-vernacular--multilingual-support)

A modern, vernacular, voice-enabled fleet management and digital khata (ledger) accounting web application tailored specifically for rural machinery owners renting out tractors, JCBs, combine harvesters, and heavy agricultural equipment.

---

## 📌 Problem & Vision

In rural India and small farming hubs, machinery rental businesses face critical operational challenges:
* **Complex Multi-Implement Billing:** Implements (cultivator, rotavator, super-seeder, laser land leveler, trolley) are billed under different metrics (per hour, per acre, per bigha, or per trip).
* **Driver Accountability:** Owners rarely operate machines themselves. Without automated tracking, meter readings, start/stop hours, and daily driver allowances (bhatta) are prone to disputes.
* **Diesel Theft & Leakage:** Unmonitored fuel consumption directly erodes operating profit margins.
* **Extended Credit Cycles:** Farmers customarily pay post-harvest. Manual paper registers lead to forgotten balances, billing disputes, and unreconciled advances.

**Tractor Record** transforms paper registers into a smart, role-gated digital platform that works seamlessly online with **Supabase Cloud DB** as well as offline in low-connectivity rural belts.

---

## ✨ Key Features

### 🔐 1. Mandatory Authentication Gate
* **Entry Gate:** Users must sign in or register before entering the application dashboard.
* **Sign In & Sign Up:** Email and password authentication powered by Supabase Auth with local session management.
* **1-Click Demo Profiles:** Instant testing without typing credentials:
  * 👑 **Surinder Thakur** (Farm & Fleet Owner)
  * 📋 **Radhe Shyam** (Accountant / Munshi)
  * 🚜 **Sukhwinder Singh** (Machine Driver / Operator)

### 👥 2. Role-Based Access & Settings Switcher
* **Clean Navbar:** Top navigation bar is kept clutter-free with user avatar, database live status, language toggle, and dedicated **Settings (⚙️)** button.
* **Settings Modal:** Switch roles on the fly directly inside Settings:
  * **Owner Mode:** Full financial ledgers, farmer khata, diesel audit, and bank P&L.
  * **Accountant (Munshi) Mode:** Daily field job entries, fuel slips, and billing receipts.
  * **Driver Mode:** Streamlined, anti-tamper interface focused solely on meter readings, machine selection, and job submission (financial figures hidden).

### 📒 3. Farmer Khata & Outstanding Receivables
* **Customer Ledgers:** Instant calculations of hours worked, payments received, and outstanding credit balances.
* **Farmer Trust Score:** Dynamic 1–100 credit risk scores with badges (*Gold*, *Standard*, *High Risk*) to prevent unrecoverable debts.
* **WhatsApp Receipts:** Generate branded digital invoices with embedded UPI QR payment codes to share directly via WhatsApp.

### 🚜 4. Machinery Health & Management
* **Fleet Monitoring:** Track tractors, JCBs, and harvesters with live status (*Active*, *Idle*, *In Service*).
* **+ Add Machine Modal:** Register new tractors and implements with registration number, brand, model, hourly rate, and initial meter reading with Supabase cloud persistence.
* **Document Vault:** Proactive reminders for registration certificate (RC), insurance, and fitness certificate expiries.

### ⛽ 5. Diesel Audit & Fuel Slip Logger
* **Fuel Consumption Tracking:** Log diesel pump slips with pump meter photo proofs, quantity (litres), and cost.
* **Anomaly Detection:** Flags suspicious discrepancies between engine hour increases and fuel consumption rates.

### 🎙️ 6. Voice AI & Vernacular Bilingual Support
* **Bilingual Toggle:** Full localization in **English** and **Hindi (हिंदी)**. Text adapts dynamically without page reload.
* **Voice Assistant:** Record field operations and query account summaries using natural voice queries.

### 🏦 7. Bank P&L & Financial Reports
* Comprehensive breakdown of revenue, diesel expenditure, driver salaries, and net profit.
* Pre-formatted reports designed for submission to banks for agricultural machinery loan applications.

---

## 🛠️ Tech Stack

* **Frontend Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **UI Library:** [React 18](https://react.dev/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Styling:** Vanilla CSS with custom modern design system (responsive mobile-frame & expanded desktop mode)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Row Level Security)
* **State & Localization:** Custom React Contexts (`AuthContext`, `LanguageContext`)

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js** (v18.17.0 or higher recommended)
* **npm** or **yarn**
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/vishesh-i-tech/TRACTOR-RECORD-.git
cd TRACTOR-RECORD-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials (optional for demo/mock mode, required for live cloud sync):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** The application includes a built-in mock dataset and an in-app Supabase configuration modal. You can run the app immediately in local demo mode without setting up Supabase right away!

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup (Optional)

If you wish to connect to a live Supabase backend:

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Copy and run the SQL script located in [`supabase_schema.sql`](./supabase_schema.sql).
4. Copy your project **URL** and **Anon Key** from Project Settings > API and paste them in `.env.local` or directly through the in-app Supabase modal (`Live Supabase DB` pill in the header).

---

## 📁 Project Structure

```
TRACTOR-RECORD-/
├── src/
│   ├── app/
│   │   ├── globals.css         # Global design tokens, theme styles, animations
│   │   ├── layout.jsx          # Root layout with Language & Auth providers
│   │   └── page.jsx            # Main dashboard controller with view gating
│   ├── components/
│   │   ├── AddDieselModal.jsx      # Modal for logging fuel slips
│   │   ├── AddJobModal.jsx         # Modal for recording fieldwork & rates
│   │   ├── AddMachineModal.jsx     # Modal for adding machinery to fleet
│   │   ├── AuthModal.jsx           # Settings & Role Switcher modal
│   │   ├── AuthView.jsx            # Mandatory initial authentication gate
│   │   ├── BankReportModal.jsx     # Financial P&L and bank export modal
│   │   ├── CustomerKhataModal.jsx  # Farmer credit ledger details
│   │   ├── DriverModeView.jsx      # Specialized driver console
│   │   ├── FleetHealthView.jsx     # Fleet management & machine cards
│   │   ├── Navbar.jsx              # Header with profile, settings, logout
│   │   ├── SupabaseConfigModal.jsx # In-app Supabase connection manager
│   │   ├── VoiceAssistantModal.jsx # Voice AI recording modal
│   │   └── WhatsAppInvoiceModal.jsx# WhatsApp invoice & QR payment modal
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication, demo roles & Supabase auth
│   │   └── LanguageContext.jsx     # Multilingual English/Hindi localization
│   ├── data/
│   │   └── mockData.js             # Initial machines, drivers, khata & dictionary
│   └── lib/
│       ├── dbService.js            # Supabase CRUD operations & fallback handlers
│       └── supabaseClient.js       # Supabase JS client initializer
├── public/                         # Static assets
├── supabase_schema.sql             # SQL schema for PostgreSQL tables
├── rural_machinery_app_problem_and_solution.pdf # Comprehensive product spec document
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Project dependencies & scripts
└── README.md                       # Project documentation
```

---

## 📱 Role-Based Views

| Role | Access Level | Primary Use Case |
| :--- | :--- | :--- |
| 👑 **Farm Owner** | Full Access | Financial khata, receivables, fleet health, diesel audit, banking reports. |
| 📋 **Accountant (Munshi)** | Operational & Billing | Recording field jobs, diesel slips, customer khata, WhatsApp invoices. |
| 🚜 **Driver (Operator)** | Field Operations Only | Start/stop meter readings, machine hours, photo logs (financials hidden). |

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!
Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
