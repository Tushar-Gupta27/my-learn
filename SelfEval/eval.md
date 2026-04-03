# COMMANDS
```bash
git log --since=2024-09-01 --author='Tushar Gupta <guptatusharhhfs27@gmail.com>' --no-merges --pretty=format:'%h%x09%ad%x09%s' --date=short | cat
git log --since=2024-09-01 --author='Tushar Gupta <guptatusharhhfs27@gmail.com>' --name-only --no-merges --pretty=format:'----%n%h%n%ad%n%s%n%b' --date=short | cat
cd /Users/admin/dev/applinks-backend && echo EMAIL: $(git config --get user.email) && echo NAME: $(git config --get user.name) && echo "--- AUTHORS SINCE 2024-09-01 ---" && git shortlog -sne --since="2024-09-01" | cat && echo "--- COMMITS BY EMAIL SINCE 2024-09-01 ---" && git log --since="2024-09-01" --author="$(git config --get user.email)" --pretty=format:"%H%x09%ad%x09%s" --date=short | cat && echo "--- COMMITS BY NAME SINCE 2024-09-01 ---" && git log --since="2024-09-01" --author="$(git config --get user.name)" --pretty=format:"%H%x09%ad%x09%s" --date=short | cat
```

# PROMPT
```
Use this git repo and filter out my commits from now to last september and summarise them in tasks, bug fixes and other relevant categories
my user name is Tushar Gupta and email is guptatusharhhfs27@gmail.com
```

# RAVENS 

- **Features/Tasks**
  - 2024-10-09 — added new sms template
    - Commit: `8d9a5ea`
    - Files: `constants/sms_templates.go`
    - Notes: Introduces a new SMS template; likely extends available messaging options.
  
# Citymall-services1

## **AI Being Used: Claude Sonnet 4**

## **Summary Statistics**
- **Total Commits**: 500+ commits
- **Time Period**: September 2024 - Present (4+ months)
- **Primary Focus Areas**: Performance optimization, bug fixes, new features, and infrastructure improvements

---

## **📋 TASK CATEGORIES**

### **🔧 Bug Fixes (150+ commits)**
- **Database & Performance Issues**: Multiple fixes for query optimization, memory usage, and database performance
- **API Fixes**: Various endpoint fixes, error handling improvements, and response formatting
- **Frontend Issues**: UI fixes, component updates, and user experience improvements
- **Wallet & Payment System**: Transaction fixes, refund handling, and payment processing bugs
- **RVP (Return Verification Process)**: Multiple fixes for return processing and validation
- **CP (Collection Point) Management**: Various fixes for CP operations and management
- **Job Processing**: Fixes for background jobs, scheduling, and data processing

### **🚀 New Features & Enhancements (100+ commits)**
- **CP Wallet V2**: Complete new wallet system with enhanced features
- **CP Performance V2**: New performance tracking and analytics system
- **DB Tracking System**: New database tracking and monitoring features
- **Dark Store Integration**: New dark store functionality and APIs
- **QR Code Payment System**: New QR-based payment processing
- **Ledger System**: New financial ledger and transaction tracking
- **CP Capacity Management**: New capacity planning and management features
- **Multi-language Support**: Enhanced translation and localization features

### **⚡ Performance Optimizations (80+ commits)**
- **Database Query Optimization**: Multiple query performance improvements
- **Memory Usage Optimization**: Reduced memory footprint and improved efficiency
- **Caching Improvements**: Enhanced caching strategies and implementation
- **API Response Time**: Faster API responses and reduced latency
- **Bulk Operations**: Improved bulk data processing and operations
- **Index Optimization**: Database indexing improvements for faster queries

### **🏗️ Infrastructure & Deployment (60+ commits)**
- **Docker Configuration**: Multiple Dockerfile updates and containerization improvements
- **Jenkins Pipeline**: CI/CD pipeline updates and deployment automation
- **Database Migrations**: SQL migration scripts and schema updates
- **Environment Configuration**: Preprod and production environment setup
- **Service Architecture**: Microservice improvements and service separation
- **Monitoring & Logging**: Enhanced logging and monitoring capabilities

