const express = require('express');
const app = express();
app.use(express.json());

let todos = [
  { id: 1, task: "Learn CRUD", completed: false },
  { id: 2, task: "Build API", completed: true }
];
let nextId = 3;

// GET all
app.get('/todos', (req, res) => {
  res.json(todos);
});

// TASK 1: GET /todos/:id (single read)
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.json(todo);
});

// TASK 3 BONUS: GET /todos/active (filter !completed)
// IMPORTANT: Put this BEFORE /:id route or Express will think "active" is an id
// If you already defined :id above, keep this above it.
app.get('/todos/active', (req, res) => {
  const active = todos.filter(t => !t.completed);
  res.json(active);
});

// TASK 2: POST with validation
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;
  
  // Validation: POST requires "task" field
  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "\"task\" field is required" });
  }
  
  const newTodo = {
    id: nextId++,
    task: task.trim(),
    completed: completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  
  const { task, completed } = req.body;
  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;
  
  res.json(todo);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });
  
  todos.splice(index, 1);
  res.json({ message: "Deleted" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;