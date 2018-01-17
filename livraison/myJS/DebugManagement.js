

DebugManagement = {};

var toBeLogged = {};

DebugManagement.set = function(stuff) {
	Object.keys(stuff).forEach(function(key) {
		toBeLogged[key] = stuff[key];
	});
}

DebugManagement.update = function() {
	console.log(toBeLogged);
}