### **�� Code Cleanup & Refactoring (50+ commits)**
- **Code Restructuring**: Major refactoring of existing codebases
- **Dead Code Removal**: Cleanup of unused code and files
- **API Cleanup**: Removal of deprecated APIs and endpoints
- **File Organization**: Better file structure and organization
- **Dependency Updates**: Package updates and dependency management
- **Code Quality**: Improved code readability and maintainability

### **🔒 Security & Compliance (20+ commits)**
- **Error Handling**: Improved error handling and user feedback
- **Input Validation**: Enhanced input validation and sanitization
- **Authentication**: Security improvements for user authentication
- **Data Protection**: Better data handling and privacy measures

### **�� Data & Analytics (30+ commits)**
- **Reporting Improvements**: Enhanced reporting and analytics features
- **Data Processing**: Improved data processing and transformation
- **Snapshot Management**: Better data snapshot and archival systems
- **Widget System**: New dashboard widgets and data visualization

---

## **🎯 Key Achievements**

1. **Major System Overhaul**: Complete rebuild of CP wallet and performance systems
2. **Performance Gains**: Significant performance improvements across multiple systems
3. **New Business Features**: Introduction of dark store, QR payments, and enhanced tracking
4. **Infrastructure Modernization**: Improved deployment and monitoring capabilities
5. **Code Quality**: Substantial code cleanup and refactoring efforts

---

## **📈 Development Patterns**

- **High Activity**: Consistent daily commits showing active development
- **Iterative Approach**: Many commits show iterative improvements and refinements
- **Performance Focus**: Strong emphasis on performance optimization
- **User Experience**: Regular UI/UX improvements and bug fixes
- **System Reliability**: Continuous work on system stability and error handling


# Citymall Services 2
GPT-5

- Features/Tasks:
  - Added DB recon routing to `DbReconV2` and server (`Nov 7`)
  - Added last location marker and UI flows for DB tracking (`Nov 7`)
  - Introduced `clCxItemMarkingV2` datum, `partialDeliveryEnabled`, `isCpVacationEnabled` (`Oct`)
  - Paur/Paud ledger CP changes and visible properties (reason/type) for CPDB lost deductions (`Oct`)
  - Added wallet/CPC interfaces and types (e.g., penalty card details, wallet types, added types in FE) (`Sep–Oct`)
  - Upload flows: `uploadCpRoutes` (created, TTL, unassign, created_at) and `uploadPenalty` row number (`Sep–Oct`)
  - Pre-delivery screen changes and text updates (`Sep`)
  - One-time job: `cpWeeklyDeliveredOrdersArchive` (trigger/date tweaks/stop) (`Sep`)
  - Clubbing refund wallet transactions and new wallet metadata/modal (`Sep`)

- Bug Fixes:
  - Delivery OTP API, widgets API, admin routes, DB tracking admin/UI (submit btn, polyline, geofence, last location) (`Nov`)
  - Translation and error-message fixes (EN/HI, app errors, remove extra errors) (`Oct–Nov`)
  - Close recon/dbName/date/price/cashshort/500 fixes across CL-DB-Manage services and DAOs (`Oct`)
  - Wallet fixes: refund/amount formatting/filters/limit-offset/spelling/CTA/nav/txn details (`Sep–Oct`)
  - CP performance fixes across v1/v2 controllers/DAOs/utils (date keys, cpDbWeeklyPerf, plans query) (`Sep–Oct`)
  - Device verification cleanup, SMS/error handling tweaks (`Sep–Oct`)
  - ES upsert consumer type mapping fix (`Sep`)
  - Reverts and minor fix iterations on FE DB tracking (`Oct`)

- Performance:
  - CP Performance v2: multiple perf/date and query optimizations in DAOs/utils/controllers (`Sep–Oct`)
  - CL homepage widgets perf and NaN guard fixes (`Sep`)
  - Removed extra DB call in `getEnabledCpFeatures` (`Oct`)
  - Setup & perf APIs cleanup for CP performance and widgets (`Oct`)
  - Weekly delivered orders and snapshots flow/perf adjustments (`Sep`)

- Refactor/Cleanup:
  - Removed `dbMarkingTable` usage; restructuring CPDB lost deduction modules (`Nov`, `Oct`)
  - Commented legacy wallet txn code, formatting passes, small cleanups across routes and services (`Oct–Nov`)

