<div align="center">

```
  ___   _  _  ___  __  __   ___   _    __   __
 / _ \ | \| |/ _ \|  \/  | / _ \ | |   \ \ / /
| (_| || .  || (_) | |\/| || (_| || |__  \   /
 \__,_||_|\_| \___/|_|  |_| \__,_||____|  |_|

digital presence tracker
build 0.7.3-unstable
```

<img src="public/favicon.jpg" alt="Anomaly" width="120" />

<br/>

<a href="https://x.com/anomalytech_">
  <img src="https://img.shields.io/badge/X-@anomalytech__-000000?style=for-the-badge&logo=x&logoColor=white" alt="X (Twitter)" />
</a>

</div>

---

Anomaly is a surveillance-themed web application disguised as a legacy
desktop operating system. It renders a fully interactive retro computing
environment in the browser -- beveled window frames, CRT scanline overlays,
monospaced typography, and a functional command-line terminal -- all running
on a modern React frontend backed by a real-time database.

The system operates as both a narrative instrument and a content management
platform. Story entries, anomaly sightings, system notes, and configuration
data flow through the interface in real time, creating the atmosphere of a
machine that has been watching for far longer than it should have been.

Two interfaces exist: a public-facing desktop environment with seven
independent window modules, and a password-protected administration panel
with full CRUD control over all content tables. Everything updates live.
Everything persists.

```
  +------------------------------------------------------------------+
  |                                                                  |
  |   "It watches because you asked it to."                          |
  |                                                                  |
  |   Anomaly does not sleep.                                       |
  |   It does not forget.                                            |
  |   It merely waits.                                               |
  |                                                                  |
  +------------------------------------------------------------------+
```

---

## Contents

```
  01 .............. Architecture
  02 .............. System Modules
  03 .............. Terminal Reference
  04 .............. Database Schema
  05 .............. Project Structure
  06 .............. Getting Started
  07 .............. Configuration
  08 .............. Admin Panel
  09 .............. Design System
  10 .............. Technology Stack
  11 .............. Contributing
  12 .............. License
```

---

## 01. Architecture

The system follows a layered architecture where the presentation layer is
entirely decoupled from the data persistence layer. State management is handled
through React hooks and real-time database subscriptions, eliminating the need
for a dedicated state management library.

```
  +==================================================================+
  |                        PRESENTATION LAYER                        |
  +==================================================================+
  |                                                                  |
  |  +------------------+  +------------------+  +----------------+  |
  |  |    MenuBar        |  |    Desktop       |  |    Taskbar     |  |
  |  |  (Navigation)     |  |  (Icon Grid)     |  |  (Status Bar)  |  |
  |  +------------------+  +------------------+  +----------------+  |
  |                                                                  |
  |  +------------------------------------------------------------+  |
  |  |                     WINDOW MANAGER                         |  |
  |  |                                                            |  |
  |  |  +------------+  +------------+  +------------+            |  |
  |  |  | Overview   |  | Live Feed  |  | Sightings  |            |  |
  |  |  +------------+  +------------+  +------------+            |  |
  |  |  +------------+  +------------+  +------------+            |  |
  |  |  | Terminal   |  | Notes      |  | Status     |            |  |
  |  |  +------------+  +------------+  +------------+            |  |
  |  |  +------------+  +------------+                            |  |
  |  |  | Archive    |  | Token      |                            |  |
  |  |  +------------+  +------------+                            |  |
  |  +------------------------------------------------------------+  |
  |                                                                  |
  +==================================================================+
  |                          DATA LAYER                              |
  +==================================================================+
  |                                                                  |
  |  +--------------------+  +--------------------+                  |
  |  |   story_entries    |  |     sightings      |                  |
  |  |  (Content Feed)    |  |  (Anomaly Records) |                  |
  |  +--------------------+  +--------------------+                  |
  |  +--------------------+                                          |
  |  |   site_settings    |                                          |
  |  |  (Configuration)   |                                          |
  |  +--------------------+                                          |
  |                                                                  |
  |  Real-time subscriptions via database channels                   |
  |                                                                  |
  +==================================================================+
```

