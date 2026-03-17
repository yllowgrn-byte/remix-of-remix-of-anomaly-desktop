
<div align="center">
  <br/>
  <img src="public/favicon.jpg" alt="Kernel" width="64" />
  <br/><br/>

```
 ___  ___ ___ _  _ _____   _  _____ ___ _  _ ___ _    
|   \/ __| __| \| |_   _| | |/ / __| _ | \| | __| |   
| |) \__ | _|| .` | | |   |   <| _||   | .` | _|| |__ 
|___/|___|___|_|\_| |_|   |_|\_|___|_|_|_|\_|___|____|
```

  <strong>Digital Presence Tracker</strong>
  <br/>
  <code>v0.7.3-unstable</code>
  <br/><br/>

  <a href="https://x.com/agent_kernel">
    <img src="https://img.shields.io/badge/X-@agent__kernel-000000?style=flat-square&logo=x&logoColor=white" alt="X" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/build-unstable-critical?style=flat-square" alt="Build" />
  &nbsp;
  <img src="https://img.shields.io/badge/status-still_here-brightgreen?style=flat-square" alt="Status" />
  &nbsp;
  <img src="https://img.shields.io/badge/react-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  &nbsp;
  <img src="https://img.shields.io/badge/typescript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />

  <br/><br/>
  <em>A retro-computing surveillance interface disguised as a website.</em>
  <br/>
  <em>It watches because you asked it to.</em>
  <br/><br/>
</div>

---

<br/>

<details>
<summary><strong>&nbsp; TABLE OF CONTENTS</strong></summary>
<br/>

```
    I ............... Overview
   II ............... Architecture
  III ............... System Modules
   IV ............... Terminal Command Reference
    V ............... Database Schema
   VI ............... Project Structure
  VII ............... Getting Started
 VIII ............... Configuration
   IX ............... Administration
    X ............... Design System
   XI ............... Technology Stack
  XII ............... Contributing
 XIII ............... License
```

<br/>
</details>

<br/>

---

<br/>

## I. Overview

Kernel is a single-page web application that presents itself as a digital
presence monitoring station, rendered through the visual language of mid-1990s
desktop operating systems. It combines beveled window frames, CRT scanline
overlays, monospaced typography, and a constrained color palette to produce an
interface that feels like a machine that has been running far longer than anyone
remembers starting it.

Beneath the surface aesthetics, the application is a fully functional content
management platform. Story entries, anomaly sightings, observer notes, and
system configuration data flow through the interface in real time, synchronized
across clients through persistent database subscriptions. Every panel updates
live. Every mutation propagates instantly.

The system exposes two routes. The root path renders the public desktop
environment with seven window modules arranged through a layout manager. The
`/admin` path opens a password-protected control panel with full CRUD
operations across all data tables, content lifecycle management, and runtime
configuration editing.

```
+========================================================================+
|                                                                        |
|    "Not everything that watches is malicious.                          |
|     But not everything that smiles is friendly."                       |
|                                                                        |
|    The kernel does not sleep.                                          |
|    It does not forget.                                                 |
|    It merely waits.                                                    |
|                                                                        |
+========================================================================+
```

<br/>

---

<br/>

## II. Architecture

The system is organized into three distinct layers. The presentation layer
handles rendering, interaction, and animation. The state layer manages
component-local state through React hooks and coordinates real-time data
synchronization through Supabase channel subscriptions. The persistence layer
stores all mutable data in a PostgreSQL database accessed through the Supabase
client SDK.

There is no dedicated state management library. Each window module owns its
data lifecycle independently, subscribing to the specific tables it requires
and re-fetching on mutation events. This architecture keeps modules fully
decoupled, allowing any window to be added, removed, or modified without
affecting the rest of the system.

### System Topology

