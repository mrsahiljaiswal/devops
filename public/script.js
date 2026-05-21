// Todo app front-end logic
// Uses centralized API base URL configuration from public/config.js
const API_URL = window.APP_CONFIG?.apiBaseUrl || 'https://devops-rkyj.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    loadMessage();
    fetchTodos();
});

function loadMessage() {
    fetch(`${API_URL}/api/message`)
        .then(r => r.json())
        .then(data => document.getElementById('message').textContent = data.message)
        .catch(error => {
            console.error('Failed to load message:', error);
            document.getElementById('message').textContent = 'Todo List';
        });
}

async function fetchTodos() {
    try {
        const res = await fetch(`${API_URL}/api/todos`);
        if (!res.ok) throw new Error(`GET /api/todos failed: ${res.status}`);
        const todos = await res.json();
        renderTodos(todos);
    } catch (err) {
        console.error('Failed to load todos:', err);
        document.getElementById('todoList').innerHTML = '<li class="todo-item error">Unable to load todos</li>';
    }
}

function renderTodos(todos) {
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

        const span = document.createElement('span');
        span.textContent = todo.text;
        if (todo.completed) span.classList.add('completed');

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.className = 'btn small';
        del.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(del);
        list.appendChild(li);
    });

    document.getElementById('count').textContent = `${todos.length} todos`;
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (!text) return;

    try {
        const res = await fetch(`${API_URL}/api/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (res.ok) {
            input.value = '';
            fetchTodos();
        } else {
            const err = await res.json();
            alert(err.error || 'Failed to add todo');
            console.error('Add todo error:', err);
        }
    } catch (e) {
        console.error('Error adding todo:', e);
        alert('Unable to add todo. Check your network connection.');
    }
}

async function toggleTodo(id, completed) {
    try {
        const res = await fetch(`${API_URL}/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        if (!res.ok) {
            throw new Error(`PUT /api/todos/${id} failed: ${res.status}`);
        }

        fetchTodos();
    } catch (e) {
        console.error('Error updating todo:', e);
        alert('Unable to update todo. Check your network connection.');
    }
}

async function deleteTodo(id) {
    if (!confirm('Delete this todo?')) return;
    try {
        const res = await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) {
            throw new Error(`DELETE /api/todos/${id} failed: ${res.status}`);
        }
        fetchTodos();
    } catch (e) {
        console.error('Error deleting todo:', e);
        alert('Unable to delete todo. Check your network connection.');
    }
}

// Enter to add
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && document.getElementById('todoInput') === document.activeElement) {
        addTodo();
    }
});
