const taskDescription = document.querySelector("#taskDescription");
const taskTime = document.querySelector("#taskTime");
const taskDate = document.querySelector("#taskDate");
const taskList = document.querySelector("#taskList");
const now = new Date();
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

class Task {
  constructor(name, time, date) {
    this.name = name;
    this.time = time;
    this.date = date;
    this.id = crypto.randomUUID();
  }
}

window.addEventListener("load", () => {
  const currentDate = document.querySelector("#currentDate");
  currentDate.innerText = `Today is ${now.toDateString()}`;
});

renderList(tasks, taskList);

function addTask() {
  if (
    taskDescription.value.trim() === "" ||
    taskTime.value === "" ||
    taskDate.value === ""
  ) {
    alert("Please fill all inputs.");
    return;
  } else {
    const newTask = new Task(
      taskDescription.value,
      taskTime.value,
      taskDate.value
    );
    tasks.push(newTask);
    saveToLocaleStorage(tasks);
    renderList(tasks, taskList);
    taskDescription.value = "";
    taskTime.value = "";
    taskDate.value = "";
  }
}

function renderTask(task) {
  const li = document.createElement("li");
  li.innerText = `${task.date} at ${task.time}:  ${task.name}`;
  li.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );

  //toISOString() gives the date in the format YYYY-MM-DDTHH:mm:ss.sssZ, I need YYYY-MM-DD so I use split
  if (task.date === now.toISOString().split("T")[0]) {
    li.classList.add("highlight-current-date");
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Remove";
  deleteBtn.classList.add("btn", "btn-danger");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    const filteredTasks = tasks.filter((t) => t.id !== task.id);
    tasks = filteredTasks;
    saveToLocaleStorage(tasks);
  });

  li.append(deleteBtn);

  return li;
}

function renderList(tasks, taskList) {
  taskList.innerHTML = "";

  const sortedTasks = tasks.sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA - dateTimeB;
  });

  sortedTasks.forEach((task) => {
    const listItem = renderTask(task);
    taskList.append(listItem);
  });
}

function saveToLocaleStorage(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}
