todoapp.controller('TodoCtrl', function TodoCtrl($scope, $location, $timeout, todoStorage, filterFilter, Modal) {
    $scope.projects = todoStorage.getProjects();
    $scope.activeProject = todoStorage.getLastActiveProject();
    $scope.todos = todoStorage.getTodos($scope.activeProject);

    if ($location.path() === '') {
        $location.path('/');
    }

    $scope.location = $location;

    $scope.$watch('location.path()', function (path) {
        console.log(path);
        console.log($scope.todos);
        if(path == '/active') {
            $scope.statusFilter = {completed: false};
        } else if(path == '/completed') {
            $scope.statusFilter = {completed: true};
        } else {
            $scope.statusFilter = {};
        }
    });

    $scope.$watch('remainingCount == 0', function (val) {
        $scope.allChecked = val;
    });

    Modal.fromTemplateUrl('new-todo.html', function (modal) {
        $scope.todoModal = modal;
    }, {
        scope: $scope
    });

    Modal.fromTemplateUrl('new-project.html', function (modal) {
        $scope.projectModal = modal;
    }, {
        scope: $scope
    });

    $scope.addProject = function (project) {
        if (project === null || project === undefined || project === '' || project.title === '') {
            return;
        }

        if ($scope.projects.indexOf(project.title) === -1) {
            $scope.projects.push(project.title);
            todoStorage.putProject(project.title);
        }

        console.log($scope.projects);

        $scope.selectProject(project.title);
        $scope.projectModal.hide();

        project.title = '';
    };

    $scope.newProject = function () {
        $scope.projectModal.show();
    };

    $scope.closeNewProject = function () {
        if ($scope.projects.length === 0) {
            alert("You must have atleast one project");
            return;
        }
        $scope.projectModal.hide();
    };

    $scope.selectProject = function (project) {
        if ($scope.activeProject == project) {
            $scope.sideMenuController.close();
            return;
        }
        $scope.activeProject = project;
        $scope.todos = todoStorage.getTodos($scope.activeProject);
        todoStorage.setLastActiveProject(project);
        $scope.sideMenuController.close();
    };

    $scope.addTodo = function (todo) {
        if (todo === null || todo === undefined || todo === '' || todo.title === '') {
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

    $scope.removeTodo = function (todo) {
        $scope.remainingCount -= todo.completed ? 0 : 1;
        todos.splice(todos.indexOf(todo), 1);
        todoStorage.put(todos);
    };

    $scope.todoCompleted = function (todo) {
        todo.completed = todo.completed ? false : true;
        todoStorage.putTodo($scope.activeProject, $scope.todos);
    };

    $scope.clearCompletedTodos = function () {
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

    $scope.toggleProjects = function () {
        $scope.sideMenuController.toggleLeft();
    };

    $scope.newTodo = function () {
        $scope.todoModal.show();
    };

    $scope.closeNewTodo = function () {
        $scope.todoModal.hide();
    };

    $timeout(function () {
        if ($scope.projects.length === 0) {
            while (true) {
                $scope.newProject();
                break;
            }
        }
    });

});