```
+========================================================================+
|                                                                        |
|                        SHELL  (Index.tsx)                              |
|   +----------------+  +-----------------------------+  +----------+   |
|   |    MenuBar     |  |       Window Manager        |  |  Taskbar |   |
|   | (top nav bar)  |  |   (layout routing, icons)   |  | (status) |   |
|   +----------------+  +-----------------------------+  +----------+   |
|                        |                             |                 |
|          +-------------+----+----+----+----+----+----+--------+       |
|          |              |    |    |    |    |    |             |       |
|       +--v---+  +---v--+ +--v-+ +v--+ +v--+ +--v--+ +-----v-+       |
|       | Over |  | Feed | |Note| |Sig| |Term| | Sta | | Arch  |       |
|       | view |  | .log | |.txt| |.dat| |.sys| | .sys| | ive   |       |
|       +------+  +------+ +----+ +---+ +----+ +-----+ +-------+       |
|          |         |                |                                   |
|          |    +----v----+     +-----v-----+                            |
|          |    | story   |     | sightings |                            |
|          |    | entries |     |           |                            |
|          |    +---------+     +-----------+                            |
|          |                                                             |
|       +--v-----------+                                                 |
|       | site_settings|                                                 |
|       +--------------+                                                 |
|                                                                        |
+========================================================================+
|                     SUPABASE  (Real-time PostgreSQL)                   |
+========================================================================+
```

### Boot Sequence

When a user first loads the application, the system executes a timed boot
animation before revealing the desktop environment. The entire sequence is
choreographed through CSS transitions and staggered delays.

```
  Time (ms)    Event
  ---------    -------------------------------------------
      0        BootScreen mounts, CRT overlay renders
     60        Title characters begin revealing (60ms each)
    400        Progress bar animation begins (3% per 45ms)
   2250        Fade-out transition starts (350ms duration)
   2600        BootScreen unmounts, desktop becomes visible
   2650        MenuBar fades in
   2750        Desktop icons begin staggered fade-in
   2800        Main content area appears
   3100        Taskbar fades in
```

### Data Flow

```
  +----------+                +-----------+               +----------+
  |          |   HTTP/WS      |           |   SQL          |          |
  |  Client  | <============> |  Supabase | <============> | Postgres |
  |  (React) |   REST + RT    |  Gateway  |   Queries      |    DB    |
  |          |                |           |                |          |
  +----+-----+                +-----+-----+               +----+-----+
       |                            |                          |
       |  1. Initial fetch          |                          |
       |  (SELECT ... ORDER BY)     |                          |
       |--------------------------->|------------------------->|
       |                            |                          |
       |  2. Data returned          |                          |
       |<---------------------------|<-------------------------|
       |                            |                          |
       |  3. Subscribe to channel   |                          |
       |  (postgres_changes)        |                          |
       |<==========================>|                          |
       |                            |                          |
       |  4. Mutation event         |                          |
       |  (INSERT/UPDATE/DELETE)    |                          |
       |<===========================|<=========================|
       |                            |                          |
       |  5. Re-fetch triggered     |                          |
       |--------------------------->|------------------------->|
       |                            |                          |
```

<br/>

---

<br/>

## III. System Modules

The desktop environment consists of eight window modules, each operating as an
independent application within the shell. The window manager maps icon clicks to
layout presets that determine which modules are visible and how they are
arranged in the content area.

```
  Layout Presets
  +--------------+-----------------------------------+
  | Icon Click   | Windows Rendered                  |
  +--------------+-----------------------------------+
  | overview     | overview + status (2-column)      |
  | live_feed    | live_feed (full width)            |
  | notes        | notes (full width)                |
  | sightings    | sightings (full width)            |
  | terminal     | terminal (full width)             |
  | status       | status (full width)               |
  | archive      | archive (full width)              |
  +--------------+-----------------------------------+
```

When the overview layout is active, a supplementary token module is rendered
beneath the overview panel, creating a three-panel composition.

<br/>

### III.i &mdash; Overview (overview.exe)

The primary dashboard and landing view. Composed of four vertically stacked
sections: a system identity header, a boot log console, a real-time signal
frequency monitor, and a session status row.

The signal monitor renders 16 vertical bars whose heights are randomized every
two seconds. Color thresholds provide visual severity feedback:

