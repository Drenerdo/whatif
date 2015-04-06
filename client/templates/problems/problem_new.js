Template.problemNew.events({
	'submit form': function(e) {
		e.preventDefault();

		var problem = {
			message: $(e.target).find('[name=message]').val(),
			url: $(e.target).find('[name=url]').val()
		}

		Meteor.call('problem', problem, function(error, id){
			if(error) {
				notify(error.reason, 'danger');

				if(error.error === 302)
					Router.go('problemShow', {_id: error.details});
			} else {
				Router.go('problemShow', {_id: id});
			}
		});
	}
});