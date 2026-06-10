# 🚀 StudySprint

A modern study productivity app built with Next.js to help students stay organized, focused, and motivated.

## 📋 Git Workflow

This project follows **Git Flow** with the following branch structure:

### Main Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Only merged into from `develop` or `hotfix` branches. |
| `develop` | Integration branch for ongoing development. Feature branches merge here. |

### Supporting Branches

| Branch Prefix | Created From | Merges Into | Purpose |
|---------------|-------------|-------------|---------|
| `feature/*` | `develop` | `develop` | New features and non-urgent improvements |
| `release/*` | `develop` | `main` & `develop` | Release preparation (version bumps, final testing) |
| `hotfix/*` | `main` | `main` & `develop` | Urgent production fixes |

### 🧩 Feature Branches

```bash
# Start a new feature
git checkout develop
git checkout -b feature/my-feature

# Work on it, commit changes...

# Finish the feature (merge back to develop)
git checkout develop
git merge --no-ff feature/my-feature
git branch -d feature/my-feature
```

### 🚢 Release Branches

```bash
# Create a release
git checkout develop
git checkout -b release/v1.0.0

# Finalize (merge to main and develop)
git checkout main
git merge --no-ff release/v1.0.0
git tag v1.0.0
git checkout develop
git merge --no-ff release/v1.0.0
git branch -d release/v1.0.0
```

### 🔥 Hotfix Branches

```bash
# Create a hotfix from main
git checkout main
git checkout -b hotfix/critical-fix

# After fix, merge to both
git checkout main
git merge --no-ff hotfix/critical-fix
git tag v1.0.1
git checkout develop
git merge --no-ff hotfix/critical-fix
git branch -d hotfix/critical-fix
```

---

### Quick Start

```bash
npm install
npm run dev
```
