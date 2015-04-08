Template.ideaEdit.created = function() {
	Session.set('ideaEditErrors', {});
}

Template.ideaEdit.helpers({
	errorMessage: function(field) {
		return Session.get('ideaEditErrors')[field];
	},
	errorMessage: function(field) {
		return !!Session.get('ideaEditErrors')[field] ? 'has-error' : '';
	}
});

Template.ideaEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentIdeaId = this._id;

		var ideaProperties = {
			message: $(e.target).find('[name=message]').val(),
			problem: $(e.target).find('[name=problem]').val(),
			law: $(e.target).find('[name=law]').val(),
			response: $(e.target).find('[name=response]').val(),
			url: $(e.target).find('[name=url]').val()
		}

		var errors = validateIdea(ideaProperties);
		if(errors.message || errors.url || errors.problem || errors.law || errors.response);
			return Session.set('ideaEditErrors', errors);

		Ideas.update(currentIdeaId, {$set: ideaProperties}, function(error){
			if(error) {
				throwError(error.reason);
			} else {
				Router.go('ideaPage', {_id: currentIdeaId });
			}
		});
	},

	'click delete': function(e) {
		e.preventDefault();

		if(confirm("Delete this idea?")) {
			var currentIdeaId = this._id;
			Ideas.remove(currentIdeaId);
			Router.go('home');
		}
	}
});

