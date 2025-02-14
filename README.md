# DariMaster

A modern web application for learning Dari vocabulary through interactive study sessions and organized word groups.

![DariMaster Screenshot](screenshot.png)

## Features

- 📚 Organized vocabulary groups
  - Basic Greetings
  - Family Members
  - Common Verbs
  - Numbers
- 🎯 Interactive flashcard-style learning
- 📊 Progress tracking and statistics
- 🔄 Spaced repetition system
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS + Shadcn UI
- Vite for development and building

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- TypeScript for type safety

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v7+)

### Installation

1. Clone the repository
```bash
git clone https://github.com/ajmalrasouli/darimasterlan.git
cd darimasterlan
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run db:setup
```

4. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Project Structure
```
darimasterlan/
├── client/                 # Frontend React application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/         # Page components
│       └── lib/           # Utilities and hooks
├── server/                # Backend Express server
│   ├── db.ts             # Database configuration
│   └── routes.ts         # API endpoints
├── scripts/              # Database and utility scripts
└── shared/               # Shared TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:setup` - Initialize database
- `npm run db:check` - Verify database content
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Database Schema

- `words` - Vocabulary words with translations
- `word_groups` - Word categories
- `words_to_groups` - Word-group relationships
- `study_sessions` - Learning sessions
- `word_review_items` - Review history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT License](LICENSE) - Copyright (c) 2024 Ajmal Rasouli