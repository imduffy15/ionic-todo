todoapp.controller('TodoCtrl', function TodoCtrl($scope, $location, $timeout, todoStorage, filterFilter, Modal) {
  var projects = $scope.projects = todoStorage.getProjects();
  var activeProject = $scope.activeProject = todoStorage.getLastActiveProject();
  var todos = $scope.todos = todoStorage.getTodos(activeProject);

  $scope.$watch('remainingCount == 0', function(val) {
    $scope.allChecked = val;
  });

  Modal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.todoModal = modal;
  }, {
    scope: $scope
  });

  $scope.addProject = function(project) {
    if(project === null || project === undefined || project === '') {
      return;
    }
    projects.push(project);
    todoStorage.putProject(project);
  };

  $scope.newProject = function() {
    var project = prompt('Insert a project name:');
    $scope.addProject(project);
  };

  $scope.addTodo = function(todo) {
    if(todo === undefined) {
      $scope.todoModal.hide();
      return;
    }

    todos.push({
      title: todo.title,
      completed: false
    });

    todoStorage.putTodo(activeProject, todos);
    $scope.todoModal.hide();
    todo.title = '';

    $scope.remainingCount++;
  };

  $scope.removeTodo = function(todo) {
    $scope.remainingCount -= todo.completed ? 0 : 1;
    todos.splice(todos.indexOf(todo), 1);
    todoStorage.put(todos);
  };

  $scope.todoCompleted = function(todo) {
    $scope.remainingCount += todo.completed ? -1 : 1;
    todoStorage.put(todos);
  };

  $scope.clearCompletedTodos = function() {
    $scope.todos = todos = todos.filter(function (val) {
      return !val.completed;
    });
    todoStorage.put(todos);
  };

  $scope.markAll = function (completed) {
    todos.forEach(function (todo) {
      todo.completed = completed;
    });
    $scope.remainingCount = completed ? 0 : todos.length;
    todoStorage.put(todos);
  };

  $scope.toggleProjects = function() {
    $scope.sideMenuController.toggleLeft();
  };

  $scope.newTodo = function() {
    $scope.todoModal.show();
  };

  $scope.closeNewTodo = function() {
    $scope.todoModal.hide();
  };

  $timeout(function() {
    if($scope.projects.length === 0) {
      while(true) {
        console.log("no projects");
        break;
      }
    }
  });

});