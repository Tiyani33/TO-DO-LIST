const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");
let taskCount = 0;

// Load tasks from localStorage when the page is loaded
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.name, task.completed);
        tasksContainer.appendChild(taskElement);
        taskCount++;
    });
    displayCount(taskCount);
};

// Save tasks to localStorage
const saveTasks = () => {
    const tasks = [];
    const taskElements = tasksContainer.querySelectorAll(".task");
    taskElements.forEach(taskElement => {
        const taskName = taskElement.querySelector(".taskName").innerText;
        const taskCompleted = taskElement.querySelector(".task-check").checked;
        tasks.push({ name: taskName, completed: taskCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Create a task element
const createTaskElement = (taskName, completed = false) => {
    const task = `
        <div class="task">
            <input type="checkbox" class="task-check" ${completed ? 'checked' : ''}>
            <span class="taskName ${completed ? 'completed' : ''}">${taskName}</span>
            <button class="edit">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = task;
    return tempDiv.firstElementChild;
};

// Display task count
const displayCount = (taskCount) => {
    countValue.innerText = taskCount;
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

    const taskElement = createTaskElement(taskName);
    tasksContainer.appendChild(taskElement);
    taskCount++;
    displayCount(taskCount);
    newTaskInput.value = "";

    saveTasks();  // Save updated tasks to localStorage
};

// Delete task
const deleteTask = (taskElement) => {
    taskElement.remove();
    taskCount--;
    displayCount(taskCount);
    saveTasks();  // Save updated tasks to localStorage
};

// Edit task
const editTask = (taskElement) => {
    newTaskInput.value = taskElement.querySelector(".taskName").innerText;
    deleteTask(taskElement);  // Remove the task from the list
};

// Toggle task completion (checkbox)
const toggleTaskCompletion = (taskElement, isChecked) => {
    taskElement.querySelector(".taskName").classList.toggle("completed", isChecked);
    taskCount += isChecked ? -1 : 1;  // Decrease or increase task count based on completion state
    displayCount(taskCount);
    saveTasks();  // Save updated tasks to localStorage
};

// Event delegation for task actions
tasksContainer.addEventListener("click", (event) => {
    const taskElement = event.target.closest(".task");

    if (!taskElement) return; // Ensure we have a valid task element

    if (event.target.classList.contains("delete") || event.target.closest(".delete")) {
        deleteTask(taskElement);
    }

    if (event.target.classList.contains("edit") || event.target.closest(".edit")) {
        editTask(taskElement);
    }
});

// Event delegation for checkbox (completion toggle)
tasksContainer.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-check")) {
        const taskElement = event.target.closest(".task");
        toggleTaskCompletion(taskElement, event.target.checked);
    }
});

// Add task on button click
addBtn.addEventListener("click", addTask);

// Load tasks when the page is ready
window.addEventListener("DOMContentLoaded", loadTasks);
