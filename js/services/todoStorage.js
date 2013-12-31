todoapp.factory('todoStorage', function(filterFilter) {
  return {
    getTodos: function(project) {
      return angular.fromJson(localStorage.getItem('project-' + project) || '[]');
    },
    putTodo: function(project, todos) {
      localStorage.setItem('project-' + project, angular.toJson(todos));
    },
    getProjects: function() {
      var projects = filterFilter(Object.keys(localStorage), 'project-');
      for(var i=0; i<projects.length; i++) {
        projects[i] = projects[i].replace('project-', '');
      }
      return projects;
    },
    putProject: function(project) {
      localStorage.setItem('project-' + project, '');
    },
    getLastActiveProject: function() {
      return localStorage.getItem('lastActiveProject') || this.getProjects()[0];
    },
    setLastActiveProject: function(project) {
      localStorage.setItem('lastActiveProject', project);
    }
  };
});