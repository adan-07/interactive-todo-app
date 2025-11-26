// Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filter = document.getElementById('filter');
const clearCompleted = document.getElementById('clearCompleted');
const count = document.getElementById('count');

let draggedItem = null;

// Load tasks from localStorage
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(t => createTaskElement(t.text, t.completed));
    updateCount();
};

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task counter
function updateCount() {
    const total = document.querySelectorAll('#taskList li').length;
    const active = document.querySelectorAll('#taskList li:not(.completed)').length;
    count.textContent = `Total: ${total}, Active: ${active}`;
}

// Create task element
function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    if (completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = text;
    span.onclick = () => {
        li.classList.toggle('completed');
        saveTasks();
        updateCount();
        applyFilter();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
        li.remove();
        saveTasks();
        updateCount();
    };

    li.appendChild(span);
    li.appendChild(delBtn);

    // Drag & drop
    li.draggable = true;
    li.addEventListener('dragstart', () => draggedItem = li);
    li.addEventListener('dragover', e => e.preventDefault());
    li.addEventListener('drop', () => {
        taskList.insertBefore(draggedItem, li);
        saveTasks();
    });

    taskList.appendChild(li);
    updateCount();
}

// Add task
addBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (text === '') return;
    createTaskElement(text);
    taskInput.value = '';
    saveTasks();
    applyFilter();
};

// Filter tasks
filter.onchange = applyFilter;

function applyFilter() {
    const value = filter.value;
    document.querySelectorAll('#taskList li').forEach(li => {
        li.style.display = 'flex'; // default show
        if (value === 'active' && li.classList.contains('completed')) li.style.display = 'none';
        if (value === 'completed' && !li.classList.contains('completed')) li.style.display = 'none';
    });
}

// Clear completed tasks
clearCompleted.onclick = () => {
    document.querySelectorAll('#taskList li.completed').forEach(li => li.remove());
    saveTasks();
    updateCount();
};