- DB/Migrations:
  - CPDB lost deductions schema and related service/DAO updates: `m-tg-db-lost-deductions.sql` (add type/price/schema fixes) (`Oct`)
  - Weekly delivered orders archive migration: `m-tg-cp-weekly-delivered-orders-archive.sql` (`Sep`)

- Infra/Config/CI:
  - Dockerfile fixes (customer-app-apis, partner-apis-preprod), Jenkins preprod values updates (`Sep–Oct`)
  - Force update versioning in `teamLeaders/versions.js` (`Sep–Oct`)

- Notable Thematic Workstreams:
  - CP Performance v2 build-out and stabilization (DAOs, utils, controllers, perf) (`Sep–Oct`)
  - Wallet v2 APIs (summary, transactions, disputes, constants, reader/dao) with extensive fixes and UX text updates (`Sep`)
  - CL-DB-Manage recon/DB lost deductions flows (DAO/service/controller, schema) (`Oct–Nov`)
  - DB Tracking FE and routing (markers, geofence, polylines, admin) (`Nov`)

- Date range:
  - Since 2024-09-01 to latest commit in the log (Nov 2024)

# TL APP

- Features
  - CPCX QR Payment Screen: introduced new payment flow and assets; added expiry mins; integrated APIs (`0a929be8f`, `8fd6f77ad`, `67facb5c1`).
  - Delivery Performance: added cpdbPayout performance and wallet changes; introduced plan modal components (`63f19aa45`).
  - My Deliveries: added “check route” button; input box in route details scan (`5b94a739e`, `0dc6aabc0`).
  - My Tasks: new filters usage; delivery card shows amount (`f1090b750`, `529811429`).
  - Returns: show cards with zero quantity as well (`23e4fcd31`).
  - Preprod build: added action and config changes to support preprod build (`afcba9ab7`).

- Bug fixes and UI fixes
  - Multiple fixes across MyTasks (FilterModal, index, CustomerOrderView) and DeliveryPerformance (headers, variables, PlanModalComponents) (`21c7dd1f5`, `22bdcdadc`, `a6681dc68`, `be09963bc`, `b8f1bacb5`, `9682bcfe9`, `9128c9940`, `75e290eee`, `5f09e76c1`).
  - Sorting Deliveries: several fixes in CrateScanner, index, BottomButton, CustomerCard (`82434098d`, `60552160a`, `afa401bae`, `f85a8b45d`, `88d5dcc32`).
  - RRD OTP: fixes and cleanup across OTP verification screens and API (`dada5244b`, `804ea5e40`, `a61b5f100`, `c009a366c`, `86d7325c6`).
  - Localization text fixes in en/hi packages (`d39c3828c`, `fd5b7388f`, `77dae745a`, `97dae745a`, `dd286a406`).
  - Weekly performance date range bug fixed (`7c1fba5db`).
  - Misc fixes including “sarv fix”, header fix, and general “fixes/changes” (`28226f7c4`, `21c7dd1f5`, `00685bd52`, `fc6fbc595`, `7178a16d3`).

- Chores/Refactors
  - Cleanup in item list and OTP screens; switch to new API (`c009a366c`, `781de10cf`).
  - Ledger/PAUR-PAUD config changes and screens adjustments (`8a34b15a7`).
  - Added CT analytics events (`ee975d463`).

- Areas impacted (high-level)
  - Payments (CPCX QR), Delivery Performance, My Deliveries (sorting/overview/returns), My Tasks, Returns, Wallet v2, RRD OTP, Localization, Build/CI for preprod.


# Applinks
### High-level
- Total commits: 15 (since 2024-09-01)
- Active periods: May 2025 (bulk of work), July 2025 (Kafka switch + follow-up)

### Tasks / Features
- MongoDB → PostgreSQL migration (foundation)
  - Commit: 2025-05-02 “mongoDb to postgres migration”
  - Files: `aggregation_db.js`, `aggregation_db_schema.sql`, `events/aggregation_dao.js`, config updates
