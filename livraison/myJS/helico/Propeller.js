

if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/ParticleSystemInitializer.js",
	"myJS/helico/Blade.js"
]);


(function() {


var maxId = 0;


Propeller = class Propeller {
	
	constructor(
			{ x, y, z, rx, ry, rz },
			{ Loader, helico, renderingEnvironment },
			{ rotating, isParticles }
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
		this.isParticles = isParticles;
		
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
		if(this.isParticles) {
			var colors = { from: ParticleSystemInitializer.YELLOW, to: ParticleSystemInitializer.RED };
			this.particles = ParticleSystemInitializer.createSystem(
				renderingEnvironment,
				{ },
				{ center: this.position, height: new THREE.Vector3(0, -20, 0), weight: 10 },
				{ 
					color: colors,
					weight: { direction: -1 }
				}
			);
			
		}
		
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
		if(this.isParticles) this.particles.animate(0.016);
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

	
})();