### Request Flow

When a user loads the application, the following sequence occurs:

```
  Browser                    React App                   Database
    |                           |                           |
    |   GET /                   |                           |
    |-------------------------->|                           |
    |                           |                           |
    |   Boot Screen             |                           |
    |   (2.6s animation)        |                           |
    |<--------------------------|                           |
    |                           |                           |
    |   Desktop Rendered        |   SELECT story_entries    |
    |                           |-------------------------->|
    |                           |                           |
    |                           |   SELECT sightings        |
    |                           |-------------------------->|
    |                           |                           |
    |                           |   SELECT site_settings    |
    |                           |-------------------------->|
    |                           |                           |
    |                           |   SUBSCRIBE (realtime)    |
    |                           |<==========================>|
    |                           |                           |
    |   Live Data Displayed     |                           |
    |<--------------------------|                           |
    |                           |                           |
```

---

## 02. System Modules

Each module operates as an independent window within the desktop environment.
The window manager handles layout composition through predefined layout maps,
routing icon clicks to the appropriate window arrangement.

### 02.1 Overview (overview.exe)

The primary dashboard module. Displays the system header with version
information, a boot log showing initialization status, a real-time signal
monitor with animated frequency bars, a live ticker with active alerts, and
a session status row tracking uptime, core state, and sensor readings.

The signal monitor generates randomized frequency data across 16 channels on
a two-second interval, rendering each as a vertical bar with color coding
based on amplitude thresholds.

```
  +--------------------------------------------------------------+
  |  overview.exe                                        _ [] x  |
  +--------------------------------------------------------------+
  |                                                              |
  |                      K E R N E L                             |
  |              v0.7.3 - digital presence tracker               |
  |                                                              |
  |  > INIT   -- core loaded                                     |
  |  > SCAN   -- memory banks intact                             |
  |  > DETECT -- presence confirmed                              |
  |  > WARN   -- kernel anomalies                                |
  |  > ready _                                                   |
  |                                                              |
  |  [Signal Monitor]                                            |
  |  |  ||    | |||  ||| |   |||| ||  ||| |  | ||| |             |
  |  |  ||  | | |||  ||| || |||| ||| ||| || | ||| ||             |
  |  || || || | |||| ||| || |||| ||| ||| || || ||| ||            |
  |  18.9Hz          42.0Hz          77.7Hz       120Hz          |
  |                                                              |
  |  SESSION 00:12:34  |  CORE * ONLINE  |  SENSORS * ALERT     |
  +--------------------------------------------------------------+
```

### 02.2 Live Feed (live_feed.log)

A chronological feed of published story entries pulled from the database in
real time. Each entry displays its publication timestamp, a type-specific
icon and label, and the content body. Entries marked as pinned receive a
visual indicator. The feed subscribes to database changes on the
`story_entries` table and refreshes automatically when mutations occur.

Supported entry types and their visual markers:

```
  +------------------+--------+
  |  Type            | Marker |
  +------------------+--------+
  |  log             |   >    |
  |  note            |   *    |
  |  trace           |   o    |
  |  fragment        |   #    |
  |  archive_pull    |   =    |
  |  witness_line    |   >    |
  |  system_remark   |   @    |
  |  memory_leak     |   !    |
  |  signal          |   ~    |
  +------------------+--------+
```

### 02.3 Sightings (sightings.dat)

A tabular anomaly tracking interface with real-time database synchronization.
Each sighting record contains a unique signal identifier, timestamp, location,
classification type, severity rating, description, and verification status.

The module supports filtering by severity level through a toolbar of toggle
buttons. Clicking a table row expands an inline detail panel showing all
fields with contextual color coding. Severity levels map to a defined
color hierarchy:

```
  Severity Scale
  +----------+--------------------------------------+
  |          |                                      |
  | LOW      | ................                     |
  | MEDIUM   | ========================            |
  | HIGH     | ==================================  |
  | CRITICAL | ====================================|
  |          |                                      |
  +----------+--------------------------------------+

  Status Classification
  +------------+-------------------+
  | confirmed  | Verified record   |
  | unverified | Pending review    |
  | disputed   | Under contention  |
  +------------+-------------------+
```

