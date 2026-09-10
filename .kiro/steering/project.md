# Life Dashboard — Project Steering

## Project Overview
A To-Do List Life Dashboard built as a static web app using only HTML, CSS, and Vanilla JavaScript.
No frameworks, no backend, no build tools required.

## Tech Stack
- **HTML** — page structure
- **CSS** — styling (single file: `css/style.css`)
- **Vanilla JavaScript** — all interactivity (single file: `js/app.js`)
- **LocalStorage** — all data persistence (todos, links, theme, user name)

## Folder Structure
```
ToDolist/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles
├── js/
│   └── app.js          # All functionality
└── .kiro/
    └── steering/
        └── project.md  # This file
```

## Features Implemented

### MVP
- Live clock (updates every second, 12-hour format)
- Time-based greeting (Morning / Afternoon / Evening / Night)
- 25-minute Pomodoro focus timer with Start / Stop / Reset
- Browser notification when timer finishes
- To-Do List: add, edit, mark done, delete — saved to LocalStorage
- Quick Links: add/remove favorite sites with favicons — saved to LocalStorage

### Challenges (3 of 5)
1. **Light / Dark Mode** — toggle button in header, preference saved to LocalStorage
2. **Custom Name in Greeting** — user sets their name, shown as "Good Morning, Name! 👋"
3. **Prevent Duplicate Tasks** — case-insensitive check on add and edit, with shake animation

## Constraints Followed
- TC-1: HTML + CSS + Vanilla JS only (no frameworks)
- TC-2: Browser LocalStorage for all data
- TC-3: Works in Chrome, Firefox, Edge, Safari
- NFR-1: Clean minimal interface, no setup required
- NFR-2: Fast load, responsive UI
- NFR-3: Dark/light theme, clear visual hierarchy

## Built With
Kiro AI-powered IDE — CodingCamp, September 2026
Author: Rayken Pandhuwira
