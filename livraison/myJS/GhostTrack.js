
GhostTrack = {};

(function() {

var startTime = (new Date()).getTime(); 
var positions = [];

GhostTrack.add = function(pos) {
	positions.push(pos);
	localStorage.setItem(startTime, JSON.stringify(positions));
};

for(var i = 0; i < localStorage.length; i++) {
	console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));	
}


})();