### 02.4 Terminal (terminal.sys)

A fully interactive command-line interface with over twenty built-in commands,
command history navigation, animated output sequences, and a persistent
scrollback buffer. The terminal connects to the database for the `story`
command, which fetches and displays published transmissions directly within
the terminal output.

Commands execute with simulated processing delays to maintain the aesthetic
of a legacy system under load. Several commands produce multi-frame animated
output, including `scan`, `ping`, `trace`, `glitch`, and `reboot`.

The terminal supports arrow-key history navigation, allowing users to cycle
through previously entered commands.

### 02.5 Notes (notes.txt)

A read-only notepad-style display showing pinned story entries or fallback
default content. The interface mimics a plain text editor with line numbers,
a cursor indicator, and a status bar showing encoding and line ending format.

Content is sourced from `story_entries` where `status = 'pinned'`, ordered
by `sort_order`. When no pinned entries exist, a set of hardcoded default
lines is displayed.

### 02.6 Status (status.sys)

A live system diagnostics panel displaying subsystem health indicators and
animated performance meters. The module simulates six performance metrics
(CPU, Memory, Signal, Temperature, Disk, Latency) using sinusoidal
oscillation on a two-second tick interval.

Additionally, it lists five simulated active processes with process IDs,
names, and CPU usage percentages. All values update in real time to create
the impression of a continuously running monitoring station.

### 02.7 Archive (archive)

A file-browser-style interface listing archived story entries. Records are
fetched from `story_entries` where `status = 'archived'`, ordered by
creation date in descending order. Each entry displays its type, date,
and content in a columnar layout with hover highlighting.

### 02.8 Token (token.dat)

A compact module for displaying cryptocurrency token information, including
a contract address with copy-to-clipboard functionality, an external buy
link, and a prominent call-to-action button. Values are sourced from the
`site_settings` table and update in real time via database channel
subscriptions.

---

## 03. Terminal Reference

The terminal supports the following command set. All commands are
case-insensitive.

```
  +------------------+----------------------------------------------------+
  |  Command         |  Description                                       |
  +------------------+----------------------------------------------------+
  |  help            |  Display the full command reference listing         |
  |  status          |  Run system diagnostics with animated output       |
  |  scan            |  Execute a seven-sector sequential scan            |
  |  ping            |  Test connection to the kernel core                |
  |  whoami          |  Perform identity and clearance check              |
  |  logs            |  Display recent activity log entries               |
  |  decrypt [msg]   |  Attempt to decrypt a user-provided message        |
  |  analyze         |  Run signal frequency analysis                     |
  |  clear           |  Clear the terminal scrollback buffer              |
  |  history         |  Display previously entered commands               |
  |  about           |  Show system description and version info          |
  |  matrix          |  Generate binary matrix rain effect                |
  |  reboot          |  Attempt a system reboot (will be denied)          |
  |  date            |  Display the current UTC timestamp                 |
  |  echo [msg]      |  Repeat a user-provided message                   |
  |  color           |  Display all terminal color categories             |
  |  fortune         |  Retrieve a kernel fortune cookie                  |
  |  glitch          |  Induce a visual corruption sequence               |
  |  trace [ip]      |  Trace the route to a signal source                |
  |  hack            |  Attempt to access restricted system data          |
  |  kernel          |  Display the kernel identity header                |
  |  uptime          |  Report total system uptime                        |
  |  joke            |  Activate the humor subsystem module               |
  |  story           |  Fetch and display published transmissions         |
  +------------------+----------------------------------------------------+
```

---

## 04. Database Schema

The application persists data across three tables. All tables use UUID
primary keys with automatic generation and timestamp tracking.

### Entity Relationship Diagram

