import {format, compareAsc} from "date-fns";


export class Task {

    constructor(title, dueDate, description='', priority='normal'){
        this.title = title;
        this.dueDate = new Date(dueDate);
        this.description = description;
        this.priority = priority;
        this.isComplete = 'false';
    }

    // change between complete or incomplete
    toggleStatus(){
        this.isComplete = !this.isComplete;
    }

    isOverdue(){
        return this.dueDate < new Date();
    }

}

export class Project{
    constructor(title){
        this.title = title;
        this.tasks = [];
    }

    get tasks(){
        return this.tasks;
    }

    addTask(task){
        this.tasks.push(task);
    }

    removeTask(taskIndex){
        this.tasks.splice(taskIndex,1);        
    }

    sortTasks(){
        this.tasks.sort((a,b) => {
            return compareAsc(a.dueDate, b.dueDate);
        });
    }
    
}