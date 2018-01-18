
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/CheckPointManagement.js",
	"myJS/DebugManagement.js"
]);


var MAX_LAPS = 2;

var onLapFinisheds = [];
var onFinisheds = [];
var otherSideOk = false;
var laps = 0;


DebugManagement.set({
	"lap.nbs": laps,
	"lap.15_checkpoint": false,
	"lap.course_over": false,
	"lap.max_laps": MAX_LAPS
});
			

LapManagement = {}

LapManagement.onLapFinished = function(fun) {
	onLapFinisheds.push(fun);
}

LapManagement.onFinished = function(fun) {
	onFinisheds.push(fun);
}

CheckPointManagement.onPlaneEntry(2, function() {
	if(otherSideOk) {
		otherSideOk = false;
		laps++;
		DebugManagement.set({"lap.15_checkpoint": false});
		DebugManagement.set({"lap.nbs": laps});
		onLapFinisheds.forEach(function(fun) { fun(laps); });
		
		if(laps >= MAX_LAPS) {
			DebugManagement.set({"lap.course_over": true});
			onFinisheds.forEach(function(fun) { fun(laps); });
		}
	}
});


CheckPointManagement.onPlaneEntry(15, function() {
	otherSideOk = true;
	DebugManagement.set({"lap.15_checkpoint": true});
})
