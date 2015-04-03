Template.problemsList.helpers({ problemsWithRank: function() {
	this.problems.rewind();
	return this.problems.map(function(problem, index, cursor){
		problem._rank = index;
		return problem; });
	}
});