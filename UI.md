# UI Design System & Visual Specification (UI.md)

This document is the permanent visual contract for the **Team SCAI Event Management & Showcase Portal**. All public and administrative interfaces strictly adhere to these guidelines.

---

## 1. Core Visual Philosophy
* **Aesthetic**: Modern, clean, warm, photography-focused, university / student organization prestige.
* **Theme Mode**: **Strictly Light Theme Only**. No dark mode or theme switching.
* **Feel**: Human-crafted, approachable yet authoritative, editorial, high readability.
* **Prohibited Visual Patterns**:
  - ❌ No dark mode / black backgrounds
  - ❌ No neon or cyberpunk glows
  - ❌ No glassmorphism, background blurs, or heavy transparency effects
  - ❌ No excessive gradient backgrounds or rainbow fills
  - ❌ No generic floating bubble / blob decorations
  - ❌ No AI-template look; content and real photography take center stage

---

## 2. Color Palette & Design Tokens

### Primary Brand
* **Brand 50**: `#EEF2FF` (Subtle active tint)
* **Brand 100**: `#E0E7FF` (Badge background)
* **Brand 500**: `#4F46E5` (Interactive focus)
* **Brand 600**: `#4338CA` (Hover state)
* **Brand 700 / Primary**: `#3730A3` (Primary buttons, brand headings, hero accents)
* **Brand 900**: `#1E1B4B` (Deep navy for high-contrast titles)

### Accent & Feedback
* **Warm Accent**: `#D97706` (Amber 600 for spotlights, winner badges, awards)
* **Success**: `#16A34A` (Green 600 - Ongoing events, approved statuses)
* **Warning**: `#D97706` (Amber 600 - Upcoming registration deadlines)
* **Danger**: `#DC2626` (Red 600 - Closed events, destructive actions)

### Surfaces & Neutrals
* **Page Background**: `#F8FAFC` (Warm slate off-white)
* **Card / Modal Surface**: `#FFFFFF` (Crisp pure white)
* **Secondary Surface**: `#F1F5F9` (Muted panels, table headers)
* **Border Default**: `#E2E8F0` (Subtle clean border)
* **Border Strong**: `#CBD5E1` (Input boundaries, focused cards)
* **Text Primary**: `#0F172A` (Slate 900 / Charcoal)
* **Text Muted**: `#475569` (Slate 600 / Subheadings & body)
* **Text Light**: `#64748B` (Slate 500 / Meta, timestamps, captions)

---

## 3. Typography Scale
* **Display (Hero Titles)**: 2.25rem - 3.25rem (36px - 52px), weight 800, leading 1.15, tracking tight.
* **Heading 1 (H1 - Section titles)**: 1.875rem - 2.25rem (30px - 36px), weight 700, leading 1.25.
* **Heading 2 (H2 - Card & Subheaders)**: 1.25rem - 1.5rem (20px - 24px), weight 600, leading 1.35.
* **Heading 3 (H3 - Module titles)**: 1.125rem (18px), weight 600, leading 1.4.
* **Body**: 1rem (16px), weight 400/500, leading 1.6, text `#334155`.
* **Small**: 0.875rem (14px), weight 500, leading 1.5.
* **Caption / Meta**: 0.75rem (12px), weight 600, tracking wide, uppercase.

---

## 4. Elevation & Shadows
* **Shadow Subtle**: `0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)`
* **Shadow Card**: `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`
* **Shadow Card Hover**: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)`
* **Shadow Dropdown / Modal**: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)`

---

## 5. Spacing Scale & Container Hierarchy
* **Container Max Width**: `max-w-7xl` (1280px) centered with responsive padding (`px-4 sm:px-6 lg:px-8`).
* **Section Vertical Spacing**: `py-12 md:py-20` (Public pages) / `p-6 md:p-8` (Dashboard).
* **Card Internal Padding**: `p-5 md:p-6`.
* **Form Field Gap**: `space-y-4` or `gap-4`.
* **Radius**: `rounded-lg` (8px) for buttons & cards, `rounded-xl` (12px) for main hero & modals, `rounded-full` for badges.

---

## 6. Public Experience Components
* **Navbar**: Sticky white with border-b, logo + branding on left, desktop links centered/right, clear mobile drawer navigation.
* **Hero Carousel**: High-impact editorial photography showcase with clean headline overlay, descriptive tag, and CTA link. Auto-rotates smoothly with pause-on-hover and arrow/dot controls.
* **Ongoing Events**: Highlighted with live green indicator badge, dynamic countdown / venue pill, direct registration CTA.
* **Upcoming Events**: Date-first layout, category pills, registration deadline countdown warning if nearing.
* **Past Events**: Archive view with winners & event gallery shortcuts.
* **Event Detail**: Editorial page with hero poster, key metadata grid (Date, Time, Venue, Leader, Category), rich description, downloads drawer, winner spotlights, photo stream, and one-tap social share (WhatsApp, Copy Link, WebShare).
* **Gallery**: Masonry/grid layout with category filters (Events, Winners, Team), year selection, bulk preview, responsive image loading, and lightbox modal.
* **Winners Showcase**: Podium badges (1st, 2nd, 3rd, Runner Up, Special Mention), avatar photos, project summaries.
* **Organizing Team**: Department/category segmentation (Core Team, Event Ops, Social Media, Technical), role titles, bios, and LinkedIn/social links.
* **About & Contact**: Official contact cards, interactive feedback/inquiry form, interactive social hub, and university accreditation notes.

---

## 7. Management System (Admin & Staff)
* **Layout**: Left collapsible sidebar with role-aware navigation links + top navigation bar with user profile, human-readable ID (`EVT-XXXX`), and internal notification center.
* **Role Visibility**:
  - `SUPER_ADMIN`: All permissions (Users, Audit Logs, Settings, Events, Gallery, Winners, Team, Carousel, Notifications).
  - `EVENT_LEADER`: Manage assigned events, winners, event media & documents.
  - `MANAGEMENT`: Event schedule, descriptions, venue, registration links.
  - `SOCIAL_MEDIA`: Bulk upload photos, assign to events, manage gallery & winner media.
* **Tables**: Clean striped/bordered tables with search, status filters, bulk actions, and mobile card transformation.
* **Audit Trail**: Tabular viewer with user, action, entity, JSON diff viewer, and timestamp.

---

## 8. Responsive Breakpoints & Device Support
* **Mobile (< 640px)**: Single column cards, full-width touch buttons, bottom sheet / drawer filters, swipeable galleries.
* **Tablet (640px - 1023px)**: 2-column event grid, compact table view, collapsible dashboard navigation.
* **Desktop (1024px+)**: 3-column event grid, expansive dashboard tables, split-screen management forms.
