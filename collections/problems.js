Problems = new Meteor.Collection('problems');

Problems.allow({
	update: function(userId, problems) { return ownsDocument(userId, problem); },
	remove: function(userId, problems) { return ownsDocument(userId, problem); },
});

Problems.deny({
	update: function(userId, problem, field){
		return(_.without(fields, 'message', 'url').length > 0);
	}
});

Meteor.methods({
	problems: function(problemAttributes){
		var user = Meteor.user();
		var problemWithSameLink = Problems.findOne({url: problemAttributes.url});

		if(!user)
			throw new Meteor.Error(401, "You need to login to create a solution to this problem");

		if(!problemAttributes.message)
			throw new Meteor.Error(422, "Please complete the fields");

		if(problemAttributes.url && problemWithSameLink)
			throw new Meteor.Error(302, "This URL has already been posted", problemWithSameLink._id);

		var problems = _.extend(_.pick(problemAttributes, 'message', 'url'), {
			userId: user._id,
			author: user.username,
			votes: 0,
			voters: [],
		});

		var problemsId = Problems.insert(problem);

		return problemsId;
	},

	votes: function(id, vote) {
		var problems = Problems.findOne(id);
		var user = Meteor.user();

		if(!user)
			throw new Meteor.Error(401, "You need to login to vote");

		if(!problem) {
			throw new Meteor.Error(422, "Couldn't find the problem");
		} else {
			if(vote > 0) {
				Problems.update({_id: problem._id, voters: {$ne: user._id}}, {$addToSet: {voters: user._id}, $inc: {votes: vote}}, function(error){
					if(error)
						throw new Meteor.Error(422, error.reason);
				})
			} else {
				Problems.update({_id: problem._id, voters: {$in: [user._id]}}, {$pull: {voters: user._id}, $inc: {votes: vote}}, function(error){
					if(error)
						throw new Meteor.Error(422, error.reason);
				})
			}
		}
	}
});