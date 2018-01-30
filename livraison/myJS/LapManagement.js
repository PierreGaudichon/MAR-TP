
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/CheckPointManagement.js",
	"myJS/DebugManagement.js"
]);


LapManagement = {};


(function() {


var MAX_LAPS = 2;
var otherSideOk = false;
var lapsTimes = [];
var startLapTime = (new Date()).getTime();


DebugManagement.set({
	"lap.nbs": 0,
	"lap.15_checkpoint": false,
	"lap.course_over": false,
	"lap.max_laps": MAX_LAPS
});
			

function lapFinished() {
	DebugManagement.set({"lap.15_checkpoint": false});
	DebugManagement.set({"lap.nbs": lapsTimes.length});
	var now = (new Date()).getTime();
	lapsTimes.push((now - startLapTime)/1000);
	startLapTime = now;
	$lapsCounter.counter++;
}


function raceFinished() {
	DebugManagement.set({"lap.course_over": true});
	$win.won = true;
}


CheckPointManagement.onPlaneEntry(2, function() {
	if(otherSideOk) {
		otherSideOk = false;
		lapFinished();
		
		if(lapsTimes.length >= MAX_LAPS) {
			raceFinished();
		}
	}
});


CheckPointManagement.onPlaneEntry(15, function() {
	otherSideOk = true;
	DebugManagement.set({"lap.15_checkpoint": true});
});


var $win = new Vue({
	el: "#win",
	data: {
		won: false
	}
})

var $lapsCounter = new Vue({
	el: "#laps-counter",
	data: {
		times: lapsTimes,
		maxLaps: MAX_LAPS,
		elapsedTime: 0,
		counter: 0
	},
});

setInterval(function() {
	$lapsCounter.elapsedTime = Math.round(((new Date()).getTime() - startLapTime)/10)/100;
}, 30);

})();
