

DebugManagement = {};


var debug = new Vue({
  el: '#debug',
  data: {
		logs: {},
		enabled: false
	}
});

DebugManagement.set = function(stuff) {
	Object.keys(stuff).forEach(function(key) {
		Vue.set(debug.logs, key, stuff[key]);
	});
}

DebugManagement.toggle = function(bool) {
	if(bool !== undefined) {
		debug.enabled = bool;
	} else {
		debug.enabled = !debug.enabled
	} 
}
