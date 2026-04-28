# Strategic Minds — CivicAI 🏛️

**Smart Citizen-Government Bridge Platform**

CivicAI is an AI-powered civic engagement platform that bridges the gap between citizens and local government. Report issues, track resolution status, provide feedback, and navigate government services — all in one place.

## ✨ Features

- **🚨 Report Issues** — Submit civic issues with photo uploads and AI-powered categorisation  
- **📊 Status Tracker** — Track issue resolution in real-time with live status updates  
- **🗺️ Navigator** — Find nearby government offices and services on an interactive map  
- **💬 Feedback** — Share feedback and rate government services  
- **🛡️ Admin Dashboard** — Analytics dashboard for officials to manage and prioritise issues  
- **🤖 AI Confidence Badge** — AI-driven priority and category suggestions  

## 🛠️ Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Frontend    | React 19, React Router 7, Vite 8                |
| Styling     | Tailwind CSS 3                                  |
| Charts      | Chart.js + react-chartjs-2                      |
| Maps        | Leaflet + react-leaflet                         |
| Backend     | Firebase (Auth, Firestore, Storage)              |
| Utilities   | react-hot-toast, react-dropzone, react-icons    |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18  
- npm ≥ 9  
- A Firebase project (see `.env.example` for required keys)

### Installation

```bash
# Clone the repo
git clone https://github.com/srimanyuacharyah/strategic-minds.git
cd strategic-minds

# Install dependencies
npm install

# Copy environment template and fill in your Firebase credentials
cp .env.example .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
strategic-minds/
├── public/              # Static assets (favicon, icons)
├── src/
│   ├── assets/          # Images & SVGs
│   ├── components/      # Reusable UI components
│   │   ├── AIConfidenceBadge.jsx
│   │   ├── Footer.jsx
│   │   ├── IssueCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── PhotoUpload.jsx
│   │   └── StatsCounter.jsx
│   ├── config/          # Firebase configuration
│   ├── data/            # Mock data for development
│   ├── pages/           # Route-level page components
│   │   ├── Home.jsx
│   │   ├── ReportIssue.jsx
│   │   ├── StatusTracker.jsx
│   │   ├── Navigator.jsx
│   │   ├── Feedback.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/        # AI & Firebase service layers
│   ├── App.jsx          # Root component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variable template
├── index.html           # HTML shell
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── progress.md          # Development progress tracker
```

## 👥 Contributors

- [srimanyuacharyah](https://github.com/srimanyuacharyah)

## 📄 License

This project is for educational and demonstration purposes.