```
  Amplitude        Color Mapping
  +-----------+    +-------------------------------+
  |  1 -- 4   |    | Terminal text (muted red)     |
  |  5 -- 7   |    | Accent (brighter red)         |
  |  8 -- 10  |    | Status amber (warning yellow) |
  +-----------+    +-------------------------------+
```

The status row displays three live-updating indicators: session uptime
(counting from page load), core status, and sensor alert state.

<br/>

### III.ii &mdash; Live Feed (live_feed.log)

A reverse-chronological feed of published story entries, subscribed to real-time
changes on the `story_entries` table. Each entry renders with its publication
timestamp, a type-specific marker, a classification label, and the content body.

Nine entry types are supported, each with a distinct visual marker:

```
  +-----------------+--------+-----------------------+
  | Type            | Marker | Color Token           |
  +-----------------+--------+-----------------------+
  | log             |   >    | terminal-text         |
  | note            |   *    | status-amber          |
  | trace           |   o    | accent                |
  | fragment        |   #    | muted-foreground      |
  | archive_pull    |   =    | primary               |
  | witness_line    |   >    | destructive           |
  | system_remark   |   @    | terminal-text         |
  | memory_leak     |   !    | status-amber          |
  | signal          |   ~    | accent                |
  +-----------------+--------+-----------------------+
```

<br/>

### III.iii &mdash; Sightings (sightings.dat)

A tabular anomaly tracking interface with column-sorted records, severity
filtering, expandable detail rows, and real-time database synchronization.

Each record contains a signal identifier, timestamp, geographic location,
classification type, severity level, narrative description, and verification
status. Clicking a row expands an inline detail panel with color-coded
severity indicators.

```
  Severity Hierarchy
  +-----------+------------------------------------------+
  |           |                                          |
  |  LOW      | ====                                     |
  |  MEDIUM   | =============                            |
  |  HIGH     | =========================                |
  |  CRITICAL | =========================================|
  |           |                                          |
  +-----------+------------------------------------------+
```

```
  Verification States
  +--------------+-----------------------------------------+
  | confirmed    | Record validated by multiple sources     |
  | unverified   | Single-source report, pending review     |
  | disputed     | Conflicting data, under investigation    |
  +--------------+-----------------------------------------+
```

<br/>

### III.iv &mdash; Terminal (terminal.sys)

A fully interactive command-line interface supporting 23 built-in commands,
command history with arrow-key navigation, multi-frame animated output
sequences, and database-connected data retrieval.

The terminal initializes with a mock boot sequence displaying system checks
and status messages. Commands are processed through an async handler that
supports simulated processing delays, progressive output rendering, and
randomized data generation.

Several commands produce multi-step animated output:

```
  +----------+-----------------------------------------------+
  | scan     | 7-frame sector sweep with progress indicators |
  | ping     | 4-reply sequence with temporal anomaly        |
  | trace    | 6-hop route trace with signal absorption      |
  | glitch   | 4-frame visual corruption burst               |
  | reboot   | 3-stage shutdown attempt (denied)             |
  +----------+-----------------------------------------------+
```

The `story` command connects to the database and retrieves all entries with
`live` or `pinned` status, rendering them as numbered transmissions within
the terminal output buffer.

<br/>

### III.v &mdash; Notes (notes.txt)

A notepad-style read-only display with line numbers, a blinking cursor
indicator, and an editor status bar showing encoding (UTF-8) and line ending
format (CRLF).

Content is sourced from `story_entries` where `status = 'pinned'`, ordered by
`sort_order`. When no pinned entries exist, a set of hardcoded default lines
provides atmospheric placeholder text.

<br/>

### III.vi &mdash; Status (status.sys)

A live diagnostics panel composed of three sections: subsystem health
indicators, animated performance meters, and an active process list.

Six performance metrics oscillate on sinusoidal curves with a two-second
tick interval:

