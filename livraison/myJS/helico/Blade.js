

(function() {


var maxId = 0;


Blade = class Blade {

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


})();

	
