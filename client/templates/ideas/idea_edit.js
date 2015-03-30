Template.ideaEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentIdeaId = this._id;

		var ideaProperties = {
			problem: $(e.target).find('[name=problem]').val(),
			law: $(e.target).find('[name=law]').val(),
			response: $(e.target).find('[name=response]').val(),
			url: $(e.target).find('[name=url]').val()
		}

		Idea.update(currentIdeaId, {$set: ideaProperties}, function(error){
			if(error) {
				return notify(error.reason, 'danger');
			} else {
				Router.go('ideaShow', {_id: currentIdeaId});
			}
		})
	},

	'click .delete': function(e) {
		e.preventDefault();

		if(confirm("Are you sure you want to delete this awesome idea?")) {
			var currentIdeaId = this._id;
			Ideas.remove(currentIdeaId);
			Router.go('home');
		}
	}
});