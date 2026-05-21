const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Backend deployment configuration
const FRONTEND_URLS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...
  FRONTEND_URLS,
  'http://localhost:3000',
  'https://devops-red-two.vercel.app'
])];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from origin ${origin}.`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// In-memory todo store
let todos = [];
let nextId = 1;

// Simple status message
app.get('/api/message', (req, res) => {
  res.json({ message: 'Todo List App' });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Create a todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const todo = { id: nextId++, text: text.trim(), completed: false, createdAt: Date.now() };
  todos.push(todo);
  res.status(201).json(todo);
});

// Update a todo (toggle completed or edit text)
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  const { text, completed } = req.body;
  if (typeof text === 'string') todo.text = text.trim();
  if (typeof completed === 'boolean') todo.completed = completed;

  res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });

  todos.splice(idx, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  console.log(`Using frontend origin allowlist: ${allowedOrigins.join(', ')}`);
});