- Kafka changeover to CM Kafka
  - Commit: 2025-07-04 “switch to CM Kafka”
  - Files: `kafka/CMKafkaConsumer.js` (+70), `kafka/CMKafkaProducer.js` (+121), wiring in `kafka/index.js`, `eventsProducer.js`, `postBackProducer.js`, configs
- New tracking/capture fields
  - 2025-05-20 “add user_data_ip” (schema + DAO update)
  - 2025-05-20 “add timelogs” (DAO + server touchpoints)

### Bug Fixes / Stabilization
- Generic fixes and follow-ups (DAO/server/web)
  - 2025-05-21 “fix” x2 and “more fixes”
  - 2025-05-21 “read queries” (DAO query shape + server adjustments)
  - 2025-05-07 “fixes”
  - 2025-07-16 “fix” (small Kafka producers/consumers edits)
- Schema alignment
  - 2025-05-14 “change table name”
  - 2025-05-02 “column name fix”

### Removals / Cleanup
- Remove MongoDB and Dashboard frontend
  - 2025-05-21 “remove mongodb from applinks” (large deletion: `dashboard/frontend/**`, `mongodb/**`, related server references)
- Secrets cleanup
  - 2025-05-08 “remove secrets” (config and server-go env/test tidy)

### Config / Infra
- Configuration updates for new services
  - 2025-07-04 config updates for Kafka integration across `config/*.json`
- Deployment/tooling updates
  - 2025-05-21 dashboard Docker/Jenkins scripts removed with frontend removal

### Affected Areas (by frequency)
- Data layer: `events/aggregation_dao.js`, `aggregation_db_schema.sql`
- Messaging: `kafka/CMKafkaConsumer.js`, `kafka/CMKafkaProducer.js`, `kafka/*`
- Web entrypoints: `server/web.js`
- Config/ops: `config/*.json`, deployment scripts


# CPCXCAPACITY

### Categorized summary (since 2024-09-01)

- **Bug fixes**
  - 2025-05-09 — cff305a (fix): `util/util.go`
  - 2025-05-08 — 96cfa53 (fix): `util/util.go`
  - 2025-05-08 — 44d31c6 (fixes): `go.mod`, `go.sum`, `util/util.go`
  - 2025-05-08 — acb7fa4 (fix): `app.env`, `app.test.env`, `go.mod`, `go.sum`, `util/types.go`, `util/util.go`

- **Security/Secrets hygiene**
  - 2025-05-09 — cfcb387 (removed locationiq key): `app.env`, `app.test.env`, `pkg/driving.go`, `util/types.go`, `util/util.go`
  - 2025-05-06 — ed7345a (hide secrets): `cmd/*.go` (adv, advnew, load, map, root, rto, server), `util/types.go`, `util/util.go`

- **Tooling/Config**
  - 2025-05-08 — a2db4b6 (added file in gitignore): `.gitignore`, `util/util.go`

### Notes
- Activity detected from 2025-05-06 to 2025-05-09 for your author identity; no earlier commits under the provided name/email in this repo after 2024-09-01.
- Multiple fixes target `util/util.go`; several commits touch `go.mod`/`go.sum` indicating dependency or build corrections.
- Secrets cleanup removed a LocationIQ key and scrubbed configs/CLI entrypoints.

# ADMIN BACKEND

### Summary by category (2024-09-01 to now)
- **Bug fixes**
  - 2025-03-24 — fixes (`82e0fa6`)
    - File: `packages/admin-ts/src/model/teamLeaderModel.ts`
    - Change: Switched joins/columns from `user_addresses`/`address` to `cp_addresses`/`cp_address_id`, updated selected address fields.
    - Why: Aligns model with CP address schema; fixes incorrect join/fields that could break team leader info retrieval.

- **Security/Configuration**
  - 2025-05-05 — secrets (`c35109d`)
    - Files: `config/default.json`, `config/production.json`
    - Change: Secret-related config adjustments.
    - Why: Tightened handling of secrets in config.

- **Refactor/Cleanup**
  - 2025-05-08 — remove unused keys (`4093b4b`)
    - Files: `config/custom-environment-variables.json`, `config/default.json`, `config/production.json`
    - Change: Removed unused config keys.
    - Why: Config hygiene; reduces confusion and risk from stale settings.

