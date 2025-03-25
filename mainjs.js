const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value"); // Fixed selector (added dot for class)
let taskCount = 0;

const displayCount = (taskCount) => {
    countValue.innerText = taskCount;
};

const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        const tasks = await response.json();
        tasksContainer.innerHTML = ''; // Clear existing tasks
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
        taskCount = tasks.length;
        displayCount(taskCount);
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
    tasksContainer.appendChild(taskElement);

    // Add event listeners for the new task
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
        displayCount(taskCount);
        newTaskInput.value = ''; // Clear input
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
        fetchTasks(); // Refresh the task list
    } catch (err) {
        console.error('Error updating task:', err);
    }
};

const deleteTask = async (taskId) => {
    try {
        await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        taskCount--;
        displayCount(taskCount);
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

