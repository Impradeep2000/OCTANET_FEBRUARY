document.addEventListener('DOMContentLoaded', function () {
    const todoNameInput = document.getElementById('todoName');
    const todoDescriptionInput = document.getElementById('todoDescription');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const searchTodoInput = document.getElementById('searchTodo');

    addTaskBtn.addEventListener('click', function () {
        const todoName = todoNameInput.value.trim();
        const todoDescription = todoDescriptionInput.value.trim();
        if (todoName !== '') {
            const todo = {
                name: todoName,
                description: todoDescription
            };
            addTodoToDiv(todo);
            saveTodoToLocalStorage(todo);
            todoNameInput.value = '';
            todoDescriptionInput.value = '';
        }
    });

    searchTodoInput.addEventListener('keyup', function () {
        const searchText = searchTodoInput.value.toLowerCase();
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const filteredTodos = todos.filter(todo => {
            return todo.name.toLowerCase().includes(searchText) || todo.description.toLowerCase().includes(searchText);
        });
        displayTodos(filteredTodos);
    });

    function addTodoToDiv(todo) {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        todoDiv.innerHTML = `
            <div class="head">
                <h3 contenteditable="true">${todo.name}</h3>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
            <div class="desc" contenteditable="true">
                <p>${todo.description}</p>
            </div>
        `;
        taskList.appendChild(todoDiv);

        const deleteBtn = todoDiv.querySelector('.delete-btn');
        const editBtn = todoDiv.querySelector('.edit-btn');
        const nameElement = todoDiv.querySelector('h3');
        const descElement = todoDiv.querySelector('.desc');

        deleteBtn.addEventListener('click', function () {
            deleteTodoFromLocalStorage(todo);
            taskList.removeChild(todoDiv);
            checkNoTodos();
        });

        editBtn.addEventListener('click', function () {
            if (editBtn.textContent === 'Edit') {
                editBtn.textContent = 'Save';
                nameElement.setAttribute('contenteditable', 'true');
                nameElement.focus();
                descElement.setAttribute('contenteditable', 'true');
            } else {
                editBtn.textContent = 'Edit';
                nameElement.removeAttribute('contenteditable');
                descElement.removeAttribute('contenteditable');
                todo.name = nameElement.textContent.trim();
                todo.description = descElement.textContent.trim();
                updateTodoInLocalStorage(todo);
            }
        });

        descElement.addEventListener('blur', function () {
            editBtn.textContent = 'Edit';
            nameElement.removeAttribute('contenteditable');
            descElement.removeAttribute('contenteditable');
            todo.name = nameElement.textContent.trim();
            todo.description = descElement.textContent.trim();
            updateTodoInLocalStorage(todo);
        });
    }

    function saveTodoToLocalStorage(todo) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        checkNoTodos();
    }

    function deleteTodoFromLocalStorage(todo) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.filter(t => t.name !== todo.name || t.description !== todo.description);
        localStorage.setItem('todos', JSON.stringify(todos));
        checkNoTodos();
    }

    function updateTodoInLocalStorage(todo) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.map(t => {
            if (t.name === todo.name && t.description === todo.description) {
                return todo;
            }
            return t;
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function displayTodos(todos) {
        taskList.innerHTML = '';
        if (todos.length === 0) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'No todos available, please add some todos.';
            taskList.appendChild(messageDiv);
        } else {
            todos.forEach(todo => {
                addTodoToDiv(todo);
            });
        }
    }

    function checkNoTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        if (todos.length === 0) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = 'No todos available, please add some todos.';
            taskList.appendChild(messageDiv);
        }
        else {
            const messageDiv = taskList.querySelector('div');
            if (messageDiv && messageDiv.textContent === 'No todos available, please add some todos.') {
                taskList.removeChild(messageDiv);
            }
        }
    }

    // Display all todos on page load
    displayTodos(JSON.parse(localStorage.getItem('todos')) || []);
});