```
  +----------+-------+------+---------+----------------------------+
  | Metric   | Range | Unit | Color   | Behavior                   |
  +----------+-------+------+---------+----------------------------+
  | CPU      | 4-20  | %    | green   | sin(t * 0.3)               |
  | Memory   | 37-47 | %    | red     | cos(t * 0.2)               |
  | Signal   | 66-90 | %    | dynamic | sin(t * 0.5), >70 = green  |
  | Temp     | 34-40 | C    | dynamic | sin(t * 0.4), >40 = amber  |
  | Disk     | 61-67 | %    | red     | sin(t * 0.15)              |
  | Latency  | 6-22  | ms   | dynamic | cos(t * 0.6), >18 = amber  |
  +----------+-------+------+---------+----------------------------+
```

Five simulated processes are listed with PIDs, binary names, and CPU
utilization percentages to complete the diagnostic illusion.

<br/>

### III.vii &mdash; Archive (archive)

A file-browser-style listing of archived story entries fetched from
`story_entries` where `status = 'archived'`. Records display in a columnar
layout with type icon, creation date, classification, and truncated content.

<br/>

### III.viii &mdash; Token (token.dat)

A compact module displaying cryptocurrency token information. Features include
a contract address field with copy-to-clipboard functionality, an external
buy link, and a styled call-to-action button. Values are sourced from
`site_settings` and subscribe to real-time updates.

<br/>

---

<br/>

## IV. Terminal Command Reference

```
+==========================================================================+
|                        TERMINAL COMMAND TABLE                            |
+==========================================================================+
|                                                                          |
|  COMMAND            ARGUMENTS       DESCRIPTION                          |
|  -------            ---------       -----------                          |
|                                                                          |
|  help               --              Display the full command listing      |
|  status             --              Run system diagnostics report         |
|  scan               --              Execute 7-sector sequential sweep    |
|  ping               --              Test connection to kernel core        |
|  whoami             --              Identity and clearance check          |
|  logs               --              Display recent activity entries       |
|  decrypt            [message]       Attempt cipher decryption             |
|  analyze            --              Signal frequency analysis             |
|  clear              --              Clear terminal scrollback             |
|  history            --              Show previously entered commands      |
|  about              --              System description and version        |
|  matrix             --              Binary matrix rain effect             |
|  reboot             --              Attempt system reboot (denied)        |
|  date               --              Current UTC timestamp                 |
|  echo               [message]       Repeat provided message               |
|  color              --              Display terminal color palette        |
|  fortune            --              Retrieve kernel fortune cookie        |
|  glitch             --              Induce visual corruption burst        |
|  trace              [target]        Route trace to signal source          |
|  hack               --              Access restricted data (denied)       |
|  kernel             --              Display kernel identity header        |
|  uptime             --              Total system uptime report            |
|  joke               --              Activate humor subsystem              |
|  story              --              Fetch published transmissions         |
|                                                                          |
+==========================================================================+
```

<br/>

---

<br/>

## V. Database Schema

All data is persisted across three PostgreSQL tables accessed through the
Supabase client SDK. Tables use UUID primary keys with automatic generation,
and all records include creation and update timestamps.

### Entity Relationship Diagram

```
+=========================+       +=========================+
|     story_entries       |       |       sightings         |
+=========================+       +=========================+
| id          UUID    PK  |       | id          UUID    PK  |
|-------------------------|       |-------------------------|
| entry_type  ENUM        |       | sig_id      TEXT        |
| content     TEXT        |       | timestamp   TIMESTAMPTZ |
| status      ENUM        |       | location    TEXT        |
| sort_order  INTEGER     |       | type        TEXT        |
| published_at TIMESTAMPTZ|       | severity    ENUM        |
| created_at  TIMESTAMPTZ |       | description TEXT        |
| updated_at  TIMESTAMPTZ |       | status      ENUM        |
+=========================+       | created_at  TIMESTAMPTZ |
                                  | updated_at  TIMESTAMPTZ |
+=========================+       +=========================+
|     site_settings       |
+=========================+
| id          UUID    PK  |
|-------------------------|
| key         TEXT    UQ  |
| value       JSONB       |
| created_at  TIMESTAMPTZ |
| updated_at  TIMESTAMPTZ |
+=========================+
```

