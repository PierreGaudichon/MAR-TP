

DebugManagement = {};


(function() {

var isVue = (typeof variable !== 'undefined');
var debug;


if(isVue) {
	debug = new Vue({
		el: '#debug',
		data: {
			logs: {},
			enabled: false
		}
	});	
} else {
	debug = { enabled: false };
}

DebugManagement.set = function(stuff) {
	Object.keys(stuff).forEach(function(key) {
		if(isVue) Vue.set(debug.logs, key, stuff[key]);
	});
}

DebugManagement.toggle = function(bool) {
	if(bool !== undefined) {
		debug.enabled = bool;
	} else {
		debug.enabled = !debug.enabled
	} 
}

})();
