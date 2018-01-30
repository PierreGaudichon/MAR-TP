
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
		this.setRotation(this.rightPropeller.position.rotation.z + this.propellerRotationSpeed);
	}
	
	turnRight() {
		this.setRotation(this.rightPropeller.position.rotation.z - this.propellerRotationSpeed);
	}
	
	speedup() {
		this.setSpeed(this.speed + this.acceleration);
	}
	
	brake() {
		this.setSpeed(this.speed - this.acceleration);
	}
	
	handleSpeed() {
		// handle speed
		this.setSpeed(this.speed - this.frictionDeceleration);
		this.position.position.y += this.speed * Math.cos(this.position.rotation.z);
		this.position.position.x -= this.speed * Math.sin(this.position.rotation.z);
		DebugManagement.set({ "helico.x": this.position.position.x });
		DebugManagement.set({ "helico.y": this.position.position.y });
	}
	
	tick() {
		this.handleRotation();
		this.handleSpeed();
		super.tick();
	}
}
	
});
