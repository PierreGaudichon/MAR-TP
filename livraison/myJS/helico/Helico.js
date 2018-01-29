
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/DebugManagement.js",
	"myJS/helico/Propeller.js"
]);

(function() {
	

var maxId = 0;

	
Helico = class Helico {
	
	constructor({ x, y, z }, { renderingEnvironment, Loader }) {
		
		// id
		this.id = maxId++;
		
		// position
		this.position = new THREE.Object3D(); 
		this.position.name = `helico-${this.id}:position`;
		renderingEnvironment.addToScene(this.position);
		DebugManagement.set({"helico.x": 0});
		DebugManagement.set({"helico.y": 0});
		DebugManagement.set({"helico.z": 0});
		this.setPosition({x, y, z});
		
		// corp
		this.corp = Loader.load({
			filename: 'assets/helico/helicoCorp.obj',
			node: this.position,
			name: `helico-${this.id}:geometry-corp`
		});
		
		// propellers
		this.rightPropeller = new Propeller(
			{ x: 8.5, y: -3.4, z: 3.8 },
			{ helico: this, Loader, renderingEnvironment },
			{ rotating: true, isParticles: true }
		);
		this.leftPropeller = new Propeller(
			{ x: -8.5, y: -3.4, z: 3.8 },
			{ helico: this, Loader, renderingEnvironment },
			{ rotating: true, isParticles: true }
		);
		this.centralPropeller = new Propeller(
			{ x: 0, y: 0, z: 4, rx: Math.PI/2 },
			{ helico: this, Loader, renderingEnvironment },
			{ rotating: false, isParticles: false }
		);
		
		// rotation
		this.propellerRotationSpeed = 2*Math.PI/60;
		this.corpRotationSpeed = 2*Math.PI/120;
		this.corpRotation = 0;
		this.propellersRotation = 0;
	}
	
	setPosition({x, y, z}) {
		if(x != undefined) {
			DebugManagement.set({"helico.x": x});
			this.position.position.x = x;
		}
		if(y != undefined) {
			DebugManagement.set({"helico.y": y});
			this.position.position.y = y;
		}
		if(z != undefined) {
			DebugManagement.set({"helico.z": z});
			this.position.position.z = z;
		}
	}
	
	setSpeed(s) {
		this.speed = s;
		if(this.speed > this.MAX_SPEED) { this.speed = this.MAX_SPEED; }
		if(this.speed < 0) { this.speed = 0; }
		Array.prototype
			.concat(this.rightPropeller.blades)
			.concat(this.leftPropeller.blades)
			.forEach(function(blade){ blade.speed = s; });
		DebugManagement.set({"helico.speed": this.speed});
	}
	
	tick() {
		// dispatch ticks
		this.rightPropeller.tick();
		this.leftPropeller.tick();
		this.centralPropeller.tick();
	}
}
	
})();
