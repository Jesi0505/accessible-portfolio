/* =========================================
   TASK 3 - JAVASCRIPT TO-DO APPLICATION
   ========================================= */

// ---------- APPLICATION STATE ----------

let tasks = JSON.parse(
    localStorage.getItem("jesimaTasks")
) || [];

let currentFilter = "all";


// ---------- DOM ELEMENTS ----------

const todoForm = document.getElementById("todo-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");

const emptyMessage = document.getElementById("empty-message");

const filterButtons =
    document.querySelector(".filter-buttons");


// ---------- SAVE DATA ----------

function saveTasks() {

    localStorage.setItem(
        "jesimaTasks",
        JSON.stringify(tasks)
    );

}


// ---------- CREATE TASK ----------

function createTask(text) {

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

}


// ---------- READ / DISPLAY TASKS ----------

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });


    filteredTasks.forEach(task => {

        const listItem =
            document.createElement("li");

        listItem.className = "task-item";

        listItem.dataset.id = task.id;


        const taskContent =
            document.createElement("div");

        taskContent.className = "task-content";


        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as complete`
        );


        const taskText =
            document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        if (task.completed) {

            taskText.classList.add("completed");

        }


        taskContent.appendChild(checkbox);

        taskContent.appendChild(taskText);


        const actions =
            document.createElement("div");

        actions.className = "task-actions";


        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.className = "edit-task";

        editButton.dataset.action = "edit";

        editButton.textContent = "Edit";

        editButton.setAttribute(
            "aria-label",
            `Edit ${task.text}`
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "delete-task";

        deleteButton.dataset.action = "delete";

        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );


        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        listItem.appendChild(taskContent);

        listItem.appendChild(actions);


        taskList.appendChild(listItem);

    });


    updateTaskCount(filteredTasks.length);

    updateEmptyMessage(filteredTasks.length);

}


// ---------- UPDATE TASK COUNT ----------

function updateTaskCount(count) {

    taskCount.textContent =
        `${count} ${count === 1 ? "task" : "tasks"}`;

}


// ---------- EMPTY MESSAGE ----------

function updateEmptyMessage(count) {

    if (count === 0) {

        emptyMessage.hidden = false;

    } else {

        emptyMessage.hidden = true;

    }

}


// ---------- UPDATE TASK ----------

function toggleTask(taskId) {

    tasks = tasks.map(task => {

        if (task.id === taskId) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();

}


// ---------- EDIT TASK ----------

function editTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return;
    }


    const updatedText = prompt(
        "Edit your task:",
        task.text
    );


    if (
        updatedText !== null &&
        updatedText.trim() !== ""
    ) {

        task.text = updatedText.trim();

        saveTasks();

        renderTasks();

    }

}


// ---------- DELETE TASK ----------

function deleteTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );


    if (!task) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${task.text}"?`
        );


    if (!confirmed) {
        return;
    }


    tasks = tasks.filter(
        task => task.id !== taskId
    );

    saveTasks();

    renderTasks();

}


// ---------- CREATE EVENT ----------

todoForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const text =
            taskInput.value.trim();


        if (text === "") {
            return;
        }


        createTask(text);

        taskInput.value = "";

        taskInput.focus();

    }
);


// ---------- EVENT DELEGATION ----------

taskList.addEventListener(
    "click",
    function (event) {

        const listItem =
            event.target.closest(".task-item");


        if (!listItem) {
            return;
        }


        const taskId =
            Number(listItem.dataset.id);


        const action =
            event.target.dataset.action;


        if (action === "edit") {

            editTask(taskId);

        }


        if (action === "delete") {

            deleteTask(taskId);

        }

    }
);


// ---------- CHECKBOX EVENT DELEGATION ----------

taskList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
        ) {
            return;
        }


        const listItem =
            event.target.closest(".task-item");


        const taskId =
            Number(listItem.dataset.id);


        toggleTask(taskId);

    }
);


// ---------- FILTER EVENTS ----------

filterButtons.addEventListener(
    "click",
    function (event) {

        const filter =
            event.target.dataset.filter;


        if (!filter) {
            return;
        }


        currentFilter = filter;


        document
            .querySelectorAll(".filter-btn")
            .forEach(button => {

                button.classList.remove("active");

            });


        event.target.classList.add("active");


        renderTasks();

    }
);


// ---------- INITIAL RENDER ----------

renderTasks();
