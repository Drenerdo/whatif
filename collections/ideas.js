Ideas = new Mongo.Collection('ideas');

Ideas.allow({
	update: function(userId, idea) { return ownsDocument(userId, idea); },
	remove: function(userId, idea) { return ownsDocument(userId, idea); },
});

Ideas.deny({
	update: function(userId, idea, fieldNames) {
		return (_.without(fieldNames, 'url', 'message', 'problem', 'law', 'response').length > 0);
	}
});

Ideas.deny({
	update: function(userId, idea, fieldNames, modifier) {
		var errors = validateIdea(modifier.$set);
		return errors.message || errors.url || errors.problem || errors.law || errors.response;
	}
});

validateIdea = function(idea) {
	var errors = {};

	if(!idea.message)
		errors.message = "Please enter in a solution to this problem";

	if(!idea.url)
		errors.url = "Please fill in a URL";

	return errors;
}

Meteor.methods({
	ideaInsert: function(ideaAttributes) {
		check(this.userId, String);
		check(ideaAttributes, {
			message: String,
			problem: String,
			law: String,
			response: String,
			url: String
		});

		var errors = validateIdea(ideaAttributes);
		if(errors.message || errors.url || errors.problem || errors.law || errors.response)
			throw new Meteor.Error('invalid-idea', "You must set a message and URL for your idea");

		var ideaWithSameLink = Ideas.findOne({url: ideaAttributes.url});
		if(ideaWithSameLink) {
			return {
				ideaExists: true,
				_id: ideaWithSameLink._id
			}
		}

		var user = Meteor.user();
		var idea = _.extend(ideaAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			upvoters: [],
			votes: 0
		});

		var ideaId = Ideas.insert(idea);

		return {
			_id: ideaId
		};
	},
});