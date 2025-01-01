const input = document.querySelector(".inputNewTodo");
const AddBtn = document.querySelector(".AddBtn");
const todoList = document.querySelector(".list");

let todos = [];

// Funktion, mit der die Daten aus der Api "runtergeladen" werden, so, dass die Seite immer aktuell ist mit dem "backend ist"
function loadTodos() {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((todosFromApiData) => {
      console.log(todosFromApiData);
      todos = todosFromApiData; // erhaltenen Daten von der Api werden in die todos-Variablen gespeichert für den lokalen State
      renderTodos(); // renderFunktion wird ausgeführt
    });
}

// Funktion zum "rendern", dass es auf der Homepage angezeigt wird
function renderTodos() {
  todoList.innerHTML = ""; // vor dem "rendern" ulElement-Liste leeren

  // für jedes Todo soll ein Eintrag erzeugt werden
  todos.forEach((todo) => {
    const newLi = document.createElement("li"); // erzeugt ein neues ListenElement
    const descriptText = document.createTextNode(todo.description); //  erstell den Text aus der todo.description

    newLi.appendChild(descriptText); // das erstellte liElement erhält den Text
    todoList.appendChild(newLi); // das ulElement erhält das erstellte liElement
  });
}

loadTodos();
