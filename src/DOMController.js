// display new task form
export function showForm() {
    console.log('shows form');
    const formElement = document.querySelector('#form-container');

    formElement.style.display = "block";
    document.querySelector("#overlay").style.display = 'block';
}

// hide task form
export function hideForm() {
    document.querySelector("#task-form").reset();
    document.querySelector("#form-container").style.display = "none";
    document.querySelector("#overlay").style.display = "none";
}


