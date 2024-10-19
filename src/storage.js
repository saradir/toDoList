import { createProject, createTask } from "./classes";
import { defaultSettings } from "./settings";


export function saveProjectToStorage(project){
    const projectToSave = {
        ...project,
        // convert map to array so it can be serialized
        tasks: Array.from(project.getTasks())
    };
    localStorage.setItem(`project_${projectToSave.id}`, JSON.stringify(projectToSave));

}

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