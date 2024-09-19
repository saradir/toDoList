import { format, isToday } from "date-fns";
import { Project } from "./classes";

const todayTasks = new Project("todayTasks");
const todayDate = new Date();

function loadToday(tasks){
    for(task of tasks){
        if(task.dueDate <= todayDate){
            todayTasks.push(task);
        };
    };
}


function displayProject(project){
    for(let i=0; i<project.tasks.length;i++){
        const task = project.tasks[i];
        const taskDiv = document.createElement('div');
        taskDiv.className = "task";
        taskDiv.setAttribute = ('data-index', i);
        taskDiv.setAttribute = ('data-priority', task.priority);
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = format(task.dueDate);
        if(task.isOverdue()){
            dueDateSpan.setAttribute(data-overdue,"true");
        };
    }
}