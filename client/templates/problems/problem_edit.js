Template.problemEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentProblemId = this._id;

		var problemProperties = {
			message: $(e.target).find('[name=message]').val(),
			url: $(e.target).find('[name=url]').val()
		}

		Problems.update(currentProblemId, {$set: problemProperties}, function(error){
			if(error) {
				return notify(error.reason, 'danger');
			} else {
				Router.go('problemShow', {_id: currentProblemId});
			}
		})
	},

	'click .delete': function(e) {
		e.preventDefault();

		if(confirm("Are you sure you want to delete this problem?")) {
			var currentProblemId = this._id;
			Problems.remove(currentProblemId);
			Router.go('home');
		}
	}
});