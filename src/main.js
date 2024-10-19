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
    const taskContainer = document.querySelector('#task-container');
    taskContainer.innerHTML='';
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
        const duedate = document.createElement('div');
        divider.className = "taskDivider";

        title.textContent = task.title;
        description.textContent = task.description;
        duedate.textContent = task.dueDate;
        duedate.id = 'duedate';

        taskDiv.appendChild(title);
        taskDiv.appendChild(description);
        taskDiv.appendChild(duedate);
        taskContainer.appendChild(taskDiv);
        taskContainer.appendChild(divider);
        contentElement.appendChild(taskContainer);

        });


}