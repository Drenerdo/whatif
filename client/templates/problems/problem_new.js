Template.problemNew.events({
	'submit form': function(e) {
		e.preventDefault();

		var problem = {
			url: $(e.target).find('[name=url]').val(),
			message: $(e.target).find('[name=message]').val()
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