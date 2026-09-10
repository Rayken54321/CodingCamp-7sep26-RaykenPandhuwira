/* ═══════════════════════════════════════════
   LIFE DASHBOARD — app.js
   ═══════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   STORAGE HELPERS
────────────────────────────────────────── */
const Storage = {
  get(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const KEYS = {
  todos: 'dashboard_todos',
  links: 'dashboard_links',
  theme: 'dashboard_theme',
  name:  'dashboard_name',
};

/* ──────────────────────────────────────────
   CHALLENGE 1 — LIGHT / DARK MODE
────────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const htmlEl      = document.documentElement;

// Load saved theme, default to dark
let currentTheme = Storage.get(KEYS.theme, 'dark');
if (typeof currentTheme !== 'string') currentTheme = 'dark';

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
  currentTheme = theme;
  Storage.set(KEYS.theme, theme);
}

themeToggle.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

applyTheme(currentTheme); // apply on load


/* ──────────────────────────────────────────
   CHALLENGE 2 — CUSTOM NAME IN GREETING
────────────────────────────────────────── */
const nameDisplayRow = document.getElementById('name-display-row');
const nameEditRow    = document.getElementById('name-edit-row');
const nameDisplay    = document.getElementById('name-display');
const nameInput      = document.getElementById('name-input');
const nameEditBtn    = document.getElementById('name-edit-btn');
const nameSaveBtn    = document.getElementById('name-save-btn');
const nameCancelBtn  = document.getElementById('name-cancel-btn');

let userName = Storage.get(KEYS.name, '');
if (typeof userName !== 'string') userName = '';

function renderName() {
  if (userName) {
    nameDisplay.textContent = userName;
    nameDisplayRow.style.display = 'flex';
    nameEditBtn.textContent = 'Edit name';
  } else {
    nameDisplay.textContent = '';
    nameDisplayRow.style.display = 'flex';
    nameEditBtn.textContent = 'Set your name';
  }
}

function openNameEdit() {
  nameInput.value = userName;
  nameEditRow.style.display = 'flex';
  nameDisplayRow.style.display = 'none';
  nameInput.focus();
}

function saveNameEdit() {
  const val = nameInput.value.trim();
  userName = val;
  Storage.set(KEYS.name, userName);
  nameEditRow.style.display = 'none';
  renderName();
  // Immediately refresh greeting with name
  updateGreeting();
}

function cancelNameEdit() {
  nameEditRow.style.display = 'none';
  renderName();
}

nameEditBtn.addEventListener('click', openNameEdit);
nameSaveBtn.addEventListener('click', saveNameEdit);
nameCancelBtn.addEventListener('click', cancelNameEdit);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveNameEdit();
  if (e.key === 'Escape') cancelNameEdit();
});

renderName(); // show on load


/* ──────────────────────────────────────────
   CLOCK & GREETING
────────────────────────────────────────── */
const clockEl = document.getElementById('clock');
const greetEl = document.getElementById('greeting');
const dateEl  = document.getElementById('current-date');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// Separated so it can be called after name change
function updateGreeting() {
  const now  = new Date();
  const h    = now.getHours();
  const base = getGreeting(h);
  // Include name if set
  greetEl.textContent = userName
    ? `${base}, ${userName}! 👋`
    : `${base}! 👋`;
}

function updateClock() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes();
  const s    = now.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;

  clockEl.textContent = `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`;
  dateEl.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  updateGreeting();
}

updateClock();
setInterval(updateClock, 1000);


/* ──────────────────────────────────────────
   FOCUS TIMER
────────────────────────────────────────── */
const POMODORO_SECONDS = 25 * 60;

const timerDisplay = document.getElementById('timer-display');
const timerLabel   = document.getElementById('timer-label');
const btnStart     = document.getElementById('timer-start');
const btnStop      = document.getElementById('timer-stop');
const btnReset     = document.getElementById('timer-reset');

let timerInterval = null;
let timeLeft      = POMODORO_SECONDS;
let timerRunning  = false;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timeLeft);
  timerDisplay.classList.remove('running', 'finished');

  if (timerRunning) {
    timerDisplay.classList.add('running');
    timerLabel.textContent = 'Focus! Stay on task…';
  } else if (timeLeft === 0) {
    timerDisplay.classList.add('finished');
    timerLabel.textContent = '🎉 Session complete! Take a break.';
  } else {
    timerLabel.textContent = 'Pomodoro Session';
  }

  btnStart.disabled = timerRunning || timeLeft === 0;
  btnStop.disabled  = !timerRunning;
}

function startTimer() {
  if (timerRunning || timeLeft === 0) return;
  timerRunning  = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft      = 0;
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning  = false;
      notifyTimerDone();
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timeLeft = POMODORO_SECONDS;
  renderTimer();
}

function notifyTimerDone() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⏱ Pomodoro Done!', {
      body: 'Great work! Time to take a short break.',
    });
  }
}

btnStart.addEventListener('click', () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  startTimer();
});
btnStop.addEventListener('click', stopTimer);
btnReset.addEventListener('click', resetTimer);

renderTimer();


/* ──────────────────────────────────────────
   TO-DO LIST  (+ Challenge 3: no duplicates)
────────────────────────────────────────── */
const todoInput      = document.getElementById('todo-input');
const todoAddBtn     = document.getElementById('todo-add');
const todoList       = document.getElementById('todo-list');
const todoEmpty      = document.getElementById('todo-empty');
const dupWarning     = document.getElementById('duplicate-warning');

// Modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalInput   = document.getElementById('modal-input');
const modalSave    = document.getElementById('modal-save');
const modalCancel  = document.getElementById('modal-cancel');

let todos         = Storage.get(KEYS.todos, []);
let editingTodoId = null;

function saveTodos() {
  Storage.set(KEYS.todos, todos);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Challenge 3: duplicate check (case-insensitive) ── */
function isDuplicate(text, excludeId = null) {
  const normalised = text.trim().toLowerCase();
  return todos.some(
    (t) => t.text.toLowerCase() === normalised && t.id !== excludeId
  );
}

function showDuplicateWarning(inputEl) {
  dupWarning.style.display = 'block';
  // Shake the input for tactile feedback
  inputEl.classList.remove('shake');
  void inputEl.offsetWidth; // reflow to restart animation
  inputEl.classList.add('shake');
  inputEl.style.borderColor = 'var(--danger)';
  setTimeout(() => {
    dupWarning.style.display = 'none';
    inputEl.style.borderColor = '';
    inputEl.classList.remove('shake');
  }, 2500);
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoEmpty.style.display = 'block';
    return;
  }
  todoEmpty.style.display = 'none';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className  = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    // Checkbox
    const check = document.createElement('input');
    check.type      = 'checkbox';
    check.className = 'todo-check';
    check.checked   = todo.done;
    check.setAttribute('aria-label', 'Mark task as done');
    check.addEventListener('change', () => toggleTodo(todo.id));

    // Text
    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className   = 'btn btn-ghost btn-icon';
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.addEventListener('click', () => openEditModal(todo.id));

    const delBtn = document.createElement('button');
    delBtn.className   = 'btn btn-danger btn-icon';
    delBtn.textContent = '🗑';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.append(editBtn, delBtn);
    li.append(check, span, actions);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  // Challenge 3: block duplicates
  if (isDuplicate(text)) {
    showDuplicateWarning(todoInput);
    return;
  }

  todos.push({ id: generateId(), text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function openEditModal(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  editingTodoId    = id;
  modalInput.value = todo.text;
  modalOverlay.classList.add('open');
  modalInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  editingTodoId    = null;
  modalInput.value = '';
}

function saveEdit() {
  const text = modalInput.value.trim();
  if (!text || !editingTodoId) return;

  // Challenge 3: block duplicate edits (exclude current task from check)
  if (isDuplicate(text, editingTodoId)) {
    showDuplicateWarning(modalInput);
    return;
  }

  const todo = todos.find((t) => t.id === editingTodoId);
  if (todo) {
    todo.text = text;
    saveTodos();
    renderTodos();
  }
  closeModal();
}

// Events
todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

modalSave.addEventListener('click', saveEdit);
modalCancel.addEventListener('click', closeModal);
modalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveEdit();
  if (e.key === 'Escape') closeModal();
});
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

renderTodos();


/* ──────────────────────────────────────────
   QUICK LINKS
────────────────────────────────────────── */
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput  = document.getElementById('link-url-input');
const linkAddBtn    = document.getElementById('link-add');
const linksGrid     = document.getElementById('links-grid');
const linksEmpty    = document.getElementById('links-empty');

let links = Storage.get(KEYS.links, [
  { id: generateId(), name: 'Google',  url: 'https://google.com' },
  { id: generateId(), name: 'YouTube', url: 'https://youtube.com' },
  { id: generateId(), name: 'GitHub',  url: 'https://github.com' },
]);

function saveLinks() {
  Storage.set(KEYS.links, links);
}

function getFaviconUrl(url) {
  try {
    const { origin } = new URL(url);
    return `${origin}/favicon.ico`;
  } catch {
    return '';
  }
}

function renderLinks() {
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksEmpty.style.display = 'block';
    return;
  }
  linksEmpty.style.display = 'none';

  links.forEach((link) => {
    const a = document.createElement('a');
    a.className = 'link-chip';
    a.href      = link.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';

    // Favicon
    const img = document.createElement('img');
    img.className = 'link-chip-favicon';
    img.src       = getFaviconUrl(link.url);
    img.alt       = '';
    img.onerror   = () => { img.style.display = 'none'; };

    // Label
    const label = document.createElement('span');
    label.textContent = link.name;

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className   = 'link-delete';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', `Remove ${link.name}`);
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      deleteLink(link.id);
    });

    a.append(img, label, delBtn);
    linksGrid.appendChild(a);
  });
}

function addLink() {
  const name = linkNameInput.value.trim();
  let   url  = linkUrlInput.value.trim();

  if (!name || !url) return;

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    new URL(url);
  } catch {
    linkUrlInput.style.borderColor = 'var(--danger)';
    linkUrlInput.focus();
    setTimeout(() => { linkUrlInput.style.borderColor = ''; }, 1500);
    return;
  }

  links.push({ id: generateId(), name, url });
  saveLinks();
  renderLinks();
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
}

function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

linkAddBtn.addEventListener('click', addLink);
linkUrlInput.addEventListener('keydown',  (e) => { if (e.key === 'Enter') addLink(); });
linkNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') linkUrlInput.focus(); });

renderLinks();
