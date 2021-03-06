Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

ProblemsListController = RouteController.extend({
  template: 'dashboard',
  increment: 5,
  problemsLimit: function() {
    return parseInt(this.params.problemsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.problemsLimit()};
  },
  subscriptions: function() {
    this.problemsSub = Meteor.subscribe('problems', this.findOptions());
  },
  problems: function() {
    return Problems.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      problems: self.problems(),
      ready: self.problemsSub.ready,
      nextPath: function() {
        if(self.problems().count() === self.problemsLimit())
          return self.nextPath();
      }
    };
  }
});

NewProblemsController = ProblemsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newProblems.path({problemsLimit: this.problemsLimit() + this.increment})
  }
});


// Idea Section
IdeasListController = RouteController.extend({
  template: '',
  increment: 5,
  ideasLimit: function() {
    return parseInt(this.params.ideasLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.ideasLimit()};
  },
  subscriptions: function() {
    this.ideasSub = Meteor.subscribe('ideas', this.findOptions());
  },
  ideas: function() {
    return Ideas.find({}, this.findOptions);
  },
  data: function() {
    var self = this;
    return {
      ideas: self.ideas(),
      ready: self.ideasSub.ready,
      nextPath: function() {
        if(self.ideas().count() === self.ideasLimit())
          return self.nextPath();
      }
    };
  }
});

NewIdeasController = IdeasListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newIdeas.path({ideasLimit: this.ideasLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewProblemsController
});

Router.route('copyright', {
  name: 'copyright'
});

Router.route('ideaForm', {
  name: 'ideaForm'
});

Router.route('quickForm', {
  name: 'quickForm'
});

Router.route('problemNew', {
  name: 'problemNew'
});

Router.route('selection', {
  name: 'selection'
});

Router.route('article', {
  name: 'article'
});

// Router.route('/submit', {name: 'ideaSubmit'});


Router.route('/problems/:_id', {
  name: 'problemPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleProblem', this.params._id)
    ];
  },
  data: function() { return Problems.findOne(this.params._id); }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'problemPage'});
Router.onBeforeAction(requireLogin, {only: 'problemNew'});
Router.onBeforeAction(requireLogin, {only: 'ideaForm'});
