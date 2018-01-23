/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{ 
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules([ "theirJS/ThreeRenderingEnv.js", 
			                              "theirJS/ThreeLightingEnv.js", 
			                              "theirJS/ThreeLoadingEnv.js", 
			                              "theirJS/navZ.js",
			                              "FlyingVehicle.js"]) ;
			// ModulesLoader.requireModules(["myJS/Helico.js"]);
			ModulesLoader.requireModules(["myJS/AbsoluteConeEmitter.js"]);
			ModulesLoader.requireModules([
				"ParticleSystem.js",
				"Interpolators.js",
				"MathExt.js"
			]);
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start()
{
	//	----------------------------------------------------------------------------
	//	MAR 2014 - TP Animation hélicoptère
	//	author(s) : Cozot, R. and Lamarche, F.
	//	---------------------------------------------------------------------------- 			
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};
	
	//	rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

	// Camera setup
	renderingEnvironment.camera.position.x = 0 ;
	renderingEnvironment.camera.position.y = 0 ;
	renderingEnvironment.camera.position.z = 40 ;
	
	// load helico
	// var helico = new Helico({}, {Loader, renderingEnvironment});
	
	// Particles
	// Q.1
	var particles = new ParticleSystem.Engine_Class({
		particlesCount: 10000,
		textureFile: "assets/particles/particle.png",
		blendingMode: THREE.AdditiveBlending
	});
	// Q.7
	var rotating = new THREE.Object3D();
	renderingEnvironment.addToScene(rotating);
	renderingEnvironment.addToScene(particles.particleSystem);
	// tourne sur axe z : ok
	// tourne sur axe x ou y : pas ok, la gravité tourne avec l'axe et pas tjr vers le bas.
	//renderingEnvironment.addToScene(particles.particleSystem);
	// Q.2
	particles.addEmitter(new AbsoluteConeEmitter({ // Q.8
		cone: {
			center: new THREE.Vector3(0, 0, 0),
			following: rotating,
			height: new THREE.Vector3(0, 0, 10),
			radius: 0.5,
			flow: 1000
		},
		particle: {
			speed: new MathExt.Interval_Class(5, 10),
			mass: new MathExt.Interval_Class(0.1, 0.3),
			size: new MathExt.Interval_Class(0.1, 1),
			lifeTime: new MathExt.Interval_Class(1, 7)
		}
	}));
	// Q.4
	particles.addModifier(new ParticleSystem.ForceModifier_Weight_Class());
	// Q.3
	particles.addModifier(new ParticleSystem.LifeTimeModifier_Class());
	particles.addModifier(new ParticleSystem.PositionModifier_EulerItegration_Class());
	// Q.5
	var linearInterpolator = new Interpolators.Linear_Class(1, 0);
	particles.addModifier(new ParticleSystem.OpacityModifier_TimeToDeath_Class(linearInterpolator));
	// Q.6 (blue instead of red)
	var white = { r: 1, g: 1, b: 1 };
	var lightGrey = { r: 0.9, g: 0.9, b: 0.8 };
	var blue = { r: 0, g: 0, b: 1 };
	var red = { r: 0.7, g: 0, b: 0 }
	particles.addModifier(new ParticleSystem.ColorModifier_TimeToDeath_Class(red, lightGrey));
	
	
	
	
	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks 
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;					

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}				
		var rotationIncrement = 0.05 ;
		if (currentlyPressedKeys[68]) // (D) Right
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left 
		{		
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), -rotationIncrement) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down 
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), -rotationIncrement) ;
		}
	}

	//	window resize
	function  onWindowResize() 
	{
		renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}

	rotating.rotation.x = Math.PI/4;
	
	function render() { 
		requestAnimationFrame( render );
		handleKeys();
		// helico.tick();
		particles.animate(0.016);
		rotating.rotation.y += 1/60;
		
		// Rendering
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera); 
	};

	render(); 
}
