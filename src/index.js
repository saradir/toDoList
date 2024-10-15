import "./styles.css"
import {createTask, createProject } from "./classes";
import { showMain, showTasks } from "./main";

let userProjects = new Map();
let allTasksProject;
let todayTasksProject;
const ALL_TASKS_PROJECT_ID = 'all-tasks';
let intialized = true;
initializeProjects();


startApp();
const taskButton = document.querySelector("#add-task");
const closeFormButton = document.querySelector("#closeFormButton");
const overlay = document.querySelector("#overlay");
taskButton.addEventListener('click', showForm);
closeFormButton.addEventListener('click', hideForm);
overlay.addEventListener('click', hideForm);
document.querySelector('#task-form').addEventListener('submit', handleForm);



// display new task form
function showForm() {
    const formElement = document.querySelector('#form-container');

    formElement.style.display = "block";
    document.querySelector("#overlay").style.display = 'block';
}

// hide task form
function hideForm() {
    document.querySelector("#task-form").reset();
    document.querySelector("#form-container").style.display = "none";
    document.querySelector("#overlay").style.display = "none";
}

function handleForm(event) {
    event.preventDefault();
    const form = event.target;
    const task = createTask(form.taskname.value, form.duedate.value, form.description.value, form.priority.value);
    allTasksProject.addTask(task);
    saveToLocalStorage(allTasksProject);
    hideForm();
    showTasks(allTasksProject);
}

// Store tasks. Since all tasks are part of the AllTasks project it should be enough to store projects directly.
function saveToLocalStorage(project) {

    const projectToSave = {
        ...project,
        // convert map to array so it can be serialized
        tasks: Array.from(project.getTasks())
    };
    localStorage.setItem(`app_${projectToSave.id}`, JSON.stringify(projectToSave));

}


function getFromLocalStorage(id) {
    const projectData = localStorage.getItem(id);

    return projectData ? JSON.parse(projectData) : null;

}

function updateTask(id, updatedTask) {
    const project = getFromLocalStorage(id);
    if (project) {
        project.tasks = project.tasks.map(task =>
            task.id === updatedTask ? updatedTask : task
        );
    }
}

function startApp() {
    // this will run on the very first launch of the app
    if (!intialized) {
        initializeProjects();
        intialized = true;

    } else {
        loadAppData();
        showMain();
        showTasks(allTasksProject);
    }

}

function loadAppData() {
    console.log('loading data');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith('app_')) {
            // Retrieve and parse the item from localStorage
            const storedData = localStorage.getItem(key);

            try {
                const project = JSON.parse(storedData);

                // Rehydrate tasks
                const tasks = new Map(
                    project.tasks.map(([key, taskData]) => {

                    
                        const task = createTask(taskData.title,
                            taskData.duedate,
                            taskData.description,
                            taskData.priority);

                        task.id = key;
                        return[key, task];
                    })
                );
                console.log('tasksrehydrated');
                const restoredProject = createProject(project.title, tasks);
                restoredProject.id = project.id;

                // Assign built-in projects to their variables
                if (project.id === ALL_TASKS_PROJECT_ID) {
                    allTasksProject = restoredProject;

                } else if (project.id === "today-tasks") {
                    todayTasks = restoredProject;
                } else {
                    userProjects.set(restoredProject.id, restoredProject);
                }
        } catch (error) {
            console.error(`Error parsing data for key ${key}:`, error);
        }
    }
}
console.log('loading complete');
return userProjects;

}

// Build built-in projects if they don't exist
function initializeProjects() {
    if (!allTasksProject) {
        allTasksProject = createProject("All Tasks");
        allTasksProject.id = ALL_TASKS_PROJECT_ID;
    };
    if (!todayTasksProject) {
        todayTasksProject = createProject("todayTasks");
        todayTasksProject.id = 'today-tasks';
    }

    console.log('allTasksProjectinitalized');
}
