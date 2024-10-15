// show main page(all class)
export function showMain(){
    const contentElement = document.querySelector("#content");
    const title = document.createElement("h2");
    title.id = 'title';
    title.textContent = "All Tasks";
    contentElement.appendChild(title);

}

export function showTasks(project){
    const contentElement = document.querySelector("#content");
    const taskContainer = document.createElement('div');
    const tasks = project.getTasks();
    console.log(tasks);

    tasks.forEach((task, taskID) => 
        {
        console.log(task);
        const taskDiv = document.createElement('div');
        taskDiv.className = "task";
        taskDiv.dataset.taskID = taskID;
        const title = document.createElement('div');
        const description = document.createElement('div');
        const divider = document.createElement('div');
        divider.className = "taskDivider";

        title.textContent = task.title;
        description.textContent = task.description;

        taskDiv.appendChild(title);
        taskDiv.appendChild(description);
        taskContainer.appendChild(taskDiv);
        taskContainer.appendChild(divider);
        contentElement.appendChild(taskContainer);

        });


}