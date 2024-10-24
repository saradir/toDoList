import { createProject, createTask } from "./classes";
import { defaultSettings } from "./settings";


export function saveProjectToStorage(project){

    const tasks = Array.from(project.getTasks());

    const projectToSave = {
        ...project,
        tasks
    };

    localStorage.setItem(`project_${projectToSave.id}`, JSON.stringify(projectToSave));
}


/*export function saveProjectToStorage(project){

    // Convert Date object to ISO string
    const tasks = project.getTasks();
    tasks.forEach(task => {
        if(task.dueDate && task.dueDate instanceof Date){
            console.log('it is a date object');
            task.dueDate = task.dueDate.toISOString();
        } else{
            console.log("it isn't a date object");
            task.dueDate = new Date(task.dueDate).toISOString();  
        }   
    });
    const projectToSave = {
        ...project,
        // convert map to array so it can be serialized
        tasks: Array.from(tasks)
    };
    localStorage.setItem(`project_${projectToSave.id}`, JSON.stringify(projectToSave));

}

/*export function saveProjectToStorage(project){
    const tasks = project.getTasks();
    tasks.forEach((task, key) => {task.date = tasks.date.toString()})
    const projectToSave = {
        ...project,
        // convert map to array so it can be serialized
        tasks: Array.from(project.getTasks())
    };
    localStorage.setItem(`project_${projectToSave.id}`, JSON.stringify(projectToSave));

}
*/
export function loadProject(key){
    // Retrieve and parse the item from localStorage
    const storedData = localStorage.getItem(key);

    try {
        const project = JSON.parse(storedData);

        // Rehydrate tasks
        const tasks = new Map(
            project.tasks.map(([key, taskData]) => {

            
                const task = createTask(taskData.title,
                    taskData.dueDate,
                    taskData.description,
                    taskData.priority);
                
                task.id = key;
                return[key, task];
            })
        );
        console.log('tasksrehydrated');
        const restoredProject = createProject(project.title, tasks);
        restoredProject.id = project.id;
        return restoredProject;
    }catch (error) {
        console.error(`Error parsing data for key ${key}:`, error);
    };

}

export function saveSettings(settings){
    console.log(settings);
    localStorage.settings = JSON.stringify(settings);
}

export function loadSettings(){
    try{
       const settings = JSON.parse(localStorage.settings);
       console.log('settings loaded');
       return settings;
    } catch(e){
        console.error("Failed to parse settings",e);
    }
    return defaultSettings;


}