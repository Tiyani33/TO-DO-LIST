const addBtn = document.querySelector
("#add-btn");
const newTaskInput = document.querySelector
("#wrapper input");
const tasksContainer = document.querySelector
("#tasks");
const error = document.getElementById
("error");
const countValue = document.querySelector
("count-value");
let taskCount = 0; 
const displayCount =(taskCount) => {
    countValue.innerText = taskCount;
};
// const addTask = () => {
//     const taskName = newTaskInput.ariaValueMax.trim();
//     error.style.display = "none";
//     if(!taskName) {
//         setTimeout(()=>{
//             error.style.display = "block";
//         }, 200);
//         return;
//     }
// }

    // const task = ' <div class="task"> 
    // <input type"checkbox" class="task-check">
    //     <span class="taskName"></span>
    //  </div> '


    const tasks = () => {
        const taskName = newTaskInput.value.trim(); // Fix here: use .value instead of .ariaValueMax
        error.style.display = "none";
    
        if (!taskName) {
            setTimeout(() => {
                error.style.display = "block";
            }, 200);
            return;
        }
    }
    
        // Fixed the HTML template and attributes
    //     const task = `
    //         <div class="task">
    //             <input type="checkbox" class="task-check">
    //             <span class="taskName">${taskName}</span>
    //             <button class="edit">
    //             <i class="fa-solid fa-pen-to-square"></i>
    //             </button>
    //             <button class="delete">
    //             <i class="fa-solid fa-trash"></i>
    //             </button>

    //         </div>`;
    //         tasksContainer.insertAdjacentElement("beforeend", task);
    // };

    // addBtn.addEventListener("click", addTask);
    const addTask = () => {
        const task = `
            <div class="task">
                <input type="checkbox" class="task-check">
                <span class="taskName">${taskName}</span>
                <button class="edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>`;
    
        const tempDiv = document.createElement('div'); // Temporary container
        tempDiv.innerHTML = task; // Set the HTML string to innerHTML
        const taskElement = tempDiv.firstElementChild; // Get the actual element
    
        tasksContainer.insertAdjacentElement("beforeend", taskElement); // Insert the element
    };
    
    // Ensure this function call is outside of any other functions or braces
    addBtn.addEventListener("click", addTask);
