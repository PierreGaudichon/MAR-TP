
if(typeof(ModulesLoader)=="undefined") {
	throw "ModulesLoaderV2.js is required."; 
}
ModulesLoader.requireModules([
	"myJS/AbsoluteConeEmitter.js",
	"ParticleSystem.js",
	"Interpolators.js"
]);


(function() {

function createEngine({ count }) {
	if(!count) { count = 1000; }
	return new ParticleSystem.Engine_Class({
		particlesCount: count,
		textureFile: "assets/particles/particle.png",
		blendingMode: THREE.AdditiveBlending
	});
}


function createEmitter({ center, height, weight, flow }) {
	if(!height) { height = new THREE.Vector3(0, 0, 10); }
	if(!weight) { weight = 0.1; }
	if(!flow) { flow = 100; }
	return new AbsoluteConeEmitter({
		cone: {
			center,
			height,
			radius: 0.5,
			flow
		},
		particle: {
			speed: new MathExt.Interval_Class(5, 10),
			mass: new MathExt.Interval_Class(weight, weight + 0.2),
			size: new MathExt.Interval_Class(0.1, 1),
			lifeTime: new MathExt.Interval_Class(1, 7)
		}
	});
}


var createModifier = {
	weight: function({ direction }) {
		return new ParticleSystem.ForceModifier_Weight_Class(direction);
	},
	lifeTime: function() {
		return new ParticleSystem.LifeTimeModifier_Class();
	},
	eulerIntegration: function() {
		return new ParticleSystem.PositionModifier_EulerItegration_Class();
	},
	opacity: function() {
		var linearInterpolator = new Interpolators.Linear_Class(1, 0);
		return new ParticleSystem.OpacityModifier_TimeToDeath_Class(linearInterpolator);
	},
	color: function({ from, to }) {
		return new ParticleSystem.ColorModifier_TimeToDeath_Class(from, to);
	}
}


function createSystem(renderingEnvironment, engineConfig, emitterConfig, modifierConfigs) {
	var engine = createEngine(engineConfig);
	var emitter = createEmitter(emitterConfig);
	renderingEnvironment.addToScene(engine.particleSystem);
	engine.addEmitter(emitter);
	engine.addModifier(createModifier.weight(modifierConfigs.weight));
	engine.addModifier(createModifier.lifeTime());
	engine.addModifier(createModifier.eulerIntegration());
	engine.addModifier(createModifier.opacity());
	engine.addModifier(createModifier.color(modifierConfigs.color));
	return engine;
}


ParticleSystemInitializer = {
	createSystem,
	WHITE: { r: 1, g: 1, b: 1 },
	LIGHT_GREY: { r: 0.9, g: 0.9, b: 0.8 },
	BLACK: { r: 0, g: 0, b: 0 },
	BLUE: { r: 0, g: 0, b: 1 },
	RED: { r: 1, g: 0.1, b: 0 },
	YELLOW : { r: 1, g: 0.5, b: 0 }
};


})();
