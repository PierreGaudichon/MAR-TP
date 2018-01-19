
MovementManagement = {};


(function() {
	
MovementManagement.CAR = "car";
MovementManagement.HELICO = "helico";

var speed = 5;

var movements = {
	
	car: {
		right: function(arg) {
			arg.car.vehicle.turnRight(2000);
		},
		left: function(arg) {
			arg.car.vehicle.turnLeft(2000);
		},
		up: function(arg) {
			arg.car.vehicle.goFront(1200, 1200);
		},
		down: function(arg) {
			arg.car.vehicle.brake(100);
		}
	},
	
	helico: {
		right: function(arg) {
			arg.helico.turnRight();
		},
		left: function(arg) {
			arg.helico.turnLeft();
		},
		up: function(arg) {
			arg.helico.speedup();
		},
		down: function(arg) {
			arg.helico.brake();
		}
	}
}


MovementManagement.current = MovementManagement.CAR;
	
	
MovementManagement.handleKeys = function(arg) {
	/*if (arg.currentlyPressedKeys[67]) { // (C) debug
		// debug scene
		arg.renderingEnvironment.scene.traverse(function(o){
			console.log('object:'+o.name+'>'+o.id+'::'+o.type);
		});
	}*/	
	if (arg.currentlyPressedKeys[68]) { // (D) Right
		movements[MovementManagement.current].right(arg);
	}
	if (arg.currentlyPressedKeys[81]) { // (Q) Left 
		movements[MovementManagement.current].left(arg);
	}
	if (arg.currentlyPressedKeys[90]) { // (Z) Up
		movements[MovementManagement.current].up(arg);
	}
	if (arg.currentlyPressedKeys[83]) { // (S) Down 
		movements[MovementManagement.current].down(arg);
	}
}

})();
