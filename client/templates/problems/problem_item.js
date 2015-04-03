var PROBLEM_HEIGHT= 80;
var Positions = new Meteor.Collection(null);

Template.problemItem.helpers({
	ownProblem: function() {
		return this.userId === Meteor.userId();
	},
	trackback: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},
	votesCount: function() {
		var v = this.votes;
		if(isNaN(v))
			v = 0;

		return v;
	},
	attributes: function() {
		var problem = _.extend({}, Positions.findOne({problemId: this._id}), this);
		var newPosition = problem._rank * PROBLEM_HEIGHT;
		var attributes = {};

		if(_.isUndefined(problem.position)){
			attributes.class = 'Problem invisible';
		} else {
			var delta = problem.position - newPosition;
			attributes.style = "top: " + delta + "px";

			if(delta === 0)
				attributes.class = "Problem animated"
		}

		Meteor.setTimeout(function(){
			Positions.upsert({problemId: problem._id}, {$set: {problem: newPosition}})
		});

		return attributes;
	}
});

Template.problemItem.events({
	'click .vote-up': function(e) {
		e.preventDefault();
		Meteor.call('vote', this._id, 1, function(error, id){
			if(error)
				return notify(error.reason, 'danger');
		});
	},
	'click .vote-down': function(e) {
		e.preventDefault();
		if(this.votes === 0) {
			return false;
		} else {
			Meteor.call('vote', this._id, -1, function(error, id){
				if(error)
					return notify(error.reason, 'danger');
			})
		}
	}
});