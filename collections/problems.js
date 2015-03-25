// Problems = new Mongo.Collection('problems');
//
// Problems.allow({
//   update: function(userId, problem) { return ownsDocument(userId, problem); },
//   remove: function(userId, problem) { return ownsDocument(userId, problem); },
// });
//
// Problems.deny({
//   update: function(userId, problem, fieldNames) {
//     return (_.without(fieldNames, 'description', 'url').length > 0);
//   }
// });
//
// Problems.deny({
//   update: function(userId, problem, fieldNames, modifier) {
//     var errors = validateProblem(modifier.$set);
//     return errors.description || error.url;
//   }
// });
//
// validateProblem = function(problem) {
//   var errors = {};
//
//   if(!problem.description)
//     errors.description = "Please fill in a description";
//
//   if(!problem.url)
//     errors.url = "Please enter a url";
//
//   return errors;
//
// }
//
// Meteor.methods({
//   problemInsert: function(problemAttributes) {
//     check(this.userId, String);
//     check(problemAttributes, {
//       description: String,
//       url: String
//     });
//
//     var errors = validateProblem(ProblemAttributes);
//     if(errors.problem || errors.url)
//       throw new Meteor.Error('invalid-problem', "You must set a description and URL for your problem");
//
//     var problemWithSameLink = Problems.findOne({url: problemAttributes.url});
//     if(problemWithSameLink) {
//       return {
//         problemExists: true,
//         _id: problemWithSameLink._id
//       }
//     }
//
//     var user = Meteor.user();
//     var problem = _.extend(problemAttributes, {
//       userId: user._id,
//       author: user.username,
//       submitted: new Date(),
//       upvoters: [],
//       votes: 0
//     });
//
//
//     var problemId = Problems.insert(problem);
//
//     return {
//       _id: problemId
//     };
//   },
//
//   upvote: function(problemId) {
//     check(this.userId, String);
//     check(problemId, String);
//
//     var affected = Problems.update({
//       _id: problemId,
//       upvoters: {$ne: this.userId}
//     }, {
//       $addToSet: {upvoters: this.userId},
//       $inc: {votes: 1}
//     });
//
//
//     if(!affected)
//       throw new Meteor.Error('invalid', "You weren't able to upvote that problem");
//   }
// });
