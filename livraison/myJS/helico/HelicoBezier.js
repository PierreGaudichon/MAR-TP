
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/DebugManagement.js",
	"myJS/helico/Propeller.js",
	"myJS/helico/Helico.js",
	"myJS/Bezier.js"
], function() {
	
	
var maxId = 0;

	
function makeVects(controls, fun, speed) {
	return [].concat.apply([], controls.map((control) => {
		var steps = Bezier.length(control)/speed;
		return Bezier.interpolate(fun(control), steps);
	}));
}
		
		
HelicoBezier = class HelicoBezier extends Helico {
	
	constructor(controls, { renderingEnvironment, Loader }) {
		// super
		super({ x: 0, y: 0, z: 0 }, { renderingEnvironment, Loader });
		// speed
		this.speed = 2; // px/frame
		DebugManagement.set({"helico.speed": this.speed});
		// controls
		this.controls = controls;
		this.steps = Math.floor(controls.map(Bezier.length).reduce((a, b) => a+b)/this.speed);
		this.avancement = 0;
		// curves
		this.curves = {
			position: makeVects(this.controls, Bezier.cubic, this.speed),
			speed: makeVects(this.controls, Bezier.cubicdt, this.speed),
			acceleration: makeVects(this.controls, Bezier.cubicdt2, this.speed)
		};
	}
	
	
	makeRotation() {
		var speed = this.curves.speed[this.avancement];
		var angle = (speed.angleTo(new THREE.Vector3(1, 0, 0)) + Math.PI/2);
		DebugManagement.set({"helicoBezier.speed.x": speed.x});
		DebugManagement.set({"helicoBezier.speed.y": speed.y});
		DebugManagement.set({"helicoBezier.speed.z": speed.z});
		DebugManagement.set({"helicoBezier.angle": angle});
		this.setMasterRotation(angle);
	}
	
	
	tick() {
		this.setPosition(this.curves.position[this.avancement]);
		this.makeRotation();
		this.avancement = (this.avancement + 1) % this.steps;
		this.handleRotation();
		super.tick();
	}
}
	
});
