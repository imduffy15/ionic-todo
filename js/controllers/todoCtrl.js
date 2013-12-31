todoapp.controller('TodoCtrl', function TodoCtrl($scope, $location, $timeout, todoStorage, filterFilter, Modal) {
  $scope.projects = todoStorage.getProjects();
  $scope.activeProject = todoStorage.getLastActiveProject();
  $scope.todos = todoStorage.getTodos($scope.activeProject);

  $scope.$watch('remainingCount == 0', function(val) {
    $scope.allChecked = val;
  });

  Modal.fromTemplateUrl('new-todo.html', function(modal) {
    $scope.todoModal = modal;
  }, {
    scope: $scope
  });

  Modal.fromTemplateUrl('new-project.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope
  });

  $scope.addProject = function(project) {
    if(project === null || project === undefined || project === '') {
      return;
    }

    if($scope.projects.indexOf(project.title) === -1) {
      $scope.projects.push(project.title);
      todoStorage.putProject(project.title);
    }

    console.log($scope.projects);

    $scope.selectProject(project.title);
    $scope.projectModal.hide();

    project.title = '';
  };

  $scope.newProject = function() {
    $scope.projectModal.show();
  };

  $scope.closeNewProject = function() {
    if($scope.projects.length === 0) {
      alert("You must have atleast one project");
      return;
    }
    $scope.projectModal.hide();
  };

  $scope.selectProject = function(project) {
    if($scope.activeProject == project) {
      $scope.sideMenuController.close();
      return;
    }
    $scope.activeProject = project;
    $scope.todos = todoStorage.getTodos($scope.activeProject);
    todoStorage.setLastActiveProject(project);
    $scope.sideMenuController.close();
  };

  $scope.addTodo = function(todo) {
    if(todo === null || todo === undefined || todo === '') {
      return;
    }

    $scope.todos.push({
      title: todo.title,
      completed: false
    });

    todoStorage.putTodo($scope.activeProject, $scope.todos);
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
        $scope.newProject();
        break;
      }
    }
  });

});