# Cessate

A mobile-first PWA designed to help users track and overcome habits like smoking or vaping. Built with Firebase, Zustand, and React.

[Visit Website](hau5pro.github.io/cessate/)

## 🚀 Tech Stack

| Purpose            | Tech               |
| ------------------ | ------------------ |
| Framework          | React + Vite       |
| State Management   | Zustand            |
| Authentication     | Firebase Auth      |
| Database & Storage | Firebase Firestore |
| UI Components      | MUI                |
| Animation          | Framer Motion      |
| Charts             | Recharts           |
| Date Handling      | Dayjs              |

## 📦 Installation

```bash
npm install
```

## 🧪 Run Dev Environment

```bash
npm run dev
```

## 🌐 PWA Support

- Optimized for mobile use
- Can be installed to home screen
- Scroll and view transitions designed with mobile experience in mind

## 🔐 Authentication

- Firebase Auth (Google sign-in supported)
- Auth state is stored in Zustand and persists across sessions

## 📊 Features

- 🧭 **Session Tracker**: Start, end, and log cessation sessions
- ⏳ **Session History**: Review full session history with infinite scroll
- 📉 **Stats Dashboard**: Daily counts, average session gaps, progress over time
- 🧹 **Data Deletion**: Full user data removal with progress feedback
- ⚡ **Fast Startup**: 480ms load, 99 performance score on PageSpeed insights. 100 on accessibility, best practices, SEO

## 🗂 Directory Overview

```txt
/src
  /components        → Shared UI components
  /features          → Feature-specific logic (sessions, history, stats)
  /layouts           → App layouts
  /lib               → Configurations and 3rd party wrappers (firebase, dayjs)
  /pages             → Base route page views
  /services          → Firebase and app service logic
  /store             → Zustand stores
  /theme             → Shared theme styles and variables for palettes and typogrpahy
  /utils             → Shared utility functions and contstants
```

## 📅 Timezone Handling

- All session and stat data is localized to the user's timezone using Dayjs
- UTC keys are avoided for daily summaries to ensure correct date alignment

## 🧪 Testing

_TBD_
