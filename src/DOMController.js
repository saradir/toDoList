// display form
export function showForm(form) {

    hideForms();

    const formToDisplay = document.querySelector(`#${form}-form`);
    const formContainer = document.querySelector('#form-container');

    formContainer.style.display = "block";
    formToDisplay.style.display = "flex";
    document.querySelector("#overlay").style.display = 'block';
}

// hide  form
export function hideForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.style.display = 'none';
        form.reset();
    });
    document.querySelector("#form-container").style.display = "none";
    document.querySelector("#overlay").style.display = "none";
}


export function displayProjectPane(Projects){

    const projectBox = document.querySelector('#project-box');
    projectBox.innerHTML = '';
    const userProjects = Array.from(Projects.values());
    let numProjects = 0;
    
    for(let i = 0; i < userProjects.length ; i++){

        // display only 5 projects
        if(numProjects >= 6){
            break;
        }
        const project = userProjects[i];
        if(project.title === "All Tasks" || project.title=== "Today"){
            continue;
        }
        console.log(project);
        const projectDiv = document.createElement('div');
        const projectName = document.createElement('div');
        projectDiv.id = project.id;
        projectDiv.className = 'project';
        projectName.textContent = project.title;
        projectName.className = 'projectName';

        projectDiv.appendChild(projectName);
        projectBox.appendChild(projectDiv);
        numProjects+= 1;

    }

}

export function showTasks(project){
    
    const contentElement = document.querySelector("#content");
    const taskContainer = document.querySelector('#task-container');
    taskContainer.innerHTML='';
    

    if (!project) {
        console.log("Project is undefined or null.");
        return;
    }

    const tasks = project.getTasks();
    if (!tasks || tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

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
        console.log(task.dueDate);
        duedate.textContent = task.dueDate.toISOString().slice(0,10); // get date in YYYY-MM-DD format
        duedate.id = 'duedate';

        taskDiv.appendChild(title);
        taskDiv.appendChild(description);
        taskDiv.appendChild(duedate);
        taskContainer.appendChild(taskDiv);
        taskContainer.appendChild(divider);
        contentElement.appendChild(taskContainer);

        });
}

export function showProject(project){
    console.log(project);
    const title = document.querySelector("#project-title");
  

    title.textContent = project.title;
    showTasks(project);   
}