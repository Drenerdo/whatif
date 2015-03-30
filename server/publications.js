Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});

Meteor.publish('problem', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Problems.find({}, options);
});

Meteor.publish('singleProblem', function(id) {
  check(id, String);
  return Problem.find(id);
});

Meteor.publish('idea', function(options){
  check(options, {
    sort: Object,
    limit: Number
  });
  return Ideas.find({}, options);
});

Meteor.publish('singleIdea', function(id) {
  check(id, String);
  return Problem.find(id);
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
