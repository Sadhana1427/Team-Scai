# Team SCAI — Event Management & Showcase Portal

A high-performance, full-stack **Event Management and Event Showcase Portal** built for student communities, technical organizations, and collegiate hackathons.

---

## 🚀 Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
* **Language**: TypeScript
* **Database & ORM**: Supabase PostgreSQL + [Prisma ORM](https://www.prisma.io/)
* **Media & File Storage**: Supabase Storage
* **Styling**: Tailwind CSS & custom design system following `UI.md` (Strict Light Theme Only)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Validation**: Zod & React Hook Form
* **Authentication & RBAC**: JWT Sessions with bcrypt password hashing

---

## 🏛️ System Architecture

### 1. Public Portal (No Login Required)
* **Home (`/`)**: Hero carousel, ongoing live competitions, upcoming schedule, archive preview, recent photos, winners spotlight, team highlights, and contact CTA.
* **Events (`/events`)**: Searchable archive with filters by Category, Topic Tags, Status (Upcoming, Ongoing, Past), and Year.
* **Event Details (`/events/[slug]`)**: High-resolution poster, countdown timer for deadlines, venue/schedule, rich editorial overview, downloadable official documents, winner podiums, photo streams, and social sharing (WhatsApp, Copy Link, WebShare API).
* **Gallery (`/gallery`)**: Masonry grid with category tabs (All, Events, Winners, Team), year filters, and fullscreen responsive lightbox.
* **Winners (`/winners`)**: Hall of Fame highlighting project achievements and podium finishes (1st, 2nd, 3rd, Runner Up).
* **Organizing Team (`/team`)**: Departmental breakdown (Core Leadership, Technical, Operations, Social Media).
* **About (`/about`)**: Organization mission, pillars of innovation, and verified metrics.
* **Contact (`/contact`)**: Dynamic contact details and interactive inquiry form.

### 2. Management Workspace (Role-Based Access Control)
* **Login (`/login`)**: Secure staff authentication (No public registration).
* **Dashboard Overview (`/dashboard`)**: KPI cards, live stats, quick actions, and recent activity feeds.
* **Event Management (`/dashboard/events`)**: Event CRUD, instant status switching (UPCOMING ↔ ONGOING ↔ PAST), poster uploads, and registration links.
* **Gallery Media (`/dashboard/gallery`)**: Single/bulk uploads, event linking, year/category tagging, and featured spotlights.
* **Winner Management (`/dashboard/winners`)**: Podium position assignments, photo uploads, and project descriptions.
* **Organizing Team (`/dashboard/team`)**: Super Admin member management, designations, and department categorization.
* **Hero Carousel (`/dashboard/carousel`)**: Super Admin banner management, headlines, and CTA links.
* **User Accounts (`/dashboard/users`)**: Super Admin staff creation with auto-generated human-readable IDs (`EVT-0001`, `EVT-0002`), role assignments, and password resets.
* **Audit Trail (`/dashboard/audit`)**: Super Admin immutable logs of all operational actions and updates.
* **Site Settings (`/dashboard/settings`)**: Super Admin management of branding, official emails, social channels, and footer text.
* **Internal Notifications (`/dashboard/notifications`)**: Staff alert feed on event changes and media uploads.

---

## 🔑 Roles & Permissions Matrix

| Role | Events | Gallery Media | Winners | Team & Carousel | User Accounts | Audit Logs | Site Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **SUPER_ADMIN** | Full (All) | Full | Full | Full | Full | Full | Full |
| **EVENT_LEADER** | Assigned Only | Assigned Only | Assigned Only | ❌ | ❌ | ❌ | ❌ |
| **MANAGEMENT** | Edit Schedule/Venue | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SOCIAL_MEDIA** | ❌ | Full Upload/Curate | Full Upload | ❌ | ❌ | ❌ | ❌ |

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Database: Supabase PostgreSQL Connection String
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Storage & Client
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Authentication
JWT_SECRET="your-secure-jwt-secret-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📦 Supabase Storage Setup

In your Supabase project dashboard, create the following **Public Storage Buckets**:

1. `event-posters` (Event main posters & banners)
2. `event-images` (Gallery photographs & live event photos)
3. `winner-images` (Podium winner & team photographs)
4. `team-images` (Organizing committee avatars)
5. `carousel-images` (Homepage hero slideshow banners)
6. `event-documents` (Downloadable rules, schedules, guidelines, results)

Set bucket policies to **Public** for read access so visitors can view media and download documents.

---

## 🛠️ Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Push Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Initial Demo & Administrative Data
```bash
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to view the public website or `http://localhost:3000/login` to access the staff workspace.

---

## 🛡️ Authentication & Staff Access

* **Access Control**: Role-Based Access Control (RBAC) supporting `SUPER_ADMIN`, `EVENT_LEADER`, `MANAGEMENT`, and `SOCIAL_MEDIA`.
* **No Public Signup**: Management accounts are provisioned and assigned by the Super Admin in the `/dashboard/users` management workspace.
* **Account IDs**: System-generated human-readable account identifiers (`EVT-XXXX`, `LEAD-XXXX`, `MGMT-XXXX`, `MEDIA-XXXX`).

### 🔑 Password Reset Options:
1. **Self-Service on Login Page**: Click **"Forgot / Reset Password?"** and provide the registered Email and Account ID.
2. **Inside Dashboard**: Click **"Reset Password"** in the top navigation bar from any role.
3. **Super Admin Management**: Super Admin can reset or generate passwords directly in the User Management view.

---

## 🏗️ Production Build Command

```bash
npm run build
```

To run the production server:
```bash
npm start
```
