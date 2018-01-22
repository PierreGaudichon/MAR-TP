

function AbsoluteConeEmitter(configuration) {
	// Tests requirements on configuration data structure
	DebugHelper.requireAttribute(configuration, 'cone') &&
		DebugHelper.requireAttribute(configuration.cone, 'center') &&
		DebugHelper.requireAttribute(configuration.cone, 'height') &&
		DebugHelper.requireAttribute(configuration.cone, 'radius') &&
		DebugHelper.requireAttribute(configuration.cone, 'flow') ;
	DebugHelper.requireAttribute(configuration, 'particle') &&
		DebugHelper.requireAttribute(configuration.particle, 'speed') &&
		MathExt.Interval_Class_Requirements(configuration.particle.speed) &&
		DebugHelper.requireAttribute(configuration.particle, 'mass') &&
		MathExt.Interval_Class_Requirements(configuration.particle.mass) &&
		DebugHelper.requireAttribute(configuration.particle, 'size') &&
		MathExt.Interval_Class_Requirements(configuration.particle.size) &&
		DebugHelper.requireAttribute(configuration.particle, 'lifeTime') &&
		MathExt.Interval_Class_Requirements(configuration.particle.lifeTime) ;
	
	/**
	 *  Emission direction
	 */
	this.direction = configuration.cone.height ;
	//	this.direction = emissionDirection ;
	this.direction.normalize() ;
	/**
	 *  Normal to the emission direction
	 */
	this.directionNormal = new THREE.Vector3(this.direction.z, this.direction.x, this.direction.y) ;
	this.directionNormal.cross(this.direction) ;
	this.directionNormal.normalize() ;
	/**
	 *  Emission center
	 */
	this.center = configuration.cone.center ;

	/**
	 *  Particles life time interval
	 */
	this.lifeTimeInterval = configuration.particle.lifeTime ;
//	this.lifeTimeInterval = lifeTimeInterval ;
	
	/**
	 *  Radius of the circle used to compute real emission direction
	 */
	this.spread = configuration.cone.radius/configuration.cone.height.lengthSq() ;
//	this.spread = radius/emissionDirection.lengthSq() ;
	/**
	 *  Speed interval
	 */
	this.speedInterval = configuration.particle.speed ;
//	this.speedInterval = speedInterval ;
	/**
	 *  Size interval
	 */
	this.sizeInterval = configuration.particle.size ;
//	this.sizeInterval = sizeInterval ;
	/**
	 *  The mass interval
	 */
	this.massInterval = configuration.particle.mass ;
//	this.massInterval = massInterval ;
	/**
	 *  Time elapsed since the emitter has been created
	 */
	this.currentDate = 0 ;
	/**
	 *  Last particle emission date
	 */
	this.lastDate = 0 ;
	/**
	 *  Number of particles emitted per second
	 */
	this.flow = configuration.cone.flow ;
//	this.flow = flow ;
	/**
	 *  Number of particles emitted since the creation of this emitter
	 */
	this.emitted = 0 ;
	
	/**
	 *  Instanciate a particle
	 *  
	 *  @param position The initial particle position
	 *  @param speed The initial particle speed
	 *  @param mass Mass of the particle
	 *  @param lifeTime life time of the particle
	 */
	this.instantiateParticle = function(position, speed, mass, size, lifeTime)
	{
		return new ParticleSystem.PhysicsParticle_Class(position, speed, mass, size, lifeTime) ;
	} ;
	
	/**
	 * @return {position, speed} in which position and speed are instances of THREE.Vector3
	 */
	this.createParticle = function()
	{
		var mass = 0.1 ;
		var initialPosition = this.center.clone() ;
		var initialSpeed = this.direction.clone() ;
		var modifier = this.directionNormal.clone() ;
		modifier.applyAxisAngle(this.direction, Math.PI*2.0*Math.random()) ;
		modifier.multiplyScalar(this.spread*Math.sqrt(Math.random())) ;
		initialSpeed.add(modifier) ;
		initialSpeed.normalize() ;
		//initialSpeed.multiplyScalar(Math.random()*(this.speedInterval.max-this.speedInterval.min)+this.speedInterval.min) ;
		initialSpeed.multiplyScalar(this.speedInterval.random()) ;
		return this.instantiateParticle(initialPosition, initialSpeed, mass, this.sizeInterval.random(), this.lifeTimeInterval.random()) ;
	} ;

	/** Given the particle flow, creates necessary particles.
	 * 
	 * @param dt Time elapsed since last call
	 * @return An array of emitted particles. Each particle is a structure {position, speed}
	 */
	this.createParticles = function(dt)
	{
		this.currentDate = this.currentDate + dt ;
		var maxEmitted = Math.round(this.currentDate * this.flow) ;
		var toEmit = maxEmitted - this.emitted ;
		var particles = [] ;
		for(cpt=0 ; cpt<toEmit ; cpt++)
		{
			particles.push(this.createParticle()) ;
			this.emitted++ ;
		}
		return particles ;
	} ;
} ;
