# Kahootrix

Kahootrix is a lightweight, browser-based trivia game built with plain HTML, CSS, and JavaScript. It works without a backend, account, build process, or external database.

Players can choose from eight categories, three difficulty levels, daily and random modes, lifelines, achievements, XP, a local profile, and a browser-based leaderboard.

## Features

- Eight categories:
  - General Knowledge
  - Science
  - Technology
  - History
  - Geography
  - Sports
  - Entertainment
  - Mathematics
- 120 total questions: 15 questions per category.
- Easy, Medium, and Hard difficulty modes.
- Daily Challenge with deterministic questions for the current UTC date.
- Random Mode with questions drawn from every category.
- Ten-question quiz rounds.
- Timed questions with difficulty-based timers:
  - Easy: 20 seconds and 10 base points
  - Medium: 15 seconds and 20 base points
  - Hard: 10 seconds and 30 base points
- Hint and Fifty-Fifty lifelines.
- Time bonuses and streak bonuses.
- XP and progressive leveling.
- Local achievements.
- Local leaderboard stored in the current browser.
- Answer review after every completed quiz.
- Dark and light themes.
- Optional Web Audio feedback.
- Responsive mobile navigation.
- Keyboard shortcuts for faster play.

## Difficulty behavior

Each category contains a separate difficulty pool.

- Easy mode prioritizes Easy questions, then uses Medium and Hard questions as fallback.
- Medium mode prioritizes Medium questions, then uses Easy questions before Hard questions.
- Hard mode prioritizes Hard questions, then uses Medium questions before Easy questions.

Hard rounds are designed to avoid Easy questions with the current question distribution. Medium rounds focus on average-difficulty questions and use Easy questions to complete the round when necessary.

## Keyboard controls

While playing a quiz:

- `A`, `B`, `C`, `D`: select an answer.
- `1`, `2`, `3`, `4`: select an answer.
- `P`: pause or resume the quiz.

## Running locally

Kahootrix has no dependencies or build step.

### Option 1: Open directly

Open [index.html](./index.html) in a modern browser.

### Option 2: Use a local HTTP server

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Using a local server is recommended when testing browser storage, reload behavior, and deployment-like behavior.

## GitHub Pages deployment

1. Create or open a GitHub repository.
2. Upload the project files to the repository root:
   - `index.html`
   - `script.js`
   - `style.css`
3. Commit and push the files.
4. Open the repository's **Settings** tab.
5. Open **Pages** under **Code and automation**.
6. Select **Deploy from a branch**.
7. Choose the main branch and the root folder.
8. Save the configuration.
9. Open the generated GitHub Pages URL.

Because the project is fully static, no Node.js installation, package manager, server runtime, or build command is required for deployment.

## Project structure

```text
Kahootrix/
├── index.html    # Page structure and UI markup
├── script.js     # Question data, game logic, state, scoring, and persistence
├── style.css     # Responsive visual design and accessibility states
└── READ.ME.md    # Project documentation
```

## Data and persistence

Player data is stored locally in the browser using `localStorage` under the key:

```text
kahootrix_v1
```

Saved data includes:

- Display name
- Theme preference
- Sound preference
- XP and level
- Completed games
- Correct-answer totals
- Best streak
- High score
- Played categories
- Achievements
- Leaderboard entries
- Daily Challenge completion date

The leaderboard is local to the current browser. It is not shared between users or devices.

The application validates and normalizes stored data when it loads. Older data stored under `triviaQuest_v1` can also be read for compatibility.

## Scoring

Each correct answer awards base points based on difficulty. Correct answers can also receive a time bonus. A streak bonus is awarded after reaching a three-answer streak.

Incorrect answers reset the current streak. Timed-out questions are recorded as unanswered in the review screen.

## Accessibility and usability

The interface includes:

- Visible keyboard focus states.
- Semantic buttons and navigation landmarks.
- Responsive layouts for mobile screens.
- Larger touch targets for important controls.
- Readable contrast in both themes.
- Reduced-motion support through `prefers-reduced-motion`.
- Status messages for feedback, saved actions, and quiz results.

## Testing completed

The final updated question bank was tested through the browser interface.

### Quiz matrix

All 24 category-and-difficulty combinations passed:

| Category | Easy | Medium | Hard |
|---|---:|---:|---:|
| General Knowledge | 10/10 | 10/10 | 10/10 |
| Science | 10/10 | 10/10 | 10/10 |
| Technology | 10/10 | 10/10 | 10/10 |
| History | 10/10 | 10/10 | 10/10 |
| Geography | 10/10 | 10/10 | 10/10 |
| Sports | 10/10 | 10/10 | 10/10 |
| Entertainment | 10/10 | 10/10 | 10/10 |
| Mathematics | 10/10 | 10/10 | 10/10 |

Total verified result: 240/240 correct answers and 100% accuracy.

### Additional checks

- JavaScript syntax validation passed with `node --check script.js`.
- No editor-reported errors were found.
- Countdown behavior passed.
- Countdown cancellation during navigation passed.
- Pause and resume passed.
- Quit confirmation and Stay/Leave flows passed.
- Daily Challenge startup passed.
- Random Mode startup passed.
- Hint and Fifty-Fifty lifelines passed.
- Answer review rendering passed.
- Leaderboard filtering passed.
- Theme and sound toggles passed in both directions.
- Mobile menu navigation passed.
- Reload persistence passed.
- No browser JavaScript errors were detected during the final test pass.

## Browser support

Kahootrix is intended for modern browsers with support for:

- ES6 JavaScript
- CSS Grid and Flexbox
- `localStorage`
- Web Audio API for optional sound effects
- Canvas for confetti effects

Sound effects and confetti gracefully degrade when the browser does not support the relevant API.

## License

No license has been specified for this project yet. Add a license file before distributing or reusing the code publicly.

Hayden x Jareth Copyrights

## Screenshots

<img width="1920" height="1080" alt="Screenshot From 2026-11-24 18-01-35" src="https://github.com/user-attachments/assets/748055cc-11ab-45bb-a25b-6c3d4ecce3ef" />
<img width="1920" height="1080" alt="Screenshot From 2026-11-24 18-01-30" src="https://github.com/user-attachments/assets/f6605afe-6656-4e41-b7e2-5e7374c0137b" />
<img width="1920" height="1080" alt="Screenshot From 2026-11-24 18-01-18" src="https://github.com/user-attachments/assets/8aa2399d-b17a-4efa-b3c4-880ecf063454" />
<img width="1920" height="1080" alt="Screenshot From 2026-11-24 18-01-10" src="https://github.com/user-attachments/assets/4a8f7ef3-51d4-46dc-bec7-6b49fd7e7e80" />
