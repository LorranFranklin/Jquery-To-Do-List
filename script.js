$(document).ready(function () {
  const taskInput = $(".input-field input"); //input de tarefas
  const filters = $(".filters span"); //todos, pendentes, concluídos, são filtros
  const addBtn = $(".button-add-task"); //botão add
  const taskBox = $(".task-box"); //ul onde a lista será add

  let editId;
  let isEditTask = false;
  let todos;

  try {
    todos = JSON.parse(localStorage.getItem("todo-list")) || [];
  } catch (e) {
    todos = [];
    console.error("Failed to parse todo list from localStorage", e);
  }

  filters.on("click", function () {
    $(".filters span.active").removeClass("active");
    $(this).addClass("active");
    showTodo($(this).attr("id"));
  });

  taskBox.on("click", ".uil-ellipsis-h", function () {
    showMenu(this);
  });

  function showMenu(selectedTask) {
    let menu = $(selectedTask).siblings(".task-menu");
    $(".task-menu").not(menu).removeClass("show");
    menu.toggleClass("show");
  }

  $("body").on("click", function (e) {
    if (!$(e.target).closest(".settings").length) {
      $(".task-menu").removeClass("show");
    }
  });

  taskBox.on("click", 'input[type="checkbox"]', function () {
    updateStatus(this);
  });

  function showTodo(filter) {
    let liTag = "";
    if (todos) {
      $.each(todos, function (id, todo) {
        let completed = todo.status == "completed" ? "checked" : "";
        if (filter == todo.status || filter == "all") {
          liTag += `
          <li class="task">
          <label for="${id}">
            <input type="checkbox" data-id="${id}" ${completed} />
            <p class="${completed}">${todo.name}</p>
          </label>
          <div class="settings">
            <i class="uil uil-ellipsis-h"></i>
            <ul class="task-menu">
              <li class="edit" data-id="${id}"><i class="uil uil-pen"></i>Edit</li>
              <li class="delete" data-id="${id}" data-filter="${filter}"><i class="uil uil-trash"></i>Delete</li>
            </ul>
          </div>
        </li>
        `;
        }
      });
    }
    taskBox.html(liTag || `<span>Você não tem tarefas</span>`);
    checkOverflow();
  }
  showTodo("all");

  function checkOverflow() {
    if (taskBox.height() > 300) {
      taskBox.addClass("overflow");
    } else {
      taskBox.removeClass("overflow");
    }
  }

  function updateStatus(selectedTask) {
    let taskName = $(selectedTask).parent().find("p");
    let taskId = $(selectedTask).data("id");
    if (selectedTask.checked) {
      taskName.addClass("checked");
      todos[taskId].status = "completed";
    } else {
      taskName.removeClass("checked");
      todos[taskId].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
  }

  taskBox.on("click", ".edit", function () {
    let taskId = $(this).data("id");
    editTask(taskId, todos[taskId].name);
  });

  function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.val(textName).focus().addClass("active");
  }

  taskBox.on("click", ".delete", function () {
    let taskId = $(this).data("id");
    let filter = $(this).data("filter");
    deleteTask(taskId, filter);
  });

  function deleteTask(taskId, filter) {
    isEditTask = false;
    todos.splice(taskId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
    checkOverflow();
  }

  addBtn.on("click", function () {
    let userTask = taskInput.val().trim();
    if (userTask) {
      if (!isEditTask) {
        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo);
      } else {
        isEditTask = false;
        todos[editId].name = userTask;
      }
      taskInput.val("");
      localStorage.setItem("todo-list", JSON.stringify(todos));
      showTodo($("span.active").attr("id"));
      checkOverflow();
    }
  });
});
