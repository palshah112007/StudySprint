# 🚀 SprintStudy

> **An AI-powered gamified study operating system** — Focus sessions, adaptive quizzes, spaced-repetition flashcards, progress analytics, and a thriving study community.

SprintStudy transforms the way students learn by combining a **Pomodoro focus room**, **AI-generated quizzes**, **smart flashcards**, **task management**, **gamification** (XP, levels, achievements, leaderboards), and **community features** into one seamless dark-themed experience.

---

## ✨ Features

### 🎯 Dashboard
- Personalized greeting with streak tracking
- Quick actions grid (Focus, Quiz, Flashcards, Notes, Tasks, Study Group, AI Assistant, Analytics)
- XP progress bar with level system
- Weekly activity chart with animated bars
- Subject-wise progress tracking
- Contribution heatmap (GitHub-style study calendar)
- AI-powered study recommendations
- LeetCode-style problem-solving progress tracker

### ⏱️ Focus Room
- **Pomodoro timer** with Sprint (25m), Deep (45m), and Marathon (60m) modes
- Animated circular progress indicator
- **Ambient soundscapes** — Rain, Waves, Lofi, and Nature (Web Audio API)
- **Visual ambiance** — Deep Space, Ocean Depths, Forest, Clouds backgrounds
- Animated floating particles
- Session statistics tracking
- Fullscreen mode for distraction-free focus
- Session logs saved to local storage

### 🧠 Quiz Center
- **10 built-in quiz sets** across Mathematics, Physics, Computer Science, Biology, Chemistry, and Literature
- **AI-generated quizzes** — ask the AI Assistant to create custom quizzes
- Real-time timer with visual urgency indicators
- Detailed answer explanations
- Scoring with animated circular results
- Question review after completion
- History tracking with XP rewards
- Difficulty filtering (Easy, Medium, Hard, Mixed)

### 📚 Flashcards
- **Spaced repetition** system with box levels (1-5)
- 3 pre-loaded decks: Calculus Fundamentals, Quantum Physics, Algorithms
- Flip animation with spring physics
- "Know It / Don't Know" study flow
- Keyboard shortcuts (Space to flip, arrow keys to navigate)
- Create custom decks and cards
- Mastery progress tracking
- New deck creation modal

### 📝 Study Notes
- Create, edit, search, and organize notes by subject
- **Pin/unpin** important notes
- Color-coded subjects
- Tag system for organization
- Full note viewer/editor with split-pane layout
- Search across titles, content, and tags

### ✅ Tasks & Deadlines
- Task management with **priority levels** (Low, Medium, High, Urgent)
- **Due date tracking** with overdue warnings
- Subject and category filtering
- Sort by due date, priority, or subject
- Completion tracking with XP rewards
- Quick stats: active tasks, due today, overdue
- Editable tasks with inline controls

### 🏆 Gamification
- **XP & Level system** with 6 ranks (Bronze → Legend)
- **12 achievements** with unlock animations
- **5 daily missions** with claimable rewards
- **3 weekly challenges** with XP bonuses
- **Skill trees** — Focus Mastery, Quiz Champion, Social Butterfly
- **Global leaderboard** with competitor profiles
- Confetti effects on achievements
- Sound effects for interactions

### 👥 Community
- Study groups with member counts and active status
- Friends list with online/offline status
- Live activity feed
- **Live study rooms** — real-time virtual study sessions
- Weekly challenges with prizes
- Find friends modal with mutual connections
- Community stats dashboard

### 🤖 AI Assistant
- **AI-powered quiz generation** — type "Generate a quiz on [subject]" for real questions
- **Quiz from notes** — generates questions based on your saved notes
- Smart subject detection from natural language
- Quick action suggestions
- Generated quiz history
- Voice input simulation (mic button)
- Subject-specific quiz generation (8 subjects supported)

### 📊 Analytics
- Comprehensive study insights dashboard
- Monthly trends with animated bar charts
- Subject performance comparisons
- Weekly focus score breakdown
- Problem-solving statistics
- Quiz history table with filtering
- **AI-powered insights** for improvement
- Monthly goal tracking
- Contribution heatmap

### 👤 Profile
- User profile with avatar, level, and stats
- Skill levels by subject
- Activity timeline
- Achievement showcase
- **Full settings panel** — theme toggle (dark/light), sound effects, volume control, keyboard shortcuts, notifications, privacy, study preferences, account management
- Connected accounts management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Fonts** | Inter, JetBrains Mono (via next/font) |
| **Storage** | Local Storage (client-side persistence) |
| **Sound** | Web Audio API (ambient soundscapes) |
| **Theme** | Custom React Context (dark/light) |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/palshah112007/StudySprint.git
cd StudySprint

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start the dev server (http://localhost:3000)
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Lint / Type Check

```bash
npm run lint
```

---

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (theme, nav, fonts)
│   ├── globals.css               # Global styles, Tailwind
│   ├── dashboard/                # Main dashboard
│   ├── focus-room/               # Pomodoro timer & ambiance
│   ├── quiz/                     # Quiz center
│   ├── flashcards/               # Spaced repetition flashcards
│   ├── notes/                    # Study notes
│   ├── tasks/                    # Task management
│   ├── gamification/             # XP, achievements, leaderboards
│   ├── social/                   # Community & friends
│   ├── ai-assistant/             # AI quiz generator & assistant
│   ├── analytics/                # Study insights & charts
│   ├── profile/                  # User profile & settings
│   └── admin/                    # Admin panel
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Card.tsx, Button.tsx, Badge.tsx
│   │   ├── Modal.tsx, Avatar.tsx, ProgressBar.tsx
│   │   ├── AnimatedCounter.tsx, ContributionHeatmap.tsx
│   │   ├── ProblemsChart.tsx, KeyboardShortcuts.tsx
│   │   ├── AuthModal.tsx, Toaster.tsx, ClientInit.tsx
│   ├── landing/                  # Landing page sections
│   │   ├── HeroSection, FeaturesSection, StatsSection
│   │   ├── GamificationSection, TestimonialsSection
│   │   ├── PricingSection, FAQSection, Footer
│   └── layout/
│       └── Navigation.tsx        # App navigation
├── lib/
│   ├── utils.ts                  # XP/level system, achievements data
│   ├── persistence.ts            # Local storage CRUD
│   ├── quiz-generator.ts         # AI quiz generation logic
│   ├── useSound.ts               # Sound effects hook
│   ├── theme.tsx                 # Theme context provider
│   └── useToast.ts               # Toast notification hook
```

---

## 🧩 Git Workflow

This project follows **Git Flow**:

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/*` | New features (branched from `develop`) |
| `release/*` | Release preparation |
| `hotfix/*` | Urgent production fixes |

See full documentation in the project.

---

## 📝 License

Private project — All rights reserved.

---

<div align="center">
  Built with ❤️ for students who want to study smarter.
</div>