### Commit details
- 4093b4bef09a1fe12b37f34465f1812cf4e9aaae — 2025-05-08 — remove unused keys
  - M: `config/custom-environment-variables.json`, `config/default.json`, `config/production.json`
- c35109d5b45f2029080147e0201043d261ddf77d — 2025-05-05 — secrets
  - M: `config/default.json`, `config/production.json`
- 82e0fa64abf002f5574d2db7d9fce2477d5633e5 — 2025-03-24 — fixes
  - M: `packages/admin-ts/src/model/teamLeaderModel.ts`
  - Diff highlight:
```packages/admin-ts/src/model/teamLeaderModel.ts
-          ua.id AS address_id,
+          cp.id AS address_id,
...
-        (select id,user_id,leader_id,name,phone_number,address,...
+        (select id,user_id,leader_id,name,phone_number,cp_address_id,...
...
-        left join user_addresses ua on ua.id=tl.address 
+        left join cp_addresses cp on cp.id=tl.cp_address_id 
```

# CX APIS GO

1. New features / functional tasks  
• Added `getSarvMode` API/logic for SARV feature set (8c38584c).  
• Introduced SARV CLI number handling changes (6062026f).  
• Modified SARV table-query implementation to support new requirements (dced6e69).  
• UI/UX: hid call-icon element when not applicable (2bd94e79).

2. Bug fixes / corrections  
• General fixes in business logic and handlers (b2176896, 8a5fe4e9, cfa69745, bea7a284, 4844a001).  
• Corrected mis-labelled or inconsistent names in codebase (2f728092).

3. Other noteworthy updates  
• Incremental refactors and clean-ups inside SARV-related modules accompany most of the above commits, improving maintainability and readability.

Totals  
• 10 commits over the period.  
• Primary focus: SARV subsystem enhancements and polishing, plus routine bug-fix maintenance across the service.


# CX APP
```bash
git log --author="Tushar Gupta" --after="2024-09-01" --no-merges --pretty=format:"%h|%ad|%s" --date=short | cat
```

```bash
git log --author="Tushar Gupta" --after="2024-09-01" --no-merges --pretty=format:'%h|%ad|%s' --date=short | cat
```

```bash
git log --author="guptatusharhhfs27@gmail.com" --after="2024-09-01" --no-merges --pretty=format:'%h|%ad|%s' --date=short | cat
```

```bash
git log --author="Tushar Gupta" --since="2024-09-01" --pretty=format:'%h|%ad|%s' --date=short --no-merges | cat
```

```bash
git show --stat 9f80a5d47 | cat
```

```bash
git log --author="Tushar Gupta" --after="2023-09-01" --pretty=format:'%h|%ad|%s' --date=short --no-merges | cat
```

```bash
git log --author="Tushar Gupta" --since="2024-09-01" --pretty=format:'%h|%ad|%s' --date=short --no-merges --reverse | cat
```

```bash
git log --author="Tushar Gupta" --pretty=format:'%h|%ad|%s' --date=short --no-merges | cat
```

```bash
git show --stat 8e1726fc1 | cat
```
```bash
git show --stat 7fb0992af | cat
```

Summary of commits authored by “Tushar Gupta <guptatusharhhfs27@gmail.com>” from 1 September 2024 to today (based on the current repository history).

Time-frame scanned  
• Start date: 01 Sep 2024  
• End date: today (analysis run now)

Commits found: 3  
1. 24 Jul 2025   7fb0992af  “sarv changes”  
2. 25 Jul 2025   8e1726fc1  “added icon”  
3. 25 Jul 2025   9f80a5d47  “fix sarvMode Condition”

Categorised summary

A. New features / tasks
• Click-to-Call for Delivery Partner (Order Tracking)  
  – Introduced API layer (`src/services/api/clickToCall.ts`, added endpoint).  
  – Added `CallDeliveryPartnerButton` UI component and integrated it into timeline screens (`DeliveryTimeline/View/TimeLineItem/...`).  
  – Updated order-tracking interfaces to support new call fields.  
  – Themed colours/constants updated (`src/constants/color.js`).  
  (Commit 7fb0992af, 116 insertions)

