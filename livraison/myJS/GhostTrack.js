
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/Car.js"
]);



GhostTrack = {};

(function() {

var startTime = (new Date()).getTime(); 
var positions = [];
var ghosts = [];

GhostTrack.add = function(pos) {
	positions.push(pos);
	localStorage.setItem(startTime, JSON.stringify(positions));
};

GhostTrack.register = function(item, env) {
	if(item.length > 0) {
		ghosts.push(new GhostCar(item, env));
	}
}


GhostTrack.move = function() {
	ghosts.forEach(function(ghost) {
		ghost.move();
	});
}



})();
