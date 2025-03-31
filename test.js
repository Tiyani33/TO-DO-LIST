const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const totalTasksDisplay = document.querySelector(".total-tasks"); // For total tasks count
const completedTasksDisplay = document.querySelector(".completed-tasks"); // For completed tasks count

let tasks = [];

// Load tasks from localStorage when the page is loaded
const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = savedTasks;
    renderTasks();
    updateCounters();
};

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounters();
};

// Update all counters
const updateCounters = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    totalTasksDisplay.textContent = totalTasks;
    completedTasksDisplay.textContent = completedTasks;
};

// Render all tasks to the DOM
const renderTasks = () => {
    tasksContainer.innerHTML = `
        <p id="pend-tasks">
            You have <span class="count-value">${tasks.length - tasks.filter(t => t.completed).length}</span>
            task(s) to complete.
        </p>
    `;
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.name, task.completed, task.id);
        tasksContainer.appendChild(taskElement);
    });
};

// Create a task element
const createTaskElement = (taskName, completed = false, id) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.dataset.id = id;
    taskElement.innerHTML = `
        <input type="checkbox" class="task-check" ${completed ? 'checked' : ''}>
        <span class="taskName ${completed ? 'completed' : ''}">${taskName}</span>
        <button class="edit">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    return taskElement;
};

// Add new task
const addTask = () => {
    const taskName = newTaskInput.value.trim();
    error.style.display = "none";

    if (!taskName) {
        setTimeout(() => {
            error.style.display = "block";
        }, 200);
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        name: taskName,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    newTaskInput.value = "";
};

// Delete task
const deleteTask = (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
};

// Edit task
const editTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newTaskName = prompt("Edit your task:", task.name);
    if (newTaskName !== null && newTaskName.trim() !== "") {
        task.name = newTaskName.trim();
        saveTasks();
        renderTasks();
    }
};

// Toggle task completion
const toggleTaskCompletion = (taskId, isChecked) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = isChecked;
        saveTasks();
        renderTasks();
    }
};

// Event delegation for task actions
tasksContainer.addEventListener("click", (event) => {
    const taskElement = event.target.closest(".task");
    if (!taskElement) return;

    const taskId = taskElement.dataset.id;

    if (event.target.classList.contains("delete") || event.target.closest(".delete")) {
        deleteTask(taskId);
    }

    if (event.target.classList.contains("edit") || event.target.closest(".edit")) {
        editTask(taskId);
    }
});

// Event delegation for checkbox (completion toggle)
tasksContainer.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-check")) {
        const taskElement = event.target.closest(".task");
        toggleTaskCompletion(taskElement.dataset.id, event.target.checked);
    }
});

// Add task on button click
addBtn.addEventListener("click", addTask);

// Add task on Enter key press
newTaskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks when the page is ready
window.addEventListener("DOMContentLoaded", loadTasks);