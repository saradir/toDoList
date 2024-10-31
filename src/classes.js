
export function createTask(title, dueDate, description = '', priority = 'normal', projectID = '') {

    dueDate = new Date(dueDate);
    const taskID = generateID();
    let isComplete = false;


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
        taskID, title, dueDate, description, priority, projectID,
        isOverdue, setPriority, toggleStatus
    };

}

export function createProject(title, tasks = new Map()) {


    const id = generateID();
    

    const lastModified = Date.now();
    function generateID() {
        return Date.now() + Math.random().toString(36).substring(2, 9);
    }

    const getTasks = () =>{
        return tasks;
    }

    const addTask = (task) => {
        tasks.set(task.taskID, task);
        tasks = sortTasksByDate();
    }

    const removeTask =(taskID) => {
        tasks.delete(taskID);
    }

    // return tasks sorted by date
    function sortTasksByDate(){
        return new Map([...tasks.entries()].sort((a, b) =>
            a[1].dueDate - b[1].dueDate));
    }

    return{id,title, getTasks, addTask, removeTask, sortTasksByDate, lastModified};

}