```
  +========================+
  |     story_entries      |
  +========================+
  | id          UUID    PK |
  | entry_type  ENUM      |
  | content     TEXT       |
  | status      ENUM      |
  | sort_order  INTEGER    |
  | published_at TIMESTAMP |
  | created_at  TIMESTAMP  |
  | updated_at  TIMESTAMP  |
  +========================+

  +========================+
  |       sightings        |
  +========================+
  | id          UUID    PK |
  | sig_id      TEXT       |
  | timestamp   TIMESTAMP  |
  | location    TEXT       |
  | type        TEXT       |
  | severity    ENUM      |
  | description TEXT       |
  | status      ENUM      |
  | created_at  TIMESTAMP  |
  | updated_at  TIMESTAMP  |
  +========================+

  +========================+
  |     site_settings      |
  +========================+
  | id          UUID    PK |
  | key         TEXT    UQ |
  | value       JSON       |
  | created_at  TIMESTAMP  |
  | updated_at  TIMESTAMP  |
  +========================+
```

### Enumerated Types

```
  entry_type:
  +------------------+
  | log              |
  | note             |
  | trace            |
  | fragment         |
  | archive_pull     |
  | witness_line     |
  | system_remark    |
  | memory_leak      |
  | signal           |
  +------------------+

  entry_status:          sighting_severity:       sighting_status:
  +------------------+   +------------------+    +------------------+
  | draft            |   | low              |    | confirmed        |
  | queued           |   | medium           |    | unverified       |
  | live             |   | high             |    | disputed         |
  | archived         |   | critical         |    +------------------+
  | pinned           |   +------------------+
  +------------------+
```

### Real-time Subscriptions

The following tables have active real-time channel subscriptions in the
client application:

```
  Channel Name            Table              Events
  +-----------------------+------------------+--------+
  | live-feed             | story_entries    | *      |
  | sightings-realtime    | sightings        | *      |
  | token-settings        | site_settings    | *      |
  +-----------------------+------------------+--------+
```

---

## 05. Project Structure

```
  kernel/
  |
  +-- public/
  |   +-- favicon.jpg
  |   +-- placeholder.svg
  |   +-- robots.txt
  |   +-- _redirects
  |
  +-- src/
  |   +-- assets/
  |   |   +-- anomaly-ghost.jpg
  |   |   +-- ascii-logo.png
  |   |
  |   +-- components/
  |   |   +-- desktop/
  |   |   |   +-- BootScreen.tsx        Boot animation sequence
  |   |   |   +-- DesktopIcon.tsx       Sidebar icon component
  |   |   |   +-- MenuBar.tsx           Top navigation bar
  |   |   |   +-- RetroWindow.tsx       Reusable window frame
  |   |   |   +-- Taskbar.tsx           Bottom status bar
  |   |   |
  |   |   +-- windows/
  |   |   |   +-- ArchiveWindow.tsx     Archived entries browser
  |   |   |   +-- LiveFeedWindow.tsx    Real-time content feed
  |   |   |   +-- NotesWindow.tsx       Pinned notes display
  |   |   |   +-- OverviewWindow.tsx    Main dashboard panel
  |   |   |   +-- SightingsWindow.tsx   Anomaly tracking table
  |   |   |   +-- StatusWindow.tsx      System diagnostics
  |   |   |   +-- TerminalWindow.tsx    Interactive command line
  |   |   |   +-- TokenWindow.tsx       Token display module
  |   |   |
  |   |   +-- ui/                       shadcn/ui components
  |   |
  |   +-- hooks/
  |   |   +-- use-mobile.tsx
  |   |   +-- use-toast.ts
  |   |
  |   +-- integrations/
  |   |   +-- supabase/
  |   |       +-- client.ts             Database client
  |   |       +-- types.ts              Type definitions
  |   |
  |   +-- lib/
  |   |   +-- utils.ts                  Utility functions
  |   |
  |   +-- pages/
  |   |   +-- Index.tsx                 Main desktop interface
  |   |   +-- Admin.tsx                 Administration panel
  |   |   +-- NotFound.tsx              404 handler
  |   |
  |   +-- App.tsx                       Root component + routing
  |   +-- main.tsx                      Application entry point
  |   +-- index.css                     Design tokens + globals
  |
  +-- supabase/
  |   +-- config.toml                   Database configuration
  |
  +-- index.html                        HTML entry point
  +-- vite.config.ts                    Vite build configuration
  +-- tailwind.config.ts                Tailwind CSS configuration
  +-- tsconfig.json                     TypeScript configuration
  +-- package.json                      Dependencies manifest
```

