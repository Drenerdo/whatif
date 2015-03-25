Template.problemSubmit.created = function() {
  Session.set('problemSubmitErrors', {});
}

Template.problemSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('problemSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('problemSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.problemSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var problem = {
      url: $(e.target).find('[name=url]').val(),
      description: $(e.target).find('[name=description]').val()
    };

    var errors = validateProblem(problem);

    if(errors.description || errors.url)
      return Session.set('problemSubmitErrors', errors);


    Meteor.call('problemInsert', problem, function(error, result) {
      if(error)
        return throwError(error.reason);

      if(result.problemExists)
        throwError('This link has already been posted');

      Router.go('problemPage',  {_id: result._id});
    });
  }
});
