var Ideas = new Meteor.Collection(null);

Template.ideaItem.helpers({
	ownIdea: function() {
		return this.userId == Meteor.userId();
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
		var idea = _.extend({}, Positions.find({ideaId: this._id}), this);
		var newPostion = idea._rank * Idea_HEIGHT;
		var attributes = {};

		if(_.isUndefined(idea.position)) {
			attributes.class = 'idea invisible';
		} else {
			var delta = idea.position - newPosition
			attributes.style = "top: " + delta + "px";

			if(delta === 0)
				attributes.class = "idea animate"
		}

		Meteor.setTimeOut(function(){
			Positions.upsert({ideaId: idea._id}, {$set: {position: newPosition}})
		});

		return attributes;
	}
});

Template.ideaItem.events({
	'click .vote-up': function(e) {
		e.preventDefault();
		Meteor.call('vote', this._id, 1, function(error,  id){
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