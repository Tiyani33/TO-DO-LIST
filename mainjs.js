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
        if (!response.ok) throw new Error('Failed to fetch tasks');
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
        error.style.display = "block";
        error.textContent = "Failed to load tasks. Please refresh the page.";
    }
};

const addTaskToDOM = (task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.dataset.id = task._id || task.id; // Handle both _id and id
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
    tasksContainer.appendChild(taskElement);
};

const addTask = async () => {
    const taskName = newTaskInput.value.trim();
    error.style.display = "none";
    
    if (!taskName) {
        error.style.display = "block";
        error.textContent = "Please enter a task name";
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
        
        if (!response.ok) throw new Error('Failed to add task');
        
        const newTask = await response.json();
        addTaskToDOM(newTask);
        taskCount++;
        displayCounts();
        newTaskInput.value = '';
    } catch (err) {
        console.error('Error adding task:', err);
        error.style.display = "block";
        error.textContent = "Failed to add task. Please try again.";
    }
};

const toggleTaskComplete = async (taskId, completed) => {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });

        // ... (previous code remains the same until toggleTaskComplete function)

const toggleTaskComplete = async (taskId, completed) => {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        if (completed) {
            completedCount++;
            triggerConfetti(); // Add confetti when task is completed
        } else {
            completedCount--;
        }
        displayCounts();
    } catch (err) {
        console.error('Error updating task:', err);
        error.style.display = "block";
        error.textContent = "Failed to update task status. Please try again.";
    }
};

// Confetti function
const triggerConfetti = () => {
    const defaults = {
        spread: 360,
        ticks: 70,
        gravity: 0,
        decay: 0.95,
        startVelocity: 30,
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
        origin: { x: 0.5, y: 0.5 }
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["circle", "square"]
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"]
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
};

// ... (rest of the code remains the same)
        
        if (!response.ok) throw new Error('Failed to update task');
        
        if (completed) {
            completedCount++;
        } else {
            completedCount--;
        }
        displayCounts();
    } catch (err) {
        console.error('Error updating task:', err);
        error.style.display = "block";
        error.textContent = "Failed to update task status. Please try again.";
    }
};

const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
        if (!taskElement) throw new Error('Task element not found');
        
        const wasCompleted = taskElement.querySelector('.task-check').checked;
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        taskCount--;
        if (wasCompleted) {
            completedCount--;
        }
        taskElement.remove();
        displayCounts();
    } catch (err) {
        console.error('Error deleting task:', err);
        error.style.display = "block";
        error.textContent = "Failed to delete task. Please try again.";
    }
};

const editTask = async (taskId) => {
    const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
    if (!taskElement) return;
    
    const taskNameElement = taskElement.querySelector('.taskName');
    const currentName = taskNameElement.textContent;
    const newName = prompt('Edit task:', currentName);
    
    if (!newName || newName.trim() === '' || newName === currentName) return;
    
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName.trim() })
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        taskNameElement.textContent = newName.trim();
    } catch (err) {
        console.error('Error updating task:', err);
        error.style.display = "block";
        error.textContent = "Failed to update task. Please try again.";
    }
};

// Event Delegation for dynamic elements
tasksContainer.addEventListener('click', (e) => {
    const target = e.target;
    const taskElement = target.closest('.task');
    
    if (!taskElement) return;
    
    const taskId = taskElement.dataset.id;
    
    if (target.classList.contains('delete') || target.closest('.delete')) {
        deleteTask(taskId);
    } 
    else if (target.classList.contains('edit') || target.closest('.edit')) {
        editTask(taskId);
    }
});

tasksContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-check')) {
        const taskElement = e.target.closest('.task');
        const taskId = taskElement.dataset.id;
        toggleTaskComplete(taskId, e.target.checked);
    }
});

// Initialize the app
addBtn.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

fetchTasks();