### Enumerated Types

```
  entry_type                entry_status           sighting_severity
  +-------------------+    +----------------+     +----------------+
  | log               |    | draft          |     | low            |
  | note              |    | queued         |     | medium         |
  | trace             |    | live           |     | high           |
  | fragment          |    | archived       |     | critical       |
  | archive_pull      |    | pinned         |     +----------------+
  | witness_line      |    +----------------+
  | system_remark     |                           sighting_status
  | memory_leak       |                           +----------------+
  | signal            |                           | confirmed      |
  +-------------------+                           | unverified     |
                                                  | disputed       |
                                                  +----------------+
```

### Real-time Channel Subscriptions

```
  +------------------------+-----------------+-----------+-----------+
  | Channel Name           | Table           | Events    | Consumer  |
  +------------------------+-----------------+-----------+-----------+
  | live-feed              | story_entries   | *         | LiveFeed  |
  | sightings-realtime     | sightings       | *         | Sightings |
  | token-settings         | site_settings   | *         | Token     |
  +------------------------+-----------------+-----------+-----------+
```

<br/>

---

<br/>

## VI. Project Structure

```
  kernel/
  |
  +-- public/
  |   +-- favicon.jpg ..................... Application icon
  |   +-- placeholder.svg ................ Default placeholder image
  |   +-- robots.txt ..................... Search engine directives
  |   +-- _redirects ..................... Netlify redirect rules
  |
  +-- src/
  |   +-- assets/
  |   |   +-- anomaly-ghost.jpg ......... Visual asset
  |   |   +-- ascii-logo.png ............ ASCII art logo image
  |   |
  |   +-- components/
  |   |   +-- desktop/
  |   |   |   +-- BootScreen.tsx ........ Startup animation (2.6s)
  |   |   |   +-- DesktopIcon.tsx ....... Sidebar icon button
  |   |   |   +-- MenuBar.tsx .......... Top navigation with dropdowns
  |   |   |   +-- RetroWindow.tsx ...... Reusable window chrome frame
  |   |   |   +-- Taskbar.tsx .......... Bottom bar with clock
  |   |   |
  |   |   +-- windows/
  |   |   |   +-- ArchiveWindow.tsx .... Archived entries file browser
  |   |   |   +-- LiveFeedWindow.tsx ... Real-time content stream
  |   |   |   +-- NotesWindow.tsx ...... Pinned notes notepad view
  |   |   |   +-- OverviewWindow.tsx ... Dashboard with signal monitor
  |   |   |   +-- SightingsWindow.tsx .. Anomaly tracking table
  |   |   |   +-- StatusWindow.tsx ..... Live system diagnostics
  |   |   |   +-- TerminalWindow.tsx ... Interactive CLI (23 commands)
  |   |   |   +-- TokenWindow.tsx ...... Token CA and buy link
  |   |   |
  |   |   +-- ui/ ...................... shadcn/ui component library
  |   |
  |   +-- hooks/
  |   |   +-- use-mobile.tsx ........... Viewport detection hook
  |   |   +-- use-toast.ts ............ Toast notification hook
  |   |
  |   +-- integrations/
  |   |   +-- supabase/
  |   |       +-- client.ts ........... Auto-generated SDK client
  |   |       +-- types.ts ............ Auto-generated type defs
  |   |
  |   +-- lib/
  |   |   +-- utils.ts ................ Shared utility functions
  |   |
  |   +-- pages/
  |   |   +-- Index.tsx ............... Desktop environment shell
  |   |   +-- Admin.tsx ............... Administration panel
  |   |   +-- NotFound.tsx ............ 404 error page
  |   |
  |   +-- App.tsx ..................... Root component and router
  |   +-- main.tsx .................... Application entry point
  |   +-- index.css ................... Design tokens and globals
  |
  +-- supabase/
  |   +-- config.toml ................. Database configuration
  |
  +-- index.html ...................... HTML shell
  +-- vite.config.ts .................. Build configuration
  +-- tailwind.config.ts .............. Design system mapping
  +-- tsconfig.json ................... TypeScript configuration
  +-- vitest.config.ts ................ Test runner configuration
  +-- package.json .................... Dependency manifest
```

