
                            
NAVManagement = {};

NAVManagement.getCurrentPlane = function(NAV) {
	return parseInt(NAV.findActive(NAV.x, NAV.y)) + 1;
}
