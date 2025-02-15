# DariMaster Language Learning App

A modern web application for learning Dari language through interactive study activities. Part of the Free GenAI Bootcamp 2025.

## Features

### Study Activities
- **Flashcards**: Interactive flashcard-based learning with spaced repetition
  - Dari words with English translations
  - Pronunciation guides
  - Example sentences
  - Progress tracking

- **Matching Game**: Memory-style card matching game
  - Match Dari words with English translations
  - Score tracking
  - Interactive feedback

### Word Groups
- **Organized Learning**: Words grouped by categories
  - Numbers (1-20)
  - Family Members
  - Basic Phrases
  - Common Phrases

### Progress Tracking
- Study session history
- Success rate statistics
- Word mastery tracking
- Performance analytics

## Technical Stack

### Frontend
- React 18 with TypeScript
- TanStack Query for data management
- Tailwind CSS for styling
- Shadcn/ui components
- Wouter for routing

### Backend
- Node.js with Express
- SQLite database
- Better-SQLite3 for database operations
- Zod for schema validation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ajmalrasouli/free-genai-bootcamp-2025.git
cd free-genai-bootcamp-2025/projects/darimasterlan
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run setup-db
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure
```
darimasterlan/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and helpers
│   │   └── App.tsx       # Main application component
├── server/                # Backend Express server
│   ├── routes.ts         # API routes
│   ├── db.ts            # Database configuration
│   └── storage.ts       # Data access layer
├── shared/               # Shared types and schemas
└── scripts/             # Database and utility scripts
```

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run setup-db`: Initialize database
- `npm run seed`: Seed database with sample data
- `npm run check-db`: Check database integrity

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE) - Copyright (c) 2024 Ajmal Rasouli