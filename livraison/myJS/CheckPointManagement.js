
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/NAVManagement.js"
]);



var allPlanes = [];
var checkPoints = {};
var onWrongDirection = function() {};



CheckPointManagement = {};




CheckPointManagement.onWrongDirection = function(fun) {
	onWrongDirection = fun;
};

CheckPointManagement.onPlaneEntry = function(plane, fun) {
	if(checkPoints[plane]) {
		checkPoints[plane].push(fun);
	} else {
		checkPoints[plane] = [fun];
	}
}


CheckPointManagement.tick = function(NAV) {
	var plane = NAVManagement.getCurrentPlane(NAV);
	
	var empty = (allPlanes.length == 0);
	var differentLast = (allPlanes[allPlanes.length-1] != plane);
	//console.log({empty, differentLast});
	if(empty) {
		allPlanes.push(plane);
	}
	if(!empty && differentLast) {
		allPlanes.push(plane);
		var penultimate = allPlanes[allPlanes.length-2];
		
		var advanced = plane > penultimate;
		var last = ((plane == 1) && (penultimate == 30));
		var wrongDirection = (!(advanced || last));
		if(wrongDirection) {
			onWrongDirection();
		}
		
		if(!wrongDirection && checkPoints[plane]) {
			checkPoints[plane].forEach(function(fun) { fun(); });
		}
	}
	
	
	
	
}
