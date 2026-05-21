// Todo app front-end logic
document.addEventListener('DOMContentLoaded', () => {
    loadMessage();
    fetchTodos();
});

function loadMessage() {
    fetch('/api/message')
        .then(r => r.json())
        .then(data => document.getElementById('message').textContent = data.message)
        .catch(() => document.getElementById('message').textContent = 'Todo List');
}

async function fetchTodos() {
    try {
        const res = await fetch('/api/todos');
        const todos = await res.json();
        renderTodos(todos);
    } catch (err) {
        console.error(err);
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
        const res = await fetch('/api/todos', {
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
        }
    } catch (e) {
        console.error(e);
    }
}

async function toggleTodo(id, completed) {
    try {
        await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        fetchTodos();
    } catch (e) { console.error(e); }
}

async function deleteTodo(id) {
    if (!confirm('Delete this todo?')) return;
    try {
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        fetchTodos();
    } catch (e) { console.error(e); }
}

// Enter to add
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && document.getElementById('todoInput') === document.activeElement) {
        addTodo();
    }
});
