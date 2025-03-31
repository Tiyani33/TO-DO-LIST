const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const pendTasksCount = document.querySelector(".count-value"); // Pending tasks count
const totalTasksCount = document.querySelector(".total-tasks"); // Total tasks in footer
const completedTasksCount = document.querySelector(".completed-tasks"); // Completed tasks in footer

let taskCount = 0;
let completedCount = 0;

const displayCounts = () => {
    pendTasksCount.innerText = taskCount - completedCount; // Pending = total - completed
    totalTasksCount.innerText = taskCount;
    completedTasksCount.innerText = completedCount;
};

const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        const tasks = await response.json();
        
        // Clear existing tasks but keep the "You have X tasks" paragraph
        while (tasksContainer.children.length > 1) {
            tasksContainer.removeChild(tasksContainer.lastChild);
        }
        
        taskCount = tasks.length;
        completedCount = tasks.filter(task => task.completed).length;
        
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
        
        displayCounts();
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }
};

const addTaskToDOM = (task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.dataset.id = task._id;
    taskElement.innerHTML = `
        <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''}>
        <span class="taskName ${task.completed ? 'completed' : ''}">${task.name}</span>
        <button class="edit">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    // Insert after the pending tasks paragraph
    tasksContainer.appendChild(taskElement);

    // Add event listeners
    const checkbox = taskElement.querySelector('.task-check');
    const deleteBtn = taskElement.querySelector('.delete');
    const editBtn = taskElement.querySelector('.edit');

    checkbox.addEventListener('change', () => toggleTaskComplete(task._id, checkbox.checked));
    deleteBtn.addEventListener('click', () => deleteTask(task._id));
    editBtn.addEventListener('click', () => editTask(task._id));
};

const addTask = async () => {
    const taskName = newTaskInput.value.trim();
    error.style.display = "none";
    
    if (!taskName) {
        setTimeout(() => {
            error.style.display = "block";
        }, 200);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: taskName })
        });
        const newTask = await response.json();
        addTaskToDOM(newTask);
        taskCount++;
        displayCounts();
        newTaskInput.value = '';
    } catch (err) {
        console.error('Error adding task:', err);
    }
};

const toggleTaskComplete = async (taskId, completed) => {
    try {
        await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });
        
        if (completed) {
            completedCount++;
        } else {
            completedCount--;
        }
        displayCounts();
    } catch (err) {
        console.error('Error updating task:', err);
    }
};

const deleteTask = async (taskId) => {
    try {
        const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
        const wasCompleted = taskElement.querySelector('.task-check').checked;
        
        await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        taskCount--;
        if (wasCompleted) {
            completedCount--;
        }
        displayCounts();
        fetchTasks(); // Refresh the task list
    } catch (err) {
        console.error('Error deleting task:', err);
    }
};

const editTask = (taskId) => {
    const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
    const taskNameElement = taskElement.querySelector('.taskName');
    const newName = prompt('Edit task:', taskNameElement.textContent);
    
    if (newName && newName.trim() !== '') {
        fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName.trim() })
        })
        .then(() => fetchTasks())
        .catch(err => console.error('Error updating task:', err));
    }
};

// Initialize the app
addBtn.addEventListener("click", addTask);
fetchTasks();