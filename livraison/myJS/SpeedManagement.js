
SpeedManagement = {};

var KMHCOEF = 50;

var positions = [];

SpeedManagement.addPosition = function(position) {
	positions.push(position);
};

SpeedManagement.speed = function() {
	if(positions.length < 2) {
		return 0;
	} else {
		var last = positions[positions.length-1];
		var penultimate = positions[positions.length-2];
		var diff = {x: last.x-penultimate.x, y: last.y-penultimate.y};
		var len = Math.sqrt(diff.x*diff.x + diff.y*diff.y)
		return Math.floor(len * KMHCOEF);
	}
}
