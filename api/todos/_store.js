let todos = [];
let nextId = 1;

function getTodos() {
  return todos;
}

function addTodo(text) {
  const todo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
  todos.push(todo);
  return todo;
}

function findTodo(id) {
  return todos.find(todo => todo.id === id);
}

function updateTodo(id, updates) {
  const todo = findTodo(id);
  if (!todo) return null;
  if (typeof updates.text === 'string') {
    todo.text = updates.text.trim();
  }
  if (typeof updates.completed === 'boolean') {
    todo.completed = updates.completed;
  }
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

module.exports = {
  getTodos,
  addTodo,
  findTodo,
  updateTodo,
  deleteTodo,
};
