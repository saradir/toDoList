import "./styles.css"
import {createTask, createProject, } from "./classes";
import { showForm, showTasks, hideForms, displayProjectPane, showProject } from "./DOMController";
import * as Storage from "./storage";

const Projects = new Map();
const settings = Storage.loadSettings();
const ALL_TASKS_PROJECT_ID = 'all-tasks';
let currentProject; // Tracks the current project on display. Mainly used for the global "add task" button.


startApp();
const overlay = document.querySelector("#overlay");
document.querySelector('#add-project').addEventListener('click', () => {showForm('project');});
document.querySelector("#add-task").addEventListener('click', () => {showForm('task');});
document.querySelectorAll("#closeFormButton").forEach(button => button.addEventListener('click', hideForms));
overlay.addEventListener('click', hideForms);
document.querySelector('#task-form').addEventListener('submit', handleTaskForm);
document.querySelector('#project-form').addEventListener('submit', handleProjectForm);
document.querySelector("#settings-button").addEventListener('click', () => {showForm('settings');});
document.querySelector("#reset-button").addEventListener('click', resetApp);
document.querySelector("#project-box").addEventListener('click', handleProjectClick);

// Handle what happens when user clicks on a project in the project pane
function handleProjectClick(event){
    console.log('clicked!');
    // make sure the current div is selected and not a child div
    try {
        const project = event.target.classList.contains('project')? event.target : event.target.closest('.project');
        currentProject = Projects.get(project.id)
        showProject(currentProject);
    } catch (error) {
        console.log('you missed!');
    }
}

function handleTaskForm(event) {
    event.preventDefault();
    const form = event.target;
    const task = createTask(form.taskname.value, form.duedate.value, form.description.value, form.priority.value, currentProject);
    console.log(task.dueDate instanceof Date); 
    console.log(task.dueDate);
    // add the task to current project AND "ALL TASKS" project.
    currentProject.addTask(task);
    Projects.get(ALL_TASKS_PROJECT_ID).addTask(task);
    Storage.saveProjectToStorage(Projects.get(ALL_TASKS_PROJECT_ID));
    Storage.saveProjectToStorage(currentProject);
    hideForms();
    showTasks(currentProject);
}

function handleProjectForm(event){
    event.preventDefault();
    const form = event.target;
    const project = createProject(form.projectName.value);
    console.log(project.title);
    Storage.saveProjectToStorage(project);
    Projects.set(project.id, project);
    console.log(Projects);
    hideForms();
    displayProjectPane(Projects);
}

// this will require some additional work when other setting are added
function handleSettingsForm(event){
    event.preventDefault();
    const form = event.target;
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
        currentProject = Projects.get(ALL_TASKS_PROJECT_ID);
        showProject(currentProject);
        displayProjectPane(Projects);
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
            Projects.set(project.id, project);
           }
        }
    // Load app settings
    Object.assign(settings, Storage.loadSettings);
}

// Build built-in projects if they don't exist
function initializeProjects() {
    
    const allTasksProject = createProject("All Tasks");
    allTasksProject.id = ALL_TASKS_PROJECT_ID;
    Projects.set(ALL_TASKS_PROJECT_ID, Projects.get(ALL_TASKS_PROJECT_ID));
    Storage.saveProjectToStorage(allTasksProject);

   // todayTasksProject = createProject("todayTasks");
   //    todayTasksProject.id = 'today-tasks';

    console.log('Projects initalized');
    localStorage.initialized = true;
}

// Delete all memory and reset settings back to defaults
function resetApp(){

    const confirmed = confirm("Are you sure you want to reset? This will delete all stored data and reset settings");
    if(confirmed){
        localStorage.clear();
        Object.assign(settings, Storage.loadSettings());
        startApp();
    };
}