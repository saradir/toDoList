const taskButton = document.querySelector("id=add-task");
taskButton.addEventListener('click', addTask);

function addTask(){
    const formElement = document.querySelector('#taskform');
    
    formElement.style.display = 'block';
    document.querySelector("#overlay").style.display = block;
}