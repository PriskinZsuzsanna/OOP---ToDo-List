//Constants
const addBtn = document.querySelector("#add-btn");

let darkMode = localStorage.getItem("darkMode");

//Class Todo
class Todo {
    constructor(todoText, id) {
        this.todoText = todoText;
        this.id = id;
    }

    static createTodo() {
        //Get value
        const todoText = document.querySelector("#input").value;
        const id = Math.random() * 1000000;

        //Validate
        if (todoText === "") {
            UI.showAlert("Please write down your task!", "alert")
        } else {

            //Instatntiate todo
            const todo = new Todo(todoText, id);

            //Add Todo to list
            UI.addTodoToList(todo);

            //Add to store
            Store.addTodoToStore(todo);

            //Clear field
            UI.clearField()
        }
    }
}

//Class UI
class UI {
    static displayTodosOnLoad() {
        const todos = Store.getTodosFromStore();

        todos.forEach((todo) => {
            UI.addTodoToList(todo)
        })
    }

    static showAlert(alertMessage, className) {
        const div = document.createElement("div");
        div.className = className;
        div.appendChild(document.createTextNode(alertMessage));
        const inputs = document.querySelector(".inputs");
        const container = document.querySelector(".container");
        container.insertBefore(div, inputs);
        //Vanish in 3 sec
        setTimeout(() => document.querySelector(".alert").remove(), 3000);

    }

    static addTodoToList(todo) {
        const list = document.querySelector(".results");

        const result = document.createElement("div");
        result.className = "result"
        result.setAttribute("data-id", todo.id)
        result.innerHTML = `
       
        <p>${todo.todoText}</p>
        <button id="del-btn" class="delete">Delete</button>
  
        `;

        list.appendChild(result);
    }

    static clearField() {
        document.querySelector("#input").value = "";
    }

    static deleteTodo(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.style.opacity = 0;
            el.parentElement.addEventListener("transitionend", () => {
                el.parentElement.remove()
            })
        }
    }

}

//Class Store
class Store {
    static getTodosFromStore() {
        let todos;
        if (localStorage.getItem("todos") === null) {
            todos = []
        } else {
            todos = JSON.parse(localStorage.getItem("todos"))
        }
        return todos;
    }

    static addTodoToStore(todo) {
        const todos = Store.getTodosFromStore();
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    static removeTodoFromStore(id) {

        const todos = Store.getTodosFromStore();

        todos.forEach((todo, index) => {
            if (todo.id === +id) {

                todos.splice(index, 1)
            }
        })
        localStorage.setItem("todos", JSON.stringify(todos))
    }

    static enableDarkMode() {
        localStorage.setItem("darkMode", "enabled");
        document.body.classList.add("dark");
    }

    static disableDarkMode() {
        localStorage.setItem("darkMode", null);
        document.body.classList.remove("dark");
    }

    static getMode() {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches || darkMode === "enabled") {
            Store.enableDarkMode();
        };
    }


}

//Event addTodo - BTN
addBtn.addEventListener("click", () => {
    //Get value, validate, instatiate, add to list, add to store, clear filed
    Todo.createTodo();
});

//Event addTodo - Enter
document.querySelector("#input").addEventListener("keyup", function (e) {
    if(e.keyCode == "13") { 
        Todo.createTodo();
    }
});

//Event removeTodo
document.querySelector(".results").addEventListener("click", (e) => {

    //Remove from UI
    UI.deleteTodo(e.target)

    //Remove from Store
    Store.removeTodoFromStore(e.target.parentElement.dataset.id)
})


//Event Display todos onLoad
document.addEventListener("DOMContentLoaded", () => {
    UI.displayTodosOnLoad();
    Store.getMode();
})


//Event changeMode onClick
document.querySelector(".light-dark").addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode");
    //Következő sor, csak ezzel működik === null csak 2 kattintásig működik
    if (darkMode !== "enabled") {
        Store.enableDarkMode();
    } else {
        Store.disableDarkMode();
    }
})