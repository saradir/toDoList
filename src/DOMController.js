// display form
export function showForm(form) {

    hideForms();

    const formToDisplay = document.querySelector(`#${form}-form`);
    const formContainer = document.querySelector('#form-container');


    formContainer.style.display = "block";
    formToDisplay.style.display = "flex";
    document.querySelector("#overlay").style.display = 'block';
    return formToDisplay;
}

// hide  form
export function hideForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.style.display = 'none';
        form.dataset.taskId = "";
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

export function showTasks(tasks){
    
    const contentElement = document.querySelector("#content");
    const taskContainer = document.querySelector('#task-container');
    taskContainer.innerHTML='';
    

    //if (!project) {
      //  console.log("Project is undefined or null.");
     //   return;
   // }

   // const tasks = project.getTasks();
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
        taskDiv.dataset.projectID = task.projectID;

        // Head of task element
        const taskHead = document.createElement('div');
        taskHead.className = 'taskHead';

        const title = document.createElement('div');
        title.textContent = task.title;
        title.className = 'taskTitle';

        const duedate = document.createElement('div');
        duedate.textContent = task.dueDate.toISOString().slice(0,10); // get date in YYYY-MM-DD format
        duedate.className = 'duedate';


        const markComplete = document.createElement('button');
        markComplete.textContent = task.isComplete ? "Mark Unfinished" : "Mark Complete";
        markComplete.className = 'markCompleteButton';

        //  Body of task element
        const taskBody = document.createElement('div');
        taskBody.className = "taskBody";

        const description = document.createElement('div');
        description.textContent = task.description;
        description.className = "taskDescription";
        taskBody.style.display = "none";


        // Bottom of task element

        const taskBottom = document.createElement('div');
        taskBottom.className = 'taskBottom';

        const editTaskButton = document.createElement('button');
        editTaskButton.className ="editTaskButton";
        editTaskButton.textContent = 'Edit Task';
        
        const deleteTaskButton = document.createElement('button');
        deleteTaskButton.className = 'deleteTaskButton';
        deleteTaskButton.textContent = 'Delete';


        const divider = document.createElement('div');
        divider.className = "taskDivider";


        taskHead.appendChild(title);
        taskHead.appendChild(duedate);
        taskHead.appendChild(markComplete);

        taskBody.appendChild(description);


        taskBottom.appendChild(editTaskButton);
        taskBottom.appendChild(deleteTaskButton);

        taskBody.appendChild(taskBottom);
        taskDiv.appendChild(taskHead);
        taskDiv.appendChild(taskBody);
        taskContainer.appendChild(taskDiv);
        taskContainer.appendChild(divider);
        contentElement.appendChild(taskContainer);
        
        });
}

export function showProject(project){
    console.log(project);
    const title = document.querySelector("#project-title");
  

    title.textContent = project.title;
    showTasks(project.getTasks());   

}

export function showView(tasks, viewName){
    const title = document.querySelector("#project-title");
    title.textContent = viewName;
    showTasks(tasks);
}

export function openUpdateTaskForm(task){
    const form = showForm('task');
    form.querySelector('button[type="submit"]').textContent = "Save";
    form.taskname.value = task.title;
    form.duedate.value = task.dueDate.toISOString().slice(0,10);
    form.description.value = task.description;
    form.priority.value = task.priority;
    form.dataset.mode = 'update';
    form.dataset.taskID = task.taskID;
    form.dataset.projectID = task.projectID;
}

export function openAddTaskForm(){
    const form = showForm('task');
    form.querySelector('button[type="submit"]').textContent = "Add";
    form.dataset.mode = "add";
    form.dataset.taskID = '';
}