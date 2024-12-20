import "./styles.css"
import {createTask, createProject, } from "./classes";
import { showForm, hideForms, displayProjectPane, showProject, showTasks, openUpdateTaskForm, openAddTaskForm, showView } from "./DOMController";
import * as Storage from "./storage";

const Projects = new Map();  // Stores all projects
const Tasks = new Map();     // Stores all tasks
const settings = Storage.loadSettings();
let currentProject; // Tracks the current project on display. Mainly used for the global "add task" button.


startApp();
const overlay = document.querySelector("#overlay");
document.querySelector('#add-project').addEventListener('click', () => {showForm('project');});
document.querySelector("#add-task").addEventListener('click', openAddTaskForm);
document.querySelectorAll("#closeFormButton").forEach(button => button.addEventListener('click', hideForms));
overlay.addEventListener('click', hideForms);
document.querySelector('#task-form').addEventListener('submit', handleTaskForm);
document.querySelector('#project-form').addEventListener('submit', handleProjectForm);
document.querySelector("#settings-button").addEventListener('click', () => {showForm('settings');});
document.querySelector("#reset-button").addEventListener('click', resetApp);
document.querySelector("#project-box").addEventListener('click', handleProjectClick);
document.querySelector('#todayButton').addEventListener('click', () => {showToday(Tasks);});
document.querySelector('#upcomingButton').addEventListener('click', () => {showUpcoming(Tasks);});



// Expand/collapse task window when title is clicked
function expandTask(event){
    if (event.target.classList.contains('markCompleteButton')){
        console.log('this is a toggle button');
        return;
    }
    console.log(event.currentTarget);
    const taskBody = event.currentTarget.parentNode.querySelector(".taskBody");
    if(taskBody.style.display === "none"){
        taskBody.style.display = "flex";
    } else{taskBody.style.display = "none"};
}

// Handle what happens when user clicks on a project in the project pane
function handleProjectClick(event){

    // make sure the current div is selected and not a child div
    try {
        const project = event.target.classList.contains('project')? event.target : event.target.closest('.project');
        currentProject = Projects.get(project.id)
        showProjectAndAttachListeners(currentProject);
        document.querySelectorAll('.taskHead').forEach(taskHead => taskHead.addEventListener('click', expandTask));

    } catch (error) {
        console.log('you missed!');
    }
}


function handleTaskForm(event) {

    event.preventDefault();
    const form = event.target;

    // Create new task
    if(form.dataset.mode === "add"){
        const task = createTask(form.taskname.value, form.duedate.value, form.description.value, form.priority.value, currentProject.id);
        // add the task to current project AND "ALL TASKS" project.
         currentProject.addTask(task);
         Tasks.set(task.taskID, task);
         console.log(Tasks);
         Storage.saveProjectToStorage(currentProject);
         showProjectAndAttachListeners(currentProject);

    
    // Update given task
    }else if(form.dataset.mode === "update"){
        const project = Projects.get(form.dataset.projectID);
        const task = project.getTasks().get(form.dataset.taskID);
        task.title = form.taskname.value;
        task.dueDate = new Date(form.duedate.value);
        task.description = form.description.value;
        task.priority = form.priority.value;
        Storage.saveProjectToStorage(project);
        showProjectAndAttachListeners(project);

    }; 
    hideForms();
}

function handleProjectForm(event){
    event.preventDefault();
    const form = event.target;
    const project = createProject(form.projectName.value);
    Storage.saveProjectToStorage(project);
    Projects.set(project.id, project);
    currentProject = project;
    showProject(currentProject);
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
        //currentProject = Projects.get(ALL_TASKS_PROJECT_ID);
        //showProjectAndAttachListeners(currentProject);
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
           // save project and tasks in app's maps
            Projects.set(project.id, project);
            const tasks = project.getTasks();
            tasks.forEach((task, id) => {
                Tasks.set(id, task);
            });
           }
        }
    // Load app settings
    Object.assign(settings, Storage.loadSettings());
}

// Build built-in projects if they don't exist
function initializeProjects() {
    
    //const allTasksProject = createProject("All Tasks");
    //allTasksProject.id = ALL_TASKS_PROJECT_ID;
   // Projects.set(ALL_TASKS_PROJECT_ID, Projects.get(ALL_TASKS_PROJECT_ID));
    //Storage.saveProjectToStorage(allTasksProject);

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

// build the Today task view
function showToday(tasks){


    const dateToday = new Date();
    tasks = Array.from(tasks.values()).filter(task => {
        return (task.dueDate <= dateToday && !(task.isComplete));
        });

    const tasksMap = new Map(tasks.map(task => [task.taskID, task]));
    showView(tasksMap,'Today');
    attachTaskListeners();
    currentProject = 'today';

}


function showUpcoming(tasks){

    const dateToday = new Date();
    tasks = Array.from(tasks.values()).filter(task =>{
        return task.dueDate > dateToday && !(task.isComplete);
    });
    const tasksMap = new Map(tasks.map(task => [task.taskID, task]));
    showView(tasksMap,'Upcoming');
    attachTaskListeners();
    currentProject = 'upcoming';
}

// attach all the various listeners to the task elements
function attachTaskListeners(){
    document.querySelectorAll('.taskHead').forEach(taskHead => taskHead.addEventListener('click', expandTask));
    document.querySelectorAll('.markCompleteButton').forEach(button => button.addEventListener('click', changeTaskStatus));
    document.querySelectorAll('.deleteTaskButton').forEach( button => button.addEventListener('click', deleteTask));
    document.querySelectorAll('.editTaskButton').forEach( button => button.addEventListener('click', editTask));
 
}

// This is just a wrapper function to ensure both functions are always called together
function showProjectAndAttachListeners(project){
    console.log('showing project');
    if(project ==="today"){
        showToday(Tasks);
        console.log('displaying today');
        
    }else if(project === "upcoming"){
        showUpcoming(Tasks);
    }else{showProject(project);
    }
    attachTaskListeners();
}

function changeTaskStatus(e){
    const taskDiv = e.currentTarget.closest('.task');
    const task =  currentProject.getTasks().get(taskDiv.dataset.taskID);
    task.isComplete = !task.isComplete;
    e.currentTarget.textContent = task.isComplete ? "Mark Unfinished" : "Mark Complete";
}


function deleteTask(e){
    const taskDiv = e.currentTarget.closest('.task');
    const project = Projects.get(taskDiv.dataset.projectID);
    project.removeTask(taskDiv.dataset.taskID);
    Tasks.delete(taskDiv.dataset.taskID);


    // save the original project but display current project/view (in case current project is "today" or "upcoming")
    Storage.saveProjectToStorage(project);
    showProjectAndAttachListeners(currentProject);
}

function editTask(e){
    console.log('edit button clicked');
 
    const taskDiv = e.target.closest('.task');
    console.log(taskDiv);
    const project = Projects.get(taskDiv.dataset.projectID);
    console.log(project);
    const task = project.getTasks().get(taskDiv.dataset.taskID);
    console.log(task);
    openUpdateTaskForm(task);

}