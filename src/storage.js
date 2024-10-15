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
                    Array.from(Object.entries(project.tasks), ([key, taskData]) => {

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