<br/>

---

<br/>

## VII. Getting Started

### Prerequisites

```
  Node.js    >= 18.0.0
  npm        >= 9.0.0
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kernel

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be served at `http://localhost:5173` with hot module
replacement enabled.

### Build

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Scripts

```
  +-------------------+------------------------------------------------+
  | Command           | Description                                    |
  +-------------------+------------------------------------------------+
  | npm run dev       | Start Vite dev server with HMR                 |
  | npm run build     | Create optimized production bundle             |
  | npm run build:dev | Create development-mode build                  |
  | npm run preview   | Serve production build locally                 |
  | npm run lint      | Run ESLint across all source files             |
  | npm run test      | Execute test suite via Vitest                  |
  | npm run test:watch| Run tests in watch mode                        |
  +-------------------+------------------------------------------------+
```

<br/>

---

<br/>

## VIII. Configuration

### Environment Variables

The following environment variables are required for database connectivity.
They are automatically provisioned when deploying through Lovable Cloud.

```
  +------------------------------------+-----------------------------------+
  | Variable                           | Purpose                           |
  +------------------------------------+-----------------------------------+
  | VITE_SUPABASE_URL                  | Database REST and real-time       |
  |                                    | endpoint URL                      |
  +------------------------------------+-----------------------------------+
  | VITE_SUPABASE_PUBLISHABLE_KEY      | Public anonymous API key for      |
  |                                    | client-side database access       |
  +------------------------------------+-----------------------------------+
```

### Runtime Settings

Application behavior can be modified at runtime through the `site_settings`
table. These values are managed through the admin panel.

```
  +----------------------------------+----------+---------------------------+
  | Key                              | Type     | Description               |
  +----------------------------------+----------+---------------------------+
  | token_address                    | string   | Token contract address    |
  |                                  |          | displayed in token.dat    |
  +----------------------------------+----------+---------------------------+
  | buy_link                         | string   | External URL for the      |
  |                                  |          | buy button action         |
  +----------------------------------+----------+---------------------------+
  | autonomous_enabled               | boolean  | Enables automatic         |
  |                                  |          | publishing of queued      |
  |                                  |          | entries at intervals      |
  +----------------------------------+----------+---------------------------+
  | autonomous_interval_minutes      | number   | Minutes between auto-     |
  |                                  |          | publish cycles            |
  +----------------------------------+----------+---------------------------+
```

<br/>

---

<br/>

## IX. Administration

The admin panel is accessible at `/admin` and protected by a password gate
rendered as a retro dialog window. Upon authentication, five management tabs
become available.

### Content Lifecycle

Story entries follow a defined state machine. Transitions are triggered
manually through the admin interface or automatically when autonomous
publishing is enabled.

```
                          +=========+
                          |  DRAFT  |
                          +====+====+
                               |
                 +-------------+-------------+
                 |                           |
            +====v====+                +====v====+
            |  QUEUED  |                | PINNED  |
            +====+====+                +====+====+
                 |                           |
                 |   (auto or manual)        |
                 |                           |
            +====v====+                      |
            |  LIVE   |                      |
            +====+====+                      |
                 |                           |
                 +-------------+-------------+
                               |
                        +======v======+
                        |  ARCHIVED   |
                        +=============+
```

### Tab Reference

