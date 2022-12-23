todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));

todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));


todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));


todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = false;
let descriptionValid = false;
let dueDateValid = false;

const api = new Api('http://localhost:5000/tasks')

function validateField(field) {
  const { name, value } = field;
  let = validationMessage = '';
  
  switch (name) {
     case 'title': {
     
      if (value.length < 2) {
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } 
      else if (value.length > 100) {
        validationMessage = "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    
    case 'description': {
   
      if (value.length > 500) {
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    
    case 'dueDate': {
      
      if (value.length === 0) {
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } 
      else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden')
}

function onSubmit(e) {
  e.preventDefault();
 if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');

    saveTask();
    titleValid=false;
    descriptionValid=false;
    dueDateValid=false  
  }
}

function saveTask() {
 const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };
 
  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
  todoForm.title.value="" ;
  todoForm.description.value="" ;
  todoForm.dueDate.value="";
}

function renderList() {
   console.log('rendering');

   api.getAll().then((tasks) => {
     todoListElement.innerHTML = '';

    if (tasks && tasks.length > 0) {
      /* Sortara list efter datum*/
      tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      /* Sortara efter completed */
      tasks.sort((a, b) => new Date(a.completed) - new Date(b.completed));
      
      tasks.forEach((task) => {
         todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}

function renderTask({ id, title, description, dueDate, completed }) {
  const now = new Date();
  let test = now.getFullYear() - new Date(dueDate).getFullYear();
  if (test >=0)
  {
      test = now.getMonth()- new Date(dueDate).getMonth(); 

      if(test >=0)
      {
          test = now.getDate() - new Date(dueDate).getDate()
          console.log(test)
      }
  } 
  
  
  let html =`
  <li  class="select-none mt-4 p-4 `;
  if (completed != true && test > 0)
  {
      html+= `bg-rose-100 rounded`  
  }
  else if (completed)
  {
      html += `bg-lime-100 rounded`;
  }
  html+= `">
      <div class="flex items-center">
          <div flex-1 class="inline-block text-xs">
              <input type="checkbox" value="${id}" onclick="handleCheckboxClick(event)"`; 
              completed && (html += `checked`);
              html+= ` ">
              <label for="${id}" class="mt-2 text-xs">Klart!</label>
          </div>
          <h3 class=" flex-1 text-l font-semibold text-center uppercase">${title}</h3> 
          <div>
              <span class="text-xs">
                  ${dueDate}
              </span>
              <button onclick="deleteTask(${id})" class="inline-block bg-stone-200 text-xs border border-with px-3 py-1 rounded-md ml-2">Ta bort</button>
          </div>
      </div> `;
      description && ( html+=`<p class="ml-8 mt-2 text-xs">${description}</p>`);
  html+=`
  </li>
  `;    
  
  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) =>
    renderList()
    );
}
function handleCheckboxClick(e){

  api.update(e.target.value).then((result) => renderList());

}
renderList();
