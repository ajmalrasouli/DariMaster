# DariMaster - Dari Language Learning App

DariMaster is a web application designed to help users learn and practice Dari vocabulary through interactive study sessions and organized word groups.

## Features

- 📚 Organized vocabulary groups (Basic Greetings, Family Members, Common Verbs, Numbers)
- 🎯 Interactive study sessions with flashcard-style learning
- 📊 Progress tracking and statistics
- 🔄 Spaced repetition learning system
- 📱 Responsive design for desktop and mobile

## Tech Stack

- Frontend:
  - React with TypeScript
  - Wouter for routing
  - TanStack Query for data fetching
  - Tailwind CSS for styling
  - Shadcn UI components

- Backend:
  - Node.js with Express
  - SQLite database with better-sqlite3
  - TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ajmalrasouli/darimasterlan.git
cd darimasterlan
```

2. Install dependencies:

bash
npm install


3. Set up the database:

bash
npm run db:setup


4. Start the development server:

bash
npm run dev



The app will be available at `http://localhost:5173`

## Project Structure



## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run db:setup` - Initialize and seed the database
- `npm run db:check` - Check database contents
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Database Schema

- `words` - Stores vocabulary words with translations and examples
- `word_groups` - Categories for organizing words
- `words_to_groups` - Maps words to their groups
- `study_sessions` - Tracks study sessions
- `word_review_items` - Records word review results

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run db:setup` - Initialize and seed the database
- `npm run db:check` - Check database contents
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Database Schema

- `words` - Stores vocabulary words with translations and examples
- `word_groups` - Categories for organizing words
- `words_to_groups` - Maps words to their groups
- `study_sessions` - Tracks study sessions
- `word_review_items` - Records word review results

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.