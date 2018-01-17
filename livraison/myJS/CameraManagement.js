
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/NAVManagement.js"
]);


var cameras = {

	embedded: {
		load: function(arg) {
			arg.carGeometry.add(arg.renderingEnvironment.camera);
			arg.renderingEnvironment.camera.position.x = 0;
			arg.renderingEnvironment.camera.position.z = 10;
			arg.renderingEnvironment.camera.position.y = -25;
			arg.renderingEnvironment.camera.rotation.x = Math.PI * (85/180);
			arg.renderingEnvironment.camera.rotation.y = 0;
			arg.renderingEnvironment.camera.rotation.z = 0;
		},
		unload: function(arg) {
			arg.carGeometry.remove(arg.renderingEnvironment.camera);
		}
	},
	
	hovering: {
		load: function(arg) {
			arg.renderingEnvironment.camera.rotation.x = 0;
			arg.renderingEnvironment.camera.rotation.y = 0;
		},		
		render: function(arg) {
			arg.renderingEnvironment.camera.position.x = arg.NAV.x;
			arg.renderingEnvironment.camera.position.y = arg.NAV.y;
			arg.renderingEnvironment.camera.position.z = arg.NAV.z + 50 + arg.vehicle.speed.length()*2;
			arg.renderingEnvironment.camera.rotation.z = arg.vehicle.angles.z - Math.PI/2;
		}
	},
	
	tv: {
		render: function(arg) {
			// Creates several cameras to cover all the track.
			var cameraPositions = [
				new THREE.Vector3(-280, 0, 60),
				new THREE.Vector3(-100, 280, 100),
				new THREE.Vector3(100, 160, 140),
				new THREE.Vector3(220, 100, 100),
				new THREE.Vector3(180, -260, 100),
				new THREE.Vector3(-20, -40, 160),
				new THREE.Vector3(-140,-280, 100)
			];
			// Associate a plane (part of the track) to a specific camera.
			var cameraOfPlane = {
				30:0,  1:0,  2:0,
				 3:1,  4:1,  5:1,  6:1,
				 7:2,  8:2,  9:2, 10:2,
				11:3, 12:3, 13:3, 14:3,
				15:4, 16:4, 17:4, 18:4, 19:4,
				20:5, 21:5, 22:5, 23:5, 24:5,
				25:6, 26:6, 27:6, 28:6, 29:6
			};
			// Get the actual camera position according to the plane the car is in.
			var cameraPosition = cameraPositions[cameraOfPlane[NAVManagement.getCurrentPlane(arg.NAV)]];
			arg.renderingEnvironment.camera.position.x = cameraPosition.x;
			arg.renderingEnvironment.camera.position.y = cameraPosition.y;
			arg.renderingEnvironment.camera.position.z = cameraPosition.z;
			// Set the rotation of the camera so it look at the car.
			arg.renderingEnvironment.camera.up = new THREE.Vector3(0, 0, 1);
			arg.renderingEnvironment.camera.lookAt(arg.NAV);
		}
	}
};


var currentIndex = -1;
var currentCamera = {};

CameraManagement = {}

CameraManagement.init = function(arg) {
	CameraManagement.switch(arg);
};

CameraManagement.switch = function(arg) {
	// Unload previous camera
	if(currentCamera.unload) {
		currentCamera.unload(arg);
	}
	// Change camera
	var nbCamera = Object.keys(cameras).length;
	currentIndex = (currentIndex + 1) % nbCamera;
	currentCamera = cameras[Object.keys(cameras)[currentIndex]];
	// Load new camera
	if(currentCamera.load) {
		currentCamera.load(arg)
	}
	// Set render of new camera
	if(currentCamera.render) {
		CameraManagement.render = currentCamera.render;
	} else {
		CameraManagement.render = function() {};
	}
};

CameraManagement.render = function() {};


