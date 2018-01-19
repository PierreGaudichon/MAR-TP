

(function() {
	
var maxId = 0;


class Propeller {
	
	constructor({ x, y, z, rx, ry, rz }, { Loader, helico }, { rotating }) {
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
		
		if(this.rotating) {
			var speed = 0.02;
			if(this.dir) { this.position.rotation.z += speed; }
			else { this.position.rotation.z += -speed; }
			var r = this.position.rotation.z%(2*Math.PI);
			if(-Math.PI/4 > r || r > Math.PI/4) {
				this.dir = !this.dir;
			}
		}
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
	}
	
	tick() {
		this.blade.rotation.y = this.blade.rotation.y + 2*Math.PI/60*Blade.ANGULAR_SPEED;
	}
	
}

Blade.ANGULAR_SPEED = 1; // rotation per second
	
	
Helico = class Helico {
	
	constructor({x, y, z}, {renderingEnvironment, Loader}) {
		
		// id
		this.id = maxId++;
		
		// position
		this.position = new THREE.Object3D(); 
		this.position.name = `helico-${this.id}:position`;
		renderingEnvironment.addToScene(this.position);
		
		this.setPosition({x, y, z});
		//this.position.rotation.x = -Math.PI/2;
		//this.position.rotation.z = Math.PI;
		
		// corp
		this.corp = Loader.load({
			filename: 'assets/helico/helicoCorp.obj',
			node: this.position,
			name: `helico-${this.id}:geometry-corp`
		});
		
		// propellers
		this.rightPropeller = new Propeller(
			{ x: 8.5, y: -3.4, z: 3.8 },
			{ helico: this, Loader },
			{ rotating: true }
		);
		this.leftPropeller = new Propeller(
			{ x: -8.5, y: -3.4, z: 3.8 },
			{ helico: this, Loader },
			{ rotating: true }
		);
		this.centralPropeller = new Propeller(
			{ x: 0, y: 0, z: 4, rx: Math.PI/2 },
			{ helico: this, Loader },
			{ rotating: false }
		);
		
	}
	
	setPosition({x, y, z}) {
		if(x != undefined) { this.position.position.x = x; }
		if(y != undefined) { this.position.position.y = y; }
		if(z != undefined) { this.position.position.z = z; }
	}
	
	tick() {
		this.rightPropeller.tick();
		this.leftPropeller.tick();
		this.centralPropeller.tick();
	}
}
	
})();
