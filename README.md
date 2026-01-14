# GAJRAJAH CRM

A modern, enterprise-grade CRM prototype built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: JWT-based login with token management
- 📊 **Dashboard**: Real-time stats with auto-updating values
- 📈 **Charts**: Interactive pie and bar charts for data visualization
- 🎨 **Modern UI**: Clean, professional design inspired by Zoho and HubSpot
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🔒 **Protected Routes**: Secure navigation with authentication guards

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:6061`

### Installation

```bash
# Install dependencies
npm install

# Start development server (runs on port 6060)
npm run dev

# Build for production
npm run build
```

### Default Login Credentials

- **Email**: social@gajrajah.com
- **Password**: gajrajah@123

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard widgets and charts
│   └── layout/        # Layout components (Sidebar, TopNav)
├── context/           # React context providers
├── pages/             # Page components
├── services/          # API services
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component
```

## Features Overview

### Login Page
- Clean, centered login form
- Real-time validation
- Loading states
- Error handling
- Responsive design

### Dashboard
- Collapsible sidebar navigation
- Global search bar
- Notification bell with badge
- User profile dropdown
- Auto-updating stats cards (8-10 second intervals)
- Interactive charts (Lead Sources, Sales Funnel)
- Inventory overview

### Navigation Menu
- Dashboard
- Leads
- Projects
- Site Visits
- Bookings
- Inventory
- Settings

## API Integration

The app connects to a backend API at `http://localhost:6061`:

- **POST /login**: Authentication endpoint
  - Request: `{ email, password }`
  - Response: `{ token, user }`

## License

© 2025 GAJRAJAH CRM. All rights reserved.
