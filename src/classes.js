
export function createTask(title, dueDate, description = '', priority = 'normal') {


    const taskID = generateID();


    // Create unique id for task
    function generateID() {
        return Date.now() + Math.random().toString(36).substring(2, 9);
    }

    // change between complete or incomplete
    const toggleStatus = () => {
        isComplete = !isComplete;
    }

    const isOverdue = () => {
        return dueDate < new Date();
    }

    const setPriority = (newPriority) => {
        priority = newPriority;
    }

    return {
        taskID, title, dueDate, description, priority,
        isOverdue, setPriority, toggleStatus
    };

}

export function createProject(title, tasks = new Map()) {


    const id = generateID();


    function generateID() {
        return Date.now() + Math.random().toString(36).substring(2, 9);
    }

    const getTasks = () =>{
        return tasks;
    }

    const addTask = (task) => {
        tasks.set(task.taskID, task);
    }

    const removeTask =(taskID) => {
        tasks.delete(taskID);
    }

    // return tasks sorted by date
    const sortTasksByDate = ()=>{
        return new Map([...this.tasks.entries()].sort((a, b) =>
            a[1].date - b[1].date));
    }

    return{id,title, getTasks, addTask, removeTask, sortTasksByDate};

}
