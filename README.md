# 🚀 SprintStudy

> **An AI-powered gamified study operating system** — Focus sessions, adaptive quizzes, spaced-repetition flashcards, progress analytics, and a thriving study community.

<div align="center">
  <a href="https://studysprint.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpalshah112007%2FStudySprint">
    <img src="https://img.shields.io/badge/Deploy%20to%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy to Vercel" />
  </a>
</div>

---

## 📸 Screenshots

> *Screenshots coming soon*

| Dashboard | Focus Room | Quiz Center |
|-----------|------------|-------------|
| `[Preview]` | `[Preview]` | `[Preview]` |

| Flashcards | Gamification | Analytics |
|------------|--------------|-----------|
| `[Preview]` | `[Preview]` | `[Preview]` |

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
- Animated floating particles and gradient orbs
- Session statistics tracking
- Fullscreen mode for distraction-free focus

### 🧠 Quiz Center
- **10 built-in quiz sets** across Mathematics, Physics, Computer Science, Biology, Chemistry, and Literature
- **AI-generated quizzes** via OpenRouter (Gemini 2.0 Flash)
- Real-time timer with visual urgency indicators
- Detailed answer explanations
- Scoring with animated circular results
- Question review after completion
- History tracking with XP rewards

### 📚 Flashcards
- **Spaced repetition** system with box levels (1-5)
- 3 pre-loaded decks
- Flip animation with spring physics
- "Know It / Don't Know" study flow
- Keyboard shortcuts (Space to flip, arrow keys to navigate)
- **AI-powered card generation** from notes
- Mastery progress tracking

### 📝 Study Notes
- Create, edit, search, and organize notes by subject
- **Pin/unpin** important notes
- Color-coded subjects with tag system
- **AI summarization** and **quiz generation from notes**

### ✅ Tasks & Deadlines
- Task management with **priority levels** (Low, Medium, High, Urgent)
- **Due date tracking** with overdue warnings
- Subject and category filtering
- Completion tracking with XP rewards

### 🏆 Gamification
- **XP & Level system** with 6 ranks (Bronze → Legend)
- **12 achievements** with unlock animations and confetti
- **5 daily missions** with claimable rewards
- **3 weekly challenges** with XP bonuses
- **Skill trees** — Focus Mastery, Quiz Champion, Social Butterfly
- **Global leaderboard** with competitor profiles

### 👥 Community
- Study groups with member counts and active status
- Friends list with online/offline status
- Live activity feed
- **Live study rooms** — real-time virtual study sessions
- Weekly challenges with prizes

### 🤖 AI Assistant
- **AI-powered quiz generation** — type "Generate a quiz on [subject]" for real questions
- **Quiz from notes** — generates questions based on your saved notes
- **Streaming chat** responses via OpenRouter API
- Smart subject detection from natural language
- Quick action suggestions

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
| **Fonts** | Inter, Geist, JetBrains Mono (via next/font) |
| **AI** | OpenRouter (Gemini 2.0 Flash via OpenAI SDK) |
| **Analytics** | @vercel/analytics, @vercel/speed-insights |
| **Storage** | Local Storage (client-side persistence) |
| **Sound** | Web Audio API (ambient soundscapes) |
| **SEO** | Next.js Metadata API, sitemap.xml, robots.txt, OG images |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **pnpm**, **npm**, or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/palshah112007/StudySprint.git
cd StudySprint

# Install dependencies
pnpm install
# or
npm install
```

### Environment Variables

```bash
# Copy the template
cp .env.example .env.local

# Add your OpenRouter API key and any other provider keys you have
# Get a free OpenRouter key at https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROK_API_KEY=your_grok_api_key_here
XAI_API_KEY=your_xai_api_key_here
XAI_MODEL=grok-4.3
NVIDIA_API_KEY=your_nvidia_api_key_here
NVIDIA_MODEL=your_nvidia_model_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
AI_PROVIDER=openrouter
```

### Development

```bash
# Start the dev server with Turbopack (http://localhost:3000)
pnpm dev
```

### Build & Production

```bash
# Type check
pnpm run type-check

# Build for production
pnpm run build

# Start production server
pnpm run start
```

### Lint & Check

```bash
# Run all checks
pnpm run check

# Or individually:
pnpm run lint
pnpm run type-check
```

---

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (theme, nav, fonts, analytics)
│   ├── globals.css               # Global styles, Tailwind
│   ├── sitemap.ts                # SEO sitemap
│   ├── robots.ts                 # Robots.txt config
│   ├── opengraph-image.tsx       # OG image for social sharing
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
│   │   ├── ChartSkeleton.tsx, ContributionHeatmap.tsx
│   │   ├── ProblemsChart.tsx, KeyboardShortcuts.tsx, XPToast.tsx
│   │   ├── AuthModal.tsx, Toaster.tsx, ClientInit.tsx
│   ├── landing/                  # Landing page sections
│   └── layout/
│       └── Navigation.tsx        # App navigation
├── lib/
│   ├── utils.ts                  # XP/level system, achievements data
│   ├── persistence.ts            # Local storage CRUD
│   ├── quiz-generator.ts         # AI quiz generation logic
│   ├── useSound.ts               # Sound effects hook
│   ├── theme.tsx                 # Theme context provider
│   └── useToast.ts               # Toast notification hook
└── api/
    └── ai/                       # AI API routes (OpenRouter)
        ├── chat/route.ts         # Streaming chat
        ├── quiz/route.ts         # Quiz generation
        ├── flashcards/route.ts   # Flashcard generation
        ├── summarize/route.ts    # Note summarization
        └── generate-quiz/route.ts# Legacy quiz generation
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

---

## 🚀 Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpalshah112007%2FStudySprint)

1. Click the **Deploy** button above
2. Connect your GitHub repository
3. Set the environment variable:
   - `OPENROUTER_API_KEY` — your OpenRouter API key
4. Deploy! 🎉

---

## 📝 License

Private project — All rights reserved.

---

<div align="center">
  Built with ❤️ for students who want to study smarter.
</div>
