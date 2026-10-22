# 🚜 Tractor Record (Rural Machinery Rental Management App)

A vernacular, voice-enabled fleet manager, digital register, and smart accounting platform tailored for rural machinery owners renting out tractors, JCBs, and heavy agricultural equipment.

---

## 📌 Problem Statement

Business owners in villages and small towns who rent out tractors, JCBs, and heavy agricultural machinery still maintain their daily work and accounts manually in paper registers. 

### Key Pain Points:
* **Complex Multi-Implement Billing:** A single farmer often needs several implements (cultivator, rotavator, seed drill, super-seeder, laser land leveler, trolley), each billed under different units: per hour, per acre, per bigha, or per trip. JCBs require continuous hour-meter tracking.
* **Driver & Operator Dependency:** Most owners do not operate machines themselves. Without automated logging, getting accurate meter readings, start/stop times, or tracking driver daily allowances (bhatta) is difficult.
* **Diesel Theft & Unmonitored Fuel:** Fuel leakage and unmonitored consumption eat directly into operating margins.
* **Credit-Heavy Market & Extended Cycles:** Credit is customary in rural crop cycles. Partial payments and advances are frequent, often remaining unreconciled until the end of the season.
* **Manual Record-Keeping Overhead:** Evening ledger entries after exhausting fieldwork lead to calculation errors, missed entries, rate disputes with customers, and unreconciled maintenance costs.

---

## 💡 Proposed Solution

A digital register, fleet management, and accounting mobile app tailored specifically for rural operations:

### 1. Voice & Vernacular Accessibility
* **Multilingual & Dialect Support:** Record jobs effortlessly using voice in Hindi and regional dialects (Bundelkhandi, Malwi, Bhojpuri, Marathi, Punjabi, etc.).
* **Voice Queries & Audio Responses:** Voice-enabled queries like *"How much does Ramesh owe me?"* with instant spoken and visual summaries.
* **Photo-based OCR:** Scan and digitize physical register pages, paper receipts, and diesel pump slips.

### 2. Driver Log Mode & Anti-Tamper Tracking
* **GPS & Time-Stamped Meter Photos:** Drivers record start and stop meter readings with photo proof without having visibility into owner financial ledgers.
* **Operational Audits:** Flags idle time, overtime, and off-boundary work.
* **Driver Ledger:** Tracks driver attendance, daily allowance, advances, and monthly salary slips.
* **Role-Based Security:** Separate permission levels for Owner, Munshi (Accountant), and Driver.

### 3. Smart Accounting & Farmer Credit Ledger (Khata)
* **Custom Customer Ledgers:** Automated calculation of hours worked, bill generation, advances, and outstanding balances.
* **Farmer Trust Score & Credit Limits:** Credit risk warnings before booking further jobs on high credit.
* **Instant Digital Bills & WhatsApp Receipts:** Share instant branded bills with embedded QR code payment links upon job completion, plus season-end statements.
* **Automated Mandi-Cycle Reminders:** Payment follow-ups scheduled around crop harvest and local mandi days via WhatsApp and automated IVR voice calls.
* **Flexible Payments:** Support for installments, optional interest calculations, and barter payments (in grain or fodder) valued at fair market rate.

### 4. Fleet Health, Fuel & Maintenance
* **Diesel Monitoring & Theft Detection:** Compare pump slips against meter logs to calculate hourly fuel efficiency and alert on abnormal mileage.
* **Preventive Servicing & Life Tracking:** Automated service reminders based on hour-meters, tracking tyre and implement wear.
* **Document Vault:** Safe digital storage with expiry alerts for RC, insurance, PUC, and fitness certificates.
* **Real Profitability Dashboards:** Granular machine-wise, implement-wise, and customer-wise profit & loss breakdowns exportable as PDF for bank loan eligibility.

### 5. Offline-First Architecture
* Works completely offline in low/no connectivity rural areas with automatic background synchronization once internet access is restored.

---

## 📂 Repository Contents

* `rural_machinery_app_problem_and_solution.pdf` — Complete problem definition and product solution specification document.
* `README.md` — Project overview and functional roadmap.
