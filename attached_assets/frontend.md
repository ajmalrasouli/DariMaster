**# Frontend Technical Specifications (Dari Language Support)**

Pages
-----

### Dashboard `/dashboard`

**Purpose:** Provides a summary of learning and acts as the default page when a user visits the web app.

**Components:**

-   **Last Study Session**

    -   Shows last activity used

    -   Displays when last activity was used

    -   Summarizes incorrect vs. correct answers

    -   Provides a link to the group

-   **Study Progress**

    -   Total words studied (e.g., `3/124`)

    -   Displays mastery progress (e.g., `0%`)

-   **Quick Stats**

    -   Success rate (e.g., `80%`)

    -   Total study sessions (e.g., `4`)

    -   Total active groups (e.g., `3`)

    -   Study streak (e.g., `4 days`)

-   **Start Studying Button**

    -   Navigates to the study activities page

**Needed API Endpoints:**

-   `GET /api/dashboard/last_study_session`

-   `GET /api/dashboard/study_progress`

-   `GET /api/dashboard/quick_stats`

### Study Activities Index `/study_activities`

**Purpose:** Displays a collection of study activities with thumbnails and names to either launch or view past study sessions.

**Components:**

-   **Study Activity Card**

    -   Thumbnail of the study activity

    -   Name of the study activity

    -   Launch button to start the activity

    -   View button to see past study sessions

**Needed API Endpoints:**

-   `GET /api/study_activities`

### Study Activity Show `/study_activities/:id`

**Purpose:** Displays details of a study activity and its past study sessions.

**Components:**

-   Name of study activity

-   Thumbnail of study activity

-   Description of study activity

-   Launch button

-   **Study Activities Paginated List**

    -   ID

    -   Activity name

    -   Group name

    -   Start time

    -   End time (determined by the last `word_review_item` submitted)

    -   Number of review items

**Needed API Endpoints:**

-   `GET /api/study_activities/:id`

-   `GET /api/study_activities/:id/study_sessions`

### Study Activities Launch `/study_activities/:id/launch`

**Purpose:** Launches a study activity.

**Components:**

-   Name of study activity

-   **Launch Form**

    -   Select field for group

    -   Launch now button

**Behavior:**

-   A new tab opens with the study activity based on its URL in the database.

-   After submission, the page redirects to the study session show page.

**Needed API Endpoints:**

-   `POST /api/study_activities`

### Words Index `/words`

**Purpose:** Displays all words in the database.

**Components:**

-   **Paginated Word List**

    -   **Columns:**

        -   Dari word

        -   Pronunciation

        -   English translation

        -   Correct count

        -   Wrong count

-   Pagination (100 items per page)

-   Clicking a Dari word navigates to the word show page

**Needed API Endpoints:**

-   `GET /api/words`

### Word Show `/words/:id`

**Purpose:** Displays information about a specific word.

**Components:**

-   Dari word

-   Pronunciation

-   English translation

-   **Study Statistics:**

    -   Correct count

    -   Wrong count

-   **Word Groups:**

    -   Displays a series of group tags

    -   Clicking a group name navigates to the group show page

**Needed API Endpoints:**

-   `GET /api/words/:id`

### Word Groups Index `/groups`

**Purpose:** Displays a list of word groups in the database.

**Components:**

-   **Paginated Group List**

    -   **Columns:**

        -   Group name

        -   Word count

-   Clicking a group name navigates to the group show page

**Needed API Endpoints:**

-   `GET /api/groups`

### Group Show `/groups/:id`

**Purpose:** Displays information about a specific group.

**Components:**

-   Group name

-   **Group Statistics:**

    -   Total word count

-   **Words in Group** (Paginated List of Words)

    -   Reuses the same component as the Words Index page

-   **Study Sessions** (Paginated List of Study Sessions)

    -   Reuses the same component as the Study Sessions Index page

**Needed API Endpoints:**

-   `GET /api/groups/:id` (for name and group stats)

-   `GET /api/groups/:id/words`

-   `GET /api/groups/:id/study_sessions`

### Study Sessions Index `/study_sessions`

**Purpose:** Displays a list of study sessions in the database.

**Components:**

-   **Paginated Study Session List**

    -   **Columns:**

        -   ID

        -   Activity name

        -   Group name

        -   Start time

        -   End time

        -   Number of review items

-   Clicking the study session ID navigates to the study session show page

**Needed API Endpoints:**

-   `GET /api/study_sessions`

### Study Session Show `/study_sessions/:id`

**Purpose:** Displays information about a specific study session.

**Components:**

-   **Study Session Details:**

    -   Activity name

    -   Group name

    -   Start time

    -   End time

    -   Number of review items

-   **Words Review Items** (Paginated List of Words)

    -   Reuses the same component as the Words Index page

**Needed API Endpoints:**

-   `GET /api/study_sessions/:id`

-   `GET /api/study_sessions/:id/words`

### Settings Page `/settings`

**Purpose:** Allows users to configure study portal settings.

**Components:**

-   **Theme Selection** (e.g., Light, Dark, System Default)

-   **Reset History Button**

    -   Deletes all study sessions and word review items

-   **Full Reset Button**

    -   Drops all tables and recreates them with seed data

**Needed API Endpoints:**

-   `POST /api/reset_history`

-   `POST /api/full_reset`