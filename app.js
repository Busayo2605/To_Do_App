const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

//WINDOW LOAD
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

//DISPLAY TASKS
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  //CLEAR TASK
  tasksDiv.innerHTML = "";

  //FETCH KEYS IN LOCAL STORAGE
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    //GET VALUES
    let value = localStorage.getItem(key);
    const today = new Date();
    const currTime =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const currDate =
      today.getDate() +
      1 +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    const userDevice = navigator.userAgent;
    
    let taskInnerDiv = document.createElement("tbody");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `
        <tr>
        <td>
        <span id="taskname">${key.split("_")[1]}</span>
        </td>
        <td'>${currDate}</td>
        <td>${userDevice}</td>
        <td>${currTime}</td>

        </tr>
    
    `;

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  //EDIT TASKS
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();

      disableButtons(true);
      //update input value and remove div
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;

      updateNote = parent.id;
      //REMOVE TASK
      parent.remove();
    });
  });

  //DELETE TASK
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      //DELETE FROM LOCAL STORAGE
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

//DISABLE  EDIT  BUTTON
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//REMOVE TASK FROM LOCAL STORAGE
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

//ADD TASK TO LOCAL STORAGE
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

//ADD NEW TASK
document.querySelector("#push").addEventListener("click", () => {
  //ENABLE EDIT BUTTON
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    //STORE LOCALLY
    if (updateNote == "") {
      //NEW TASK
      updateStorage(count, newTaskInput.value, false);
    } else {
      //UPDATE TASK
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});