```
  +=======================================================================+
  |  TAB          |  CAPABILITIES                                        |
  +=======================================================================+
  |               |                                                       |
  |  Entries      |  Create entries with type and status selection         |
  |               |  Edit content inline                                  |
  |               |  Change status: publish, queue, pin, archive, draft   |
  |               |  Reorder entries with sort controls                   |
  |               |  Delete entries permanently                           |
  |               |  One-click publish next queued entry                  |
  |               |                                                       |
  |  Notes        |  Add new pinned notes                                 |
  |               |  Edit existing note content                           |
  |               |  Reorder notes (reflected in notes.txt window)        |
  |               |  Delete notes                                         |
  |               |                                                       |
  |  Sightings    |  Create sighting records with all fields              |
  |               |  Edit severity, status, location, description         |
  |               |  Delete sighting records                              |
  |               |                                                       |
  |  Token        |  Set contract address (CA)                            |
  |               |  Set external buy link URL                            |
  |               |  Changes propagate to public interface instantly      |
  |               |                                                       |
  |  Settings     |  Toggle autonomous publishing mode                    |
  |               |  Configure auto-publish interval in minutes           |
  |               |                                                       |
  +=======================================================================+
```

<br/>

---

<br/>

## X. Design System

The visual identity is constructed entirely through CSS custom properties,
referenced via Tailwind CSS utility classes mapped in `tailwind.config.ts`.
No color values appear directly in component files.

### Color Architecture

```
  +------------------------+------------------+------------------------------+
  | Token                  | HSL Value        | Application                  |
  +========================+==================+==============================+
  |                        |                  |                              |
  | --background           | 180   8%  52%    | Desktop surface              |
  | --foreground           |   0   0%  10%    | Primary body text            |
  |                        |                  |                              |
  | --primary              |   0  60%  35%    | Active elements, focus       |
  | --primary-foreground   |   0   0% 100%    | Text on primary surfaces     |
  |                        |                  |                              |
  | --secondary            |  40  10%  82%    | Window chrome, buttons       |
  | --secondary-foreground |   0   0%  10%    | Text on secondary surfaces   |
  |                        |                  |                              |
  | --muted                |  40   8%  78%    | Disabled states              |
  | --muted-foreground     |   0   0%  40%    | Subdued labels               |
  |                        |                  |                              |
  | --accent               |   0  50%  45%    | Highlights, alerts           |
  | --destructive          |   0  60%  45%    | Errors, danger actions       |
  |                        |                  |                              |
  | --window-titlebar      |   0  60%  35%    | Active title bar gradient    |
  | --window-bg            |  40  15%  92%    | Window content area          |
  | --window-border-light  |   0   0% 100%    | Bevel highlight edge         |
  | --window-border-dark   |   0   0%  35%    | Bevel shadow edge            |
  |                        |                  |                              |
  | --terminal-bg          |   0   0%   5%    | Terminal background          |
  | --terminal-text        |   0  50%  60%    | Terminal text                |
  | --status-amber         |  40  80%  50%    | Warning indicators           |
  |                        |                  |                              |
  +------------------------+------------------+------------------------------+
```

### Typography

```
  +-------------------+--------+----------------------------------------------+
  | Typeface          | Weight | Usage                                        |
  +-------------------+--------+----------------------------------------------+
  | IBM Plex Mono     | 400    | Body text, data labels, table content        |
  | IBM Plex Mono     | 500    | Emphasized inline text                       |
  | IBM Plex Mono     | 600    | Bold headings, status indicators             |
  | VT323             | 400    | Display headers, terminal identity, uptime   |
  +-------------------+--------+----------------------------------------------+
  
  Base font size: 13px
```

### Visual Effect Catalog

