
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/ParticleSystemInitializer.js",
	"myJS/DebugManagement.js"
]);


(function() {
	
var maxId = 0;


class Propeller {
	
	constructor(
			{ x, y, z, rx, ry, rz },
			{ Loader, helico, renderingEnvironment },
			{ rotating }
	) {
		// id 
		this.id = maxId++;
		
		// position
		this.position = new THREE.Object3D(); 
		this.position.name = `propeller-${this.id}:position`;
		helico.position.add(this.position);
		this.setPosition({x, y, z});
		this.setRotation({rx, ry, rz});
		
		// rotating
		this.rotating = rotating;
		
		// turbine
		this.turbine = Loader.load({
			filename: 'assets/helico/turbine.obj',
			node: this.position,
			name: `propeller-${this.id}:geometry-turbine`
		});
		
		// axis
		this.axis = Loader.load({
			filename: 'assets/helico/axe.obj',
			node: this.position,
			name: `propeller-${this.id}:geometry-axis`
		});
		this.axis.position.y = 1;
		
		// blades
		this.blades = [
			new Blade({ theta: 0 }, { propeller: this, Loader }),
			new Blade({ theta: 2*Math.PI/3 }, { propeller: this, Loader }),
			new Blade({ theta: 4*Math.PI/3 }, { propeller: this, Loader })
		];
		
		// smoke
		this.particles = ParticleSystemInitializer.createSystem(
			renderingEnvironment,
			{ },
			{ center: this.position, height: new THREE.Vector3(0, -20, 0) },
			// { color: { from: ParticleSystemInitializer.RED, to: ParticleSystemInitializer.LIGHT_GREY }}
			{ color: { from: ParticleSystemInitializer.WHITE, to: ParticleSystemInitializer.WHITE }}
			// { color: { from: ParticleSystemInitializer.BLACK, to: ParticleSystemInitializer.BLACK }}
		);
		
		
		// depreciated ?
		this.dir = true;
	}
	
	setPosition({x, y, z}) {
		if(x != undefined) { this.position.position.x = x; }
		if(y != undefined) { this.position.position.y = y; }
		if(z != undefined) { this.position.position.z = z; }
	}
	
	setRotation({rx, ry, rz}) {
		if(rx != undefined) { this.position.rotation.x = rx; }
		if(ry != undefined) { this.position.rotation.y = ry; }
		if(rz != undefined) { this.position.rotation.z = rz; }
	}
	
	
	
	tick() {
		this.blades.forEach(function(blade) { blade.tick(); });
		this.particles.animate(0.016);
		/*if(this.rotating) {
			var speed = 0.02;
			if(this.dir) { this.position.rotation.z += speed; }
			else { this.position.rotation.z += -speed; }
			var r = this.position.rotation.z%(2*Math.PI);
			if(-Math.PI/4 > r || r > Math.PI/4) {
				this.dir = !this.dir;
			}
		}*/
	}
}


class Blade {

	constructor({ theta }, { Loader, propeller }) {
		// id
		this.id = maxId++;
		
		// position
		this.position = new THREE.Object3D(); 
		this.position.name = `blade-${this.id}:position`;
		propeller.position.add(this.position);
		
		this.blade = Loader.load({
			filename: 'assets/helico/pale.obj',
			node: this.position,
			name: `blade-${this.id}:geometry-blade`
		});
		
		this.blade.position.y = 2.9;
		this.blade.rotation.y = theta;
		this.speed = 0;
	}
	
	tick() {
		var coef = (this.speed/10+Blade.BASE_ANGULAR_SPEED) * Blade.ANGULAR_SPEED_COEF;
		this.blade.rotation.y += 2*Math.PI * coef;
	}
	
}

Blade.ANGULAR_SPEED_COEF = 1/60; // rotation per frame
Blade.BASE_ANGULAR_SPEED = 2;
	
	
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
			{ rotating: true }
		);
		this.leftPropeller = new Propeller(
			{ x: -8.5, y: -3.4, z: 3.8 },
			{ helico: this, Loader, renderingEnvironment },
			{ rotating: true }
		);
		this.centralPropeller = new Propeller(
			{ x: 0, y: 0, z: 4, rx: Math.PI/2 },
			{ helico: this, Loader, renderingEnvironment },
			{ rotating: false }
		);
		
		// rotation
		this.propellerRotationSpeed = 2*Math.PI/60;
		this.corpRotationSpeed = 2*Math.PI/120;
		this.corpRotation = 0;
		this.propellersRotation = 0;
		
		// speed
		this.speed = 0; // px/frame
		this.MAX_SPEED = 10; // px/frame
		this.acceleration = 0.5; // px.frame^-2
		this.frictionDeceleration = 0.1;
		DebugManagement.set({"helico.speed": this.speed});
		
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
	
	speedup() {
		this.setSpeed(this.speed + this.acceleration);
	}
	
	brake() {
		this.setSpeed(this.speed - this.acceleration);
	}
	
	tick() {
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
		
		// dispatch ticks
		this.rightPropeller.tick();
		this.leftPropeller.tick();
		this.centralPropeller.tick();
	}
}
	
})();