• Icon & UI polish for Call-to-Partner feature  
  – Added dedicated icon and adjusted constant values (`src/constants/otherConstants.ts`).  
  – Minor alignment/touch-target tweaks in `CallDeliveryPartnerButton.tsx`.  
  (Commit 8e1726fc1, 9 insertions / 16 deletions)

B. Bug fixes
• Fixed incorrect evaluation of `sarvMode` condition in delivery-timeline info card  
  – Corrected boolean logic in `TimelineInfo/InfoCard.tsx`.  
  (Commit 9f80a5d47, 1 insert / 1 delete)

C. Misc / housekeeping
• Minor colour tweaks and small refactors bundled with the feature work (part of commit 7fb0992af).

Totals for the period  
• Files touched: ≈ 12  
• Net additions: ~ 126 lines added, 51 removed  
• Breakdown: 2 feature/task commits, 1 bug-fix commit

No other commits by this author were present in the repository after 1 Sep 2024.

# WMS

### High-level summary
- Total commits: 34
- Timeframe: 2025-07-01 → 2025-09-03

### Categorized summary
- Features/Tasks (12)
  - Added onboarding page and approvals flow (frontend + server + migration) [2025-07-01]
  - Added onboarding job (consumer) [2025-07-01]
  - Accept PDF uploads; renamed bucket [2025-07-02]
  - Added config keys/env wiring [2025-07-02]
  - Training admins handling [2025-07-04]
  - Disallow reject from approved [2025-07-07]
  - Added email field in onboarding [2025-07-09]
  - Added bank-related details end-to-end (frontend, server, consumer, migration) [2025-07-10]
  - File-size limit (frontend + server) [2025-07-14]
  - Enable onboarding API [2025-07-25]
  - Image format handling [2025-08-26]
  - Enable onboarding on every warehouse [2025-09-03]

- Bug fixes/Polish (14)
  - Multiple UI fixes to onboarding page (keys, small fixes) [2025-07-03]
  - ApproveOnboardingKyc job fixes and table name updates [2025-07-03]
  - Router/DAO/controller fixes [2025-07-02 → 2025-07-04]
  - Query fix in DAO [2025-07-07]
  - Training admin definition fix [2025-07-07]
  - One-line server controller fix [2025-07-11]
  - Filesize handling tidy-ups [2025-07-14]
  - Misc polish on onboarding flows [2025-07-03 → 2025-07-04]
  - Image format fixes [2025-08-26]

- Backend/API (11)
  - Created onboarding `controller`, `dao`, `router`, `index`, `middlewares` [2025-07-01 → 2025-07-14]
  - Added email, bank KYC, training admins logic [2025-07-04 → 2025-07-10]
  - Enabled onboarding API and broader warehouse enablement [2025-07-25, 2025-09-03]

- Frontend/UI (12)
  - `onboarding.js`, `approve-onboarding.js` pages (initial + iterations) [2025-07-01 → 2025-07-14]
  - Layout/ProtectRoute/SideNav updates for onboarding [2025-07-01 → 2025-07-02]
  - Disallow transitions from approved to rejected [2025-07-07]
  - Image format and key fixes [2025-07-03, 2025-08-26]

- Consumer/Jobs (7)
  - Added `approveOnboardingKyc` job (and repeated fixes) [2025-07-01 → 2025-07-04]
  - `sync-admin-users` tweaks [2025-07-02]
  - `storageService` adjustments for onboarding assets [2025-07-01 → 2025-07-02]

- Config/Infra (5)
  - `default.json`, `production.json`, `custom-environment-variables.json` updates for onboarding [2025-07-02]
  - Config changes for table/bucket names [2025-07-03]

- Schema/Migrations (6)
  - `schema/migrations/onboarding-kyc.sql` created/updated (KYC fields, table names, fixes) [2025-07-01 → 2025-07-10]

- Automated/Co-authored (2)
  - GitHub Actions automated updates to `wms-frontend/src/pages/onboarding.js` [2025-07-09]

### By month
- 2025-09: 1 (enable onboarding on every warehouse)
- 2025-08: 1 (image format fixes)
- 2025-07: 32 (initial onboarding feature, API, job, schema, and numerous fixes)