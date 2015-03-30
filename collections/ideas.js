Ideas = new Meteor.Collection('ideas');

Ideas.allow({
	update: function(userId, idea) { return ownsDocument(userId, idea);},
	remove: function(userId, idea) { return ownsDocument(userId, idea);}
});

Ideas.deny({
	update: function(userId, idea, fields) {
		return(_.without(fields, 'problem', 'law', 'response'). length > 0);
	}
});

Meteor.methods({
	idea: function(ideaAttributes) {
		var user = Meteor.user();
		var ideaWithSameLink = Ideas.findOne({url: ideaAttributes.url});

		if(!user)
			throw new Meteor.Error(401, "You need to login to submit a idea"); 
		if(!ideaAttributes.url && postWithSameLink)
			throw new Meteor.Error(302, 'This url has already been posted', postWithSameLink._id);

		var idea = _.extend(_.pick(ideaAttributes, 'problem', 'law', 'response'), {
			userId: user._id,
			author: user.username,
			votes: 0,
			voters: [],
			commentsCount: 0,
			createdAt: moment().format("X"),
			updatedAt: moment().format("X")
		});

		var ideaId = Ideas.insert(idea);

		return ideaId;
	},

	vote: function(id, vote) {
		var idea = Ideas.findOne(id);
		var user = Meteor.user();

		if(!user)
			throw new Meteor.Error(401, "You need to login to vote");

		if(!idea) {
			throw new Meteor.Error(422, "Couldn't find the idea");
		} else {
			if(vote > 0) {
				Votes.update({_id: idea._id, voters: {$ne: user._id}}, {$addToSet: {voters: user._id}, $inc:{ votes: vote}}, function(error){
					if(error)
						throw new Meteor.Error(422, error.reason);
				})
			} else {
				Ideas.update({_id: idea._id, votes: {$in: [user._id]}}, {$pull: {voters: user._id}, $inc: {votes: vote}}, function(error){
					if(error)
						throw new Meteor.Error(422, error.reason);
				})
			}
		}
	}
});