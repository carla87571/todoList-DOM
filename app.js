// Selección de elementos del DOM
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Cargar tareas almacenadas al iniciar la aplicación
loadTasks();

// Escuchar el evento submit del formulario
taskForm.addEventListener("submit", (event) => {
    //evitar el comportamiento por defecto del formulario
  event.preventDefault();

// Obtener el valor del input
//busca el input donde escribio el usuario la tarea
  const taskInput = document.getElementById("task-input");
  // almacena el valor de task-input y lo guarda en la variable task
  const task = taskInput.value;
  console.log(task);

// Validar y procesar la tarea
// Valida: solo procesa si hay texto en la variable task
  if (task) {
    // Crea elemento: llama a createTaskElement para crear un elemento li
    taskList.append(createTaskElement(task));
    // Almacena en localStorage
    storeTaskInLocalStorage(task);
    // Limpiar el input, limpia el campo de texto
    taskInput.value = "";
  }
});

function createTaskElement(task) {
    // crea un elemento li en memoria (aún no esta en el DOM o en la página)
  const li = document.createElement("li");
  // Agrega el texto de la tarea al li( pone el texto que escribio el usuario dentro del li)
  li.textContent = task;
  // crea 2 botones uno para borrar y otro para editar
  li.append(createButton("❌", "delete-btn"), createButton("✏️", "edit-btn"));
  // devuelve el li completo con texto + botones para que pueda ser agregado al DOM.
  return li;
}

function createButton(text, className) {
  //Crea un nuevo elemento en HTML, un <span>, que sera el botón de borrar o editar
  const btn = document.createElement("span");
  // Establece el texto que se mostrará dentro del elemento span, es decir, el icono del botón
  btn.textContent = text;
  // Asigna una clase CSS al elemento span para que pueda ser estilizado con CSS
  btn.className = className;
  // Devuelve el elemento span creado para que pueda ser añadido al DOM, y pueda ser usado como botón
  return btn;
}

//detecta clicks en cualquier elemento dentro del taskList, es decir, en cualquier tarea
taskList.addEventListener("click", (event) => {
  // Verifica si el elemento clickeado tiene la clase "delete-btn"
  if (event.target.classList.contains("delete-btn")) {
    // Si es el botón de borrar, llama a deleteTask pasando el elemento padre (la tarea completa)
    deleteTask(event.target.parentElement);
    // Si es el botón de editar, llama a editTask pasando el elemento padre (la tarea completa)
  } else if (event.target.classList.contains("edit-btn")) {
    // Si es el botón de editar, llama a editTask pasando el elemento padre (la tarea completa)
    editTask(event.target.parentElement);
  }
});

// Función para borrar una tarea
function deleteTask(taskItem) {
  // Muestra una confirmación antes de borrar
  if (confirm("Estás segura / seguro de borrar este elemento?")) {
    // Obtiene el texto de la tarea para eliminarla de localStorage
    const taskText = taskItem.firstChild.textContent;
    // Elimina el elemento del localStorage
    removeFromLocalStorage(taskText);
    // Elimina el elemento del DOM
    taskItem.remove();
  }
}

// Función para editar una tarea
function editTask(taskItem) {
  // Muestra un prompt para editar la tarea, obtiene el nuevo texto de la tarea
  const newTask = prompt("Edita la tarea:", taskItem.firstChild.textContent);
  // Si el usuario no canceló el prompt, actualiza con el nuevo texto de la tarea
  if (newTask !== null) {
    // Actualiza el texto de la tarea en el DOM, solo actualiza el texto, mantiene los botones
    taskItem.firstChild.textContent = newTask;
    updateLocalStorage();
  }
}

// Esta función guarda las tareas en el navegador de forma persistente
function storeTaskInLocalStorage(task) {
  // Obtiene las tareas almacenadas en localStorage, o un array vacío si no hay ninguna
  // el Json.parse convierte el texto guardado en localStorage a un array de JavaScript
  // si no hay nada guardado, usa "[]" que es un array vacío
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  // Agrega la nueva tarea al array de tareas, al final del array
  tasks.push(task);
  // Guarda de vuelta el array actualizado en localStorage
  // JSON.stringify convierte el array de JavaScript a un texto para poder guardarlo en localStorage
  //localStorage.sertItem guarda el texto en localStorage bajo la clave "tasks"
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// esta función se encarga de recuperar y mostrar las tareas guardadas
function loadTasks() {
  // Recupera las tareas del localStorage, o un array vacío si no hay ninguna
  // JSON.parse convierte el texto guardado en localStorage a un array de JavaScript
  // si no hay nada guardado, usa "[]" que es un array vacío
  // y el localStorage.getItem obtiene el texto guardado bajo la clave "tasks"
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  // for.each recorre cada tarea del array
  // por cada tarea llama a createTaskElement para crear el elemento li en HTML
  // y lo agrega al taskList (al ul en el HTML)
  // appendChild agrega cada li al final del ul y añade el elemento al DOM para que sea visible
  tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task)); // appendChild agrega el elemento al DOM para que sea visible
  });
}

// esta función sincroniza el localStorage con el estado actual del DOM
function updateLocalStorage() {
  //taskList.querySelectorAll("li") obtiene todos los elementos o nodos li del DOM, dentro del taskList
  // devuelve un NodeList (parecido a un array)
  // Array.from convierte el NodeList (lista de nodos) a un array real de JavaScript
  // .map recorre cada li del array y extrae el texto de la tarea (el primer hijo del li)
  // y crea un nuevo array solo con los textos de las tareas
  // luego guarda ese array actualizado en localStorage
  // JSON.stringify convierte el array de JavaScript a un texto para poder guardarlo en localStorage
  // localStorage.setItem guarda el texto en localStorage bajo la clave "tasks"
  // JSON.stringify convierte el array de JavaScript a un texto para poder guardarlo en localStorage
  const tasks = Array.from(taskList.querySelectorAll("li")).map(
    (li) => li.firstChild.textContent
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// su función es eliminar una tarea específica del localStorage
function removeFromLocalStorage(taskContent) {
  //Recupera el array de tareas almacenadas en localStorage
  // JSON.parse convierte el texto guardado en localStorage a un array de JavaScript
  // si no hay nada guardado, usa "[]" que es un array vacío
  // y el localStorage.getItem obtiene el texto guardado bajo la clave "tasks"
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  // Filtra el array para eliminar la tarea que coincide con taskContent
  // .filter crea un nuevo array con todas las tareas que NO son iguales a taskContent
  // es decir, elimina la tarea que queremos borrar
  // devuelve un nuevo array sin la tarea eliminada
  // luego guarda ese array actualizado en localStorage
  // tasks.filter crea un nuevo array con las tareas que NO son iguales a taskContent
  
  const updateTasks = tasks.filter((task) => task !== taskContent);
// guarda el array actualizado en localStorage
// JSON.stringify convierte el array de JavaScript a un texto para poder guardarlo en localStorage
  // localStorage.setItem guarda el texto en localStorage bajo la clave "tasks"
  localStorage.setItem("tasks", JSON.stringify(updateTasks));
}

// obtener referencias y estado inicial del tema
//obtiene el botón de cambio de tema del DOM
const themeToggleButton = document.getElementById("toggle-theme-btn");
// obtiene el tema actual guardado en localStorage, puede ser "light", "dark" o null si no hay nada guardado
const currentTheme = localStorage.getItem("theme");
console.log(currentTheme);

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const theme = document.body.classList.contains("dark-theme")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);
});

if (currentTheme === "dark") {
  document.body.classList.add("dark-theme");
}