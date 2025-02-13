**# Backend Server Technical Specifications (Updated for Flask & Dari Language Support)**

## Business Goal

A language-learning school wants to build a prototype learning portal that will serve three purposes:

1. **Inventory of possible vocabulary** that can be learned.
2. **Learning Record Store (LRS)** to track correct and incorrect scores in vocabulary practice.
3. **A unified launchpad** to launch different learning applications.

## Technical Requirements

- **Backend Framework:** Flask (Python)
- **Database:** SQLite3
- **API Framework:** Flask-RESTful
- **API Response Format:** JSON
- **Authentication & Authorization:** None (treated as a single user system)

## Directory Structure

```
backend_flask/
├── app/
│   ├── models/     # Data structures and database operations
│   ├── handlers/   # API handlers organized by feature (dashboard, words, groups, etc.)
│   ├── services/   # Business logic
├── db/
│   ├── migrations/
│   ├── seeds/      # Initial data population
├── migrations/
├── config.py
├── requirements.txt
└── words.db
```

## Database Schema

### `words` Table

| Column               | Type                  | Description            |
| -------------------- | --------------------- | ---------------------- |
| id                   | INTEGER (Primary Key) | Unique identifier      |
| dari\_word           | TEXT                  | Dari vocabulary word   |
| english\_translation | TEXT                  | English equivalent     |
| pronunciation        | TEXT                  | Phonetic pronunciation |
| example\_sentence    | TEXT                  | Example usage in Dari  |

### `word_groups` Table

| Column | Type                  | Description                       |
| ------ | --------------------- | --------------------------------- |
| id     | INTEGER (Primary Key) | Unique identifier                 |
| name   | TEXT                  | Group name (e.g., "Common Verbs") |

### `study_sessions` Table

| Column      | Type                  | Description                |
| ----------- | --------------------- | -------------------------- |
| id          | INTEGER (Primary Key) | Unique session identifier  |
| group\_id   | INTEGER (Foreign Key) | Associated group ID        |
| created\_at | DATETIME              | Timestamp of study session |

### `study_activities` Table

| Column             | Type                  | Description               |
| ------------------ | --------------------- | ------------------------- |
| id                 | INTEGER (Primary Key) | Unique identifier         |
| study\_session\_id | INTEGER (Foreign Key) | Links to study session    |
| group\_id          | INTEGER (Foreign Key) | Links to vocabulary group |
| created\_at        | DATETIME              | Timestamp of activity     |

### `word_review_items` Table

| Column             | Type                  | Description                             |
| ------------------ | --------------------- | --------------------------------------- |
| word\_id           | INTEGER (Foreign Key) | Word being reviewed                     |
| study\_session\_id | INTEGER (Foreign Key) | Associated study session                |
| correct            | BOOLEAN               | Whether the word was answered correctly |
| created\_at        | DATETIME              | Timestamp of review                     |

## API Endpoints

### Dashboard Endpoints

- `GET /api/dashboard/last_study_session` → Returns info on the most recent study session.
- `GET /api/dashboard/study_progress` → Returns statistics on study progress.
- `GET /api/dashboard/quick-stats` → Returns an overview of study statistics.

### Study Activity Endpoints

- `GET /api/study_activities/:id` → Get details of a study activity.
- `GET /api/study_activities/:id/study_sessions` → List study sessions related to an activity.
- `POST /api/study_activities` → Create a new study activity.

### Words Endpoints

- `GET /api/words` → Paginated list of words.
- `GET /api/words/:id` → Retrieve word details.
- `POST /api/words` → Add a new word.

### Groups Endpoints

- `GET /api/groups` → Get list of word groups.
- `GET /api/groups/:id` → Get details of a specific group.
- `GET /api/groups/:id/words` → Get words within a group.
- `GET /api/groups/:id/study_sessions` → Get study sessions related to a group.

### Study Sessions Endpoints

- `GET /api/study_sessions` → Paginated list of study sessions.
- `GET /api/study_sessions/:id` → Retrieve details of a study session.
- `GET /api/study_sessions/:id/words` → Get words reviewed in a session.
- `POST /api/reset_history` → Reset study history.
- `POST /api/full_reset` → Fully reset the system.
- `POST /api/study_sessions/:id/words/:word_id/review` → Submit a review result.

## Task Runner Tasks

### **Initialize Database**

- This task will initialize the SQLite database called `words.db`.

### **Migrate Database**

- Runs SQL migration files located in the `migrations/` folder.

### **Seed Data**

- Imports predefined JSON files into the database.
- Sample data structure:

```json
[
  {
    "dari_word": "پرداختن",
    "english_translation": "to pay",
    "pronunciation": "pardākhtan",
    "example_sentence": "من باید صورت حساب را پرداخت کنم."
  }
]
```

