
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/DebugManagement.js",
	"myJS/helico/Propeller.js",
	"myJS/helico/Helico.js"
], function() {
	
	
var maxId = 0;

	
HelicoKey = class HelicoKey extends Helico {
	
	constructor({ x, y, z }, { renderingEnvironment, Loader }) {
		// super
		super({ x, y, z }, {renderingEnvironment, Loader });
		// speed
		this.speed = 0; // px/frame
		this.MAX_SPEED = 10; // px/frame
		this.acceleration = 0.5; // px.frame^-2
		this.frictionDeceleration = 0.1;
		DebugManagement.set({"helico.speed": this.speed});
		
	}
	
	turnLeft() {
		var newRotation = this.rightPropeller.position.rotation.z + this.propellerRotationSpeed;
		this.rightPropeller.position.rotation.z = newRotation;
		this.leftPropeller.position.rotation.z = newRotation;
	}
	
	turnRight() {
		var newRotation = this.rightPropeller.position.rotation.z - this.propellerRotationSpeed;
		this.rightPropeller.position.rotation.z = newRotation;
		this.leftPropeller.position.rotation.z = newRotation;
	}
	
	speedup() {
		this.setSpeed(this.speed + this.acceleration);
	}
	
	brake() {
		this.setSpeed(this.speed - this.acceleration);
	}
	
	handleMovementKeys() {
		// handle helico rotation
		// shortcuts
		var propellerRotation = this.rightPropeller.position.rotation.z;
		var corpRotation = (this.position.rotation.z + 2*Math.PI) % (2*Math.PI);
		// right key is being pressed
		if(propellerRotation > this.corpRotationSpeed) {
			corpRotation += this.corpRotationSpeed;
			propellerRotation -= this.corpRotationSpeed;
		// left key is being pressed
		} else if(propellerRotation < -this.corpRotationSpeed) {
			corpRotation -= this.corpRotationSpeed;
			propellerRotation += this.corpRotationSpeed;
		// the helico is behind (going right)
		} else if(propellerRotation > 0) {
			corpRotation = corpRotation - propellerRotation;
			propellerRotation = 0;
		// the helico is behind (going left)
		} else if(propellerRotation < 0) {
			corpRotation = corpRotation + propellerRotation;
			propellerRotation = 0;
		}
		// set everithing
		this.rightPropeller.position.rotation.z = propellerRotation;
		this.leftPropeller.position.rotation.z = propellerRotation;
		this.position.rotation.z = corpRotation;
		
		// handle speed
		this.setSpeed(this.speed - this.frictionDeceleration);
		this.position.position.y += this.speed * Math.cos(this.position.rotation.z);
		this.position.position.x -= this.speed * Math.sin(this.position.rotation.z);
		DebugManagement.set({ "helico.x": this.position.position.x });
		DebugManagement.set({ "helico.y": this.position.position.y });
	}
	
	tick() {
		this.handleMovementKeys();
		super.tick();
	}
}
	
});
