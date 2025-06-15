document.addEventListener("DOMContentLoaded", function () {
  class Task {
    constructor(id, title, description, priority, category, completed = false) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.priority = priority;
      this.category = category;
      this.completed = completed;
    }
  }

  class TaskManager {
    constructor() {
      this.tasks = [];
    }

    addTask(task) {
      this.tasks.push(task);
      if (task.priority === 'high') showNotification('High priority task added!');
    }

    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id);
    }

    updateTask(id, updatedTask) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask };
        if (updatedTask.priority === 'high') showNotification('High priority task updated!');
      }
    }

    toggleComplete(id) {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        if (task.completed && task.priority === 'high') {
          showNotification('High priority task completed!');
        }
      }
    }

    getFilteredTasks(category, query) {
      return this.tasks.filter(t =>
        (category === 'All' || t.category === category) &&
        (t.title.toLowerCase().includes(query.toLowerCase()) ||
         t.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }

  const taskManager = new TaskManager();
  let editTaskId = null;

  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 4000);
  }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;

    if (!title) {
      alert('Task title cannot be empty!');
      return;
    }

    if (editTaskId) {
      taskManager.updateTask(editTaskId, { title, description, priority, category });
      editTaskId = null;
      this.querySelector('button[type="submit"]').textContent = 'Add Task';
    } else {
      const newTask = new Task(Date.now(), title, description, priority, category);
      taskManager.addTask(newTask);
    }

    this.reset();
    renderTasks();
  });

  function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const category = document.getElementById('filter-category').value;
    const query = document.getElementById('search').value;
    const tasks = taskManager.getFilteredTasks(category, query);

    tasks.forEach(task => {
      const div = document.createElement('div');
      div.className = 'task' + (task.completed ? ' completed' : '');
      div.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Category: ${task.category}</p>
        <button onclick="toggleTask(${task.id})">Complete</button>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(div);
    });
  }

  window.toggleTask = function (id) {
    taskManager.toggleComplete(id);
    renderTasks();
  };

  window.editTask = function (id) {
    const task = taskManager.tasks.find(t => t.id === id);
    if (!task) return;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('priority').value = task.priority;
    document.getElementById('category').value = task.category;
    editTaskId = id;
    document.querySelector('#task-form button[type="submit"]').textContent = 'Update Task';
  };

  window.deleteTask = function (id) {
    taskManager.deleteTask(id);
    renderTasks();
  };

  document.getElementById('filter-category').addEventListener('change', renderTasks);
  document.getElementById('search').addEventListener('input', renderTasks);

  renderTasks();
});
