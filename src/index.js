import "./styles.css"
import {createTask, createProject, } from "./classes";
import { showMain, showTasks } from "./main";
import { showForm, hideForm } from "./DOMController";
import * as Storage from "./storage";

let userProjects = new Map();
let allTasksProject;
let todayTasksProject;

const settings = Storage.loadSettings();

const ALL_TASKS_PROJECT_ID = 'all-tasks';


startApp();
const taskButton = document.querySelector("#add-task");
const closeFormButton = document.querySelector("#closeFormButton");
const overlay = document.querySelector("#overlay");
taskButton.addEventListener('click', showForm);
closeFormButton.addEventListener('click', hideForm);
overlay.addEventListener('click', hideForm);
document.querySelector('#task-form').addEventListener('submit', handleForm);


function handleForm(event) {
    event.preventDefault();
    const form = event.target;
    const task = createTask(form.taskname.value, form.duedate.value, form.description.value, form.priority.value);
    allTasksProject.addTask(task);
    Storage.saveProjectToStorage(allTasksProject);
    hideForm();
    showTasks(allTasksProject);
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
    if (!settings.initialized) {
        console.log('initializing');
        initializeProjects();
        settings.initialized = true;
        Storage.saveSettings(settings);
        console.log('settings saved');
    } else {
        console.log('loading');
        loadAppData();
        console.log('preparing display');
        showMain();
        showTasks(allTasksProject);
        console.log('showing tasks');
    }
}

function loadAppData() {
    // Load Projects
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith('project_')) {
            // Retrieve and parse the item from localStorage
           const project = Storage.loadProject(key);
            console.log('alltasksloaded');
           if(project.id === ALL_TASKS_PROJECT_ID){
                allTasksProject = project ;
           }else {
            userProjects.set(project.id, project);
           }
        }
    }

    // Load app settings
    Object.assign(settings, Storage.loadSettings);
}

// Build built-in projects if they don't exist
function initializeProjects() {
    
    allTasksProject = createProject("All Tasks");
    allTasksProject.id = ALL_TASKS_PROJECT_ID;

    todayTasksProject = createProject("todayTasks");
    todayTasksProject.id = 'today-tasks';

    console.log('allTasksProjectinitalized');
    localStorage.initialized = true;
}