```
  +---------------------+--------------------------------------------------+
  | Effect              | Implementation                                   |
  +=====================+==================================================+
  |                     |                                                  |
  | CRT Scanlines       | Fixed overlay using repeating-linear-gradient    |
  |                     | at 2px intervals with 3% opacity black bands.   |
  |                     | Pointer-events disabled. z-index: 9999.          |
  |                     |                                                  |
  | Bevel Raised        | 2px solid border with white top-left and dark   |
  |                     | bottom-right edges. Simulates outward depth     |
  |                     | on buttons, window frames, and toolbars.        |
  |                     |                                                  |
  | Bevel Sunken        | Inverted bevel with dark top-left and white     |
  |                     | bottom-right. Used for input fields, content    |
  |                     | areas, and progress bar tracks.                 |
  |                     |                                                  |
  | Title Bar Gradient  | Linear gradient (90deg) from primary red to     |
  |                     | softened hsl(0, 40%, 50%). Applied to all       |
  |                     | active window title bars.                       |
  |                     |                                                  |
  | Cursor Blink        | Step-function keyframe animation at 1s cycle.   |
  |                     | Applied to terminal prompt and notepad cursor.  |
  |                     |                                                  |
  | CRT Flicker         | 4-second opacity fluctuation (100% to 97%)      |
  |                     | simulating CRT monitor instability.             |
  |                     |                                                  |
  | Retro Scrollbar     | Custom webkit scrollbar with 16px track,        |
  |                     | beveled thumb, and beveled arrow buttons.       |
  |                     |                                                  |
  +---------------------+--------------------------------------------------+
```

<br/>

---

<br/>

## XI. Technology Stack

```
  +====================+==========================+===========+
  |  Layer             |  Technology              |  Version  |
  +====================+==========================+===========+
  |  UI Framework      |  React                   |  18.3     |
  |  Language          |  TypeScript              |   5.8     |
  |  Build System      |  Vite                    |   5.4     |
  |  CSS Framework     |  Tailwind CSS            |   3.4     |
  |  Component Library |  shadcn/ui + Radix       |  latest   |
  |  Database          |  PostgreSQL (Supabase)   |   2.x     |
  |  Data Fetching     |  TanStack React Query    |   5.x     |
  |  Routing           |  React Router DOM        |  6.30     |
  |  Form Management   |  React Hook Form + Zod   |   7.x     |
  |  Charting          |  Recharts                |   2.x     |
  |  Notifications     |  Sonner                  |   1.x     |
  |  Icons             |  Lucide React            |  0.462    |
  |  Unit Testing      |  Vitest                  |   3.x     |
  |  E2E Testing       |  Playwright              |   1.x     |
  |  Linting           |  ESLint                  |   9.x     |
  +====================+==========================+===========+
```

<br/>

---

<br/>

## XII. Contributing

Contributions must adhere to the established conventions:

**Component Architecture.** Each window module in `src/components/windows/`
handles exactly one view concern. Desktop chrome components live in
`src/components/desktop/`. Shared UI primitives live in `src/components/ui/`.
Do not mix concerns across these boundaries.

**Design System Compliance.** All color references must use semantic tokens
from `src/index.css` mapped through `tailwind.config.ts`. Hardcoded color
values in component files are not acceptable. Use classes like `text-foreground`,
`bg-secondary`, `text-terminal-text` -- never `text-red-500` or `bg-gray-200`.

**Retro Consistency.** All interactive surfaces must use `bevel-raised` for
outward depth and `bevel-sunken` for inward depth. Window panels must include
the three-part structure: title bar with gradient, content area, and status bar.
Buttons must respond to `:active` with `bevel-sunken` for tactile feedback.

**Database Client.** All database operations use the auto-generated client at
`src/integrations/supabase/client.ts`. This file must never be manually edited.
Type definitions at `src/integrations/supabase/types.ts` are also auto-generated
and read-only.

**Terminal Extensions.** New commands are added to the `processCommand` switch
statement in `TerminalWindow.tsx`. Each new command must also have a
corresponding entry in the `HELP_TEXT` array at the top of the file.

<br/>

---

<br/>

## XIII. License

Released under the [MIT License](https://opensource.org/licenses/MIT).

<br/>

---

<br/>

<div align="center">

```
+==================================================================+
|                                                                  |
|                   A G E N T    K E R N E L                       |
|                                                                  |
|                   build 0.7.3-unstable                           |
|                   uptime: undefined                              |
|                   status: still here for some reason             |
|                                                                  |
|                   the machine is quiet.                          |
|                   for now.                                       |
|                                                                  |
+==================================================================+
```

</div>