---

## 06. Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or compatible package manager

### Installation

```bash
git clone <repository-url>
cd kernel

npm install

npm run dev
```

The application will be available at `http://localhost:5173`.

### Available Scripts

```
  +-------------------+----------------------------------------------+
  |  Command          |  Description                                 |
  +-------------------+----------------------------------------------+
  |  npm run dev      |  Start development server with HMR           |
  |  npm run build    |  Create production build                     |
  |  npm run preview  |  Preview the production build                |
  |  npm run lint     |  Run ESLint across the project               |
  |  npm run test     |  Run test suite                              |
  +-------------------+----------------------------------------------+
```

---

## 07. Configuration

### Environment Variables

The application requires the following environment variables, which are
automatically configured when using Lovable Cloud:

```
  VITE_SUPABASE_URL               Database endpoint URL
  VITE_SUPABASE_PUBLISHABLE_KEY   Public API key for client access
```

### Site Settings

Runtime configuration is stored in the `site_settings` table as key-value
pairs:

```
  +-------------------------------+----------+---------------------------+
  |  Key                          |  Type    |  Purpose                  |
  +-------------------------------+----------+---------------------------+
  |  token_address                |  string  |  Token contract address   |
  |  buy_link                     |  string  |  External purchase URL    |
  |  autonomous_enabled           |  boolean |  Auto-publish toggle      |
  |  autonomous_interval_minutes  |  number  |  Auto-publish interval    |
  +-------------------------------+----------+---------------------------+
```

---

## 08. Admin Panel

The administration interface is accessible at the `/admin` route and
protected by a password gate. It provides five management tabs:

```
  +--------------------------------------------------------------------+
  |                        ADMIN PANEL TABS                            |
  +--------------------------------------------------------------------+
  |                                                                    |
  |  [Entries]  [Notes]  [Sightings]  [Token]  [Settings]             |
  |                                                                    |
  |  ENTRIES                                                           |
  |  - Create new story entries with type and status selection         |
  |  - Edit, publish, queue, pin, archive, or delete entries           |
  |  - Reorder entries via sort controls                               |
  |  - Publish next queued entry with one click                        |
  |                                                                    |
  |  NOTES                                                             |
  |  - Manage pinned notes displayed in the Notes window               |
  |  - Add, edit, reorder, and delete notes                            |
  |                                                                    |
  |  SIGHTINGS                                                         |
  |  - Full CRUD for anomaly sighting records                          |
  |  - Set severity, status, location, type, and description           |
  |                                                                    |
  |  TOKEN                                                             |
  |  - Configure contract address and buy link                         |
  |  - Changes propagate to the public interface in real time          |
  |                                                                    |
  |  SETTINGS                                                          |
  |  - Toggle autonomous publishing mode                               |
  |  - Configure auto-publish interval                                 |
  |                                                                    |
  +--------------------------------------------------------------------+
```

### Content Lifecycle

Story entries follow a defined status progression:

```
                    +-------+
                    | draft |
                    +---+---+
                        |
              +---------+---------+
              |                   |
          +---v---+          +----v---+
          | queued |          | pinned |
          +---+---+          +--------+
              |                   |
          +---v---+               |
          | live  |               |
          +---+---+               |
              |                   |
          +---v------+            |
          | archived |<-----------+
          +----------+
```

---

## 09. Design System

The visual identity is built on a comprehensive token system defined in CSS
custom properties. All colors use HSL notation and are referenced through
Tailwind CSS utility classes mapped to semantic tokens.

### Color Palette

