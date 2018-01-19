
Car = {};
GhostCar = {};

(function() {


var maxId = 0; 

Car = class car {
	
	constructor({ x, y, z, theta }, { renderingEnvironment, Loader} ) {
			
		// id
		this.id = maxId++;
		// position
		this.x = x;
		this.y = y;
		this.z = z;
		this.theta = theta;
		// env
		this.renderingEnvironment = renderingEnvironment;
		
		//vehicle
		this.vehicle = new FlyingVehicle({
			position: new THREE.Vector3(this.x, this.y, this.z),
			zAngle : this.theta + Math.PI/2,
		});
		
		// position
		this.position = new THREE.Object3D(); 
		this.position.name = `car-${this.id}:position`; // car0 
		renderingEnvironment.addToScene(this.position); 
		this.position.position.x = this.x;
		this.position.position.y = this.y;
		this.position.position.z = this.z;
		
		// floor slope
		this.floorSlope = new THREE.Object3D(); 
		this.floorSlope.name = `car-${this.id}:floor_slope`; // car1
		this.position.add(this.floorSlope);
		
		// rotation z
		this.rotationZ = new THREE.Object3D(); 
		this.rotationZ.name = `car-${this.id}:rotation_z`; //car2
		this.floorSlope.add(this.rotationZ);
		this.rotationZ.rotation.z = this.theta;
		
		// geometry
		this.geometry = Loader.load({
			filename: 'assets/car_Zup_01.obj',
			node: this.rotationZ,
			name: `car-${this.id}:geometry` // car3
		});
		this.geometry.position.z= +0.25;
		
	}
	
	
	move(NAV) {
		// Vehicle stabilization 
		this.vehicle.goUp(
				this.vehicle.weight()/4.0, 
				this.vehicle.weight()/4.0,
				this.vehicle.weight()/4.0,
				this.vehicle.weight()/4.0);
		this.vehicle.stopAngularSpeedsXY() ;
		this.vehicle.stabilizeSkid(50) ; 
		this.vehicle.stabilizeTurn(1000) ;
		var oldPosition = this.vehicle.position.clone() ;
		this.vehicle.update(1.0/60) ;
		var newPosition = this.vehicle.position.clone() ;
		newPosition.sub(oldPosition) ;
		// NAV
		NAV.move(newPosition.x, newPosition.y, 150,10) ;
		// carPosition
		this.position.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the vehicle
		this.vehicle.position.x = NAV.x ;
		this.vehicle.position.y = NAV.Y ;
		// Updates carFloorSlope
		this.floorSlope.matrixAutoUpdate = false;		
		this.floorSlope.matrix.copy(NAV.localMatrix(this.x, this.y));
		// Updates carRotationZ
		this.rotationZ.rotation.z = this.vehicle.angles.z-Math.PI/2.0 ;
	}
}


GhostCar = class GhostCar extends Car {

	constructor(positions, { renderingEnvironment, Loader} ) {
		super(positions[0], { renderingEnvironment, Loader});
		this.positions = positions;
		this.geometry.opacity = 0.5;
		this.index = 0;
	};

	move() {
		this.index++;
		if(this.index > this.positions.length-1) {
			this.renderingEnvironment.scene.remove(this.position);
		} else {
			this.position.position.x = this.positions[this.index].x;
			this.position.position.y = this.positions[this.index].y;			
		}
	}
	
}


})();
