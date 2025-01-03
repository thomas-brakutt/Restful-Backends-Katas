const input = document.querySelector(".inputNewTodo");
const addBtn = document.querySelector(".addBtn");
const delBtn = document.querySelector(".delBtn");
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

    const checkbox = document.createElement("input"); // erstellt ein "checkbox-Element"
    checkbox.type = "checkbox"; // ändert den erstellten "input-Type" in ckeckbox
    checkbox.checked = todo.done;

    // Event-Listener für Checkbox, um den done-Status zu aktualisieren
    checkbox.addEventListener("change", () => {
      // Aktualisiert den `done`-Status des entsprechenden Todos
      todo.done = checkbox.checked;

      fetch(`http://localhost:3000/todos/${todo.id}`, {
        // ${todo.id} = + todo.id ("http://localhost:3000/todos/" + todo.id)
        method: "PATCH", // Verwende PATCH, um nur den Status zu aktualisieren
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: todo.done }), // Übermittle nur die geänderten Daten
      });
    });

    newLi.appendChild(checkbox);
    newLi.appendChild(descriptText); // das erstellte liElement erhält den Text
    todoList.appendChild(newLi); // das ulElement erhält das erstellte liElement
  });
}

// eventListener auf Button zum hinzufügen von Todos
addBtn.addEventListener("click", () => {
  const inputText = input.value; // Variable um den Text aus dem inputElement zu speichern
  const addedTodo = {
    description: inputText,
    done: false,
  }; // Variable die das Todo als Objekt speichert

  fetch("http://localhost:3000/todos", {
    // um Backend zu aktualisieren
    method: "POST", // POST Methode (hinzufügen von "Daten" zu der Api)
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(addedTodo),
  })
    .then((response) => {
      response.json();
    })
    .then((addedTodo) => {
      todos.push(addedTodo); // Neues Todo zum lokalen Array hinzufügen
    });
});

delBtn.addEventListener("click", () => {
  //findet alle Todos mit done: true und erstellt neues Array mit den done: true Todos
  const todosToDelete = todos.filter((todo) => todo.done);

  // .map() geht über jedes Todo in todosToDelete und führt für jedes Todo eine Aktion aus.
  const deleteTodos = todosToDelete.map(
    (todo) =>
      fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: "DELETE",
      }) // Für jedes Todo wird ein fetch-Request erstellt mit der Id und dann die Methode DELETE angewendet
  );

  Promise.all(deleteTodos)
    .then(() => {
      // Aktualisiere das lokale Array
      todos = todos.filter((todo) => !todo.done);
      renderTodos();
      console.log("Erledigte Todos erfolgreich gelöscht.");
    })
    .catch((error) => {
      console.error("Fehler beim Löschen der Todos:", error);
    });
});

loadTodos();