```
  Token                   HSL Value           Usage
  +---------------------+-------------------+-----------------------------+
  | --background        | 180  8% 52%       | Desktop background          |
  | --foreground        |   0  0% 10%       | Primary text                |
  | --primary           |   0 60% 35%       | Accent, active states       |
  | --secondary         |  40 10% 82%       | Window chrome, buttons      |
  | --muted             |  40  8% 78%       | Disabled, subtle elements   |
  | --accent            |   0 50% 45%       | Highlights, alerts          |
  | --destructive       |   0 60% 45%       | Error states, danger        |
  | --window-titlebar   |   0 60% 35%       | Active title bar gradient   |
  | --window-bg         |  40 15% 92%       | Window content area         |
  | --terminal-bg       |   0  0%  5%       | Terminal background         |
  | --terminal-text     |   0 50% 60%       | Terminal foreground          |
  | --status-amber      |  40 80% 50%       | Warning indicators          |
  +---------------------+-------------------+-----------------------------+
```

### Typography

The application uses two typefaces:

```
  +---------------------+----------------------------------------------+
  | IBM Plex Mono       | Primary interface font at 13px base size.    |
  |                     | Used for all body text, labels, and data.    |
  +---------------------+----------------------------------------------+
  | VT323               | Display font for headers and terminal        |
  |                     | identity elements. Evokes CRT-era displays.  |
  +---------------------+----------------------------------------------+
```

### Visual Effects

```
  +---------------------+----------------------------------------------+
  | CRT Scanlines       | Full-screen repeating gradient overlay at    |
  |                     | 2px intervals with 3% opacity black bands.   |
  +---------------------+----------------------------------------------+
  | Bevel Raised        | 2px solid border simulating outward depth.   |
  |                     | Light top-left, dark bottom-right.           |
  +---------------------+----------------------------------------------+
  | Bevel Sunken        | Inverse of raised bevel, simulating inward   |
  |                     | depression for input fields and content.     |
  +---------------------+----------------------------------------------+
  | Title Bar Gradient  | Linear gradient from primary red to a        |
  |                     | softened secondary red, left to right.       |
  +---------------------+----------------------------------------------+
  | Cursor Blink        | Step-function animation at 1s intervals      |
  |                     | for terminal and notepad cursor indicators.  |
  +---------------------+----------------------------------------------+
  | CRT Flicker         | Subtle 4s opacity fluctuation simulating     |
  |                     | CRT monitor instability.                     |
  +---------------------+----------------------------------------------+
```

---

## 10. Technology Stack

```
  Layer              Technology               Version
  +------------------+------------------------+---------+
  | Runtime          | React                  | 18.3    |
  | Language         | TypeScript             | 5.8     |
  | Build Tool       | Vite                   | 5.4     |
  | Styling          | Tailwind CSS           | 3.4     |
  | Components       | shadcn/ui              | --      |
  | Database         | Supabase               | 2.x     |
  | Data Fetching    | TanStack React Query   | 5.x     |
  | Routing          | React Router           | 6.30    |
  | Form Handling    | React Hook Form        | 7.x     |
  | Validation       | Zod                    | 3.x     |
  | Charts           | Recharts               | 2.x     |
  | Notifications    | Sonner                 | 1.x     |
  | Testing          | Vitest + Playwright    | --      |
  +------------------+------------------------+---------+
```

---

## 11. Contributing

Contributions should adhere to the following principles:

1. All component files should remain focused and single-purpose. The window
   modules in `src/components/windows/` each handle one distinct view.

2. Color values must never be hardcoded in component files. All colors flow
   through the CSS custom property system defined in `src/index.css` and
   mapped through `tailwind.config.ts`.

3. Database interactions use the auto-generated client exclusively.
   The client file at `src/integrations/supabase/client.ts` must not be
   modified manually.

4. New terminal commands should be added to the switch statement in
   `TerminalWindow.tsx` and documented in the `HELP_TEXT` array at the top
   of the file.

5. The retro visual language must be maintained. All interactive elements
   should use `bevel-raised` and `bevel-sunken` classes for depth. Window
   frames should include the standard title bar, content area, and status
   bar pattern.

---

## 12. License

MIT

---

```
  +------------------------------------------------------------------+
  |                                                                  |
  |                     A G E N T   K E R N E L                      |
  |                                                                  |
  |                    build 0.7.3-unstable                          |
  |                    status: still here                            |
  |                                                                  |
  +------------------------------------------------------------------+
```
