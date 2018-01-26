/**
 *  ThreeJS test file using the ThreeRender class
 */





/* ---------------------------------------------------------------------------

	   DEPENDENCIES
	   
--------------------------------------------------------------------------- */
	
requirejs(['ModulesLoaderV2.js'], function() { 
	// Level 0 includes
	ModulesLoader.requireModules([
		"threejs/three.min.js"
	]);
	ModulesLoader.requireModules([
		"theirJS/ThreeRenderingEnv.js",
		"theirJS/ThreeLightingEnv.js", 
		"theirJS/ThreeLoadingEnv.js", 
		"theirJS/navZ.js",
		"FlyingVehicle.js"
	]);
	ModulesLoader.requireModules([
		"myJS/CameraManagement.js",
		"myJS/NAVManagement.js",
		"myJS/SpeedManagement.js",
		"myJS/DebugManagement.js",
		"myJS/CheckPointManagement.js",
		"myJS/LapManagement.js",
		"myJS/GhostTrack.js",
		"myJS/Car.js",
		"myJS/helico/Helico.js",
		"myJS/MovementManagement.js"
	]);
	// Loads modules contained in includes and starts main function
	ModulesLoader.loadModules(start) ;
});

google.charts.load('current', {'packages':['gauge']});






/* ---------------------------------------------------------------------------

	   DOM MANIPULATION
	   
--------------------------------------------------------------------------- */

var $chart;
var $wrongDirection;

function initDomElements() {
	$chart = $("#chart");
	$wrongDirection = $("#wrong-direction");
}





/* ---------------------------------------------------------------------------

	   CREATE ENVIRONMENT
	   
--------------------------------------------------------------------------- */

function createLoader(renderingEnvironment) {
	//	Loading env
	var Loader = new ThreeLoadingEnv();
	//	Meshes
	Loader.loadMesh('assets','border_Zup_02','obj',	renderingEnvironment.scene,'border',	-340,-340,0,'front');
	Loader.loadMesh('assets','ground_Zup_03','obj',	renderingEnvironment.scene,'ground',	-340,-340,0,'front');
	Loader.loadMesh('assets','circuit_Zup_02','obj',renderingEnvironment.scene,'circuit',	-340,-340,0,'front');
	//Loader.loadMesh('assets','tree_Zup_02','obj',	renderingEnvironment.scene,'trees',	-340,-340,0,'double');
	Loader.loadMesh('assets','arrivee_Zup_01','obj',	renderingEnvironment.scene,'decors',	-340,-340,0,'front');
	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', renderingEnvironment.scene, 'sky',4000);
	// Return
	return Loader;
}

function createLights(renderingEnvironment) {
	return new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);
}

function createNAV(CARx, CARy, CARz) {
	var NAV = new navPlaneSet(new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01	
	NAV.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02		
	NAV.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03		
	NAV.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04		
	NAV.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05		
	NAV.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06		
	NAV.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07		
	NAV.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08		
	NAV.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09		
	NAV.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10		
	NAV.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11		
	NAV.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12		
	NAV.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13 		
	NAV.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14		
	NAV.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15		
	NAV.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16	
	NAV.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17	
	NAV.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18	
	NAV.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19	
	NAV.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20	
	NAV.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21		
	NAV.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22		
	NAV.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23		
	NAV.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24		
	NAV.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25		
	NAV.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26		
	NAV.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27	
	NAV.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28	
	NAV.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29	
	NAV.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30			
	NAV.setPos(CARx,CARy,CARz); 
	NAV.initActive();
	return NAV;
}





/* ---------------------------------------------------------------------------

	   CREATE CHART
	   
--------------------------------------------------------------------------- */

function createChartData() {
	return google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Speed', 0]
  ]);
};

function createChartOptions() {
	return {
    width: 400, height: 120,
    max: 150,
    majorTicks: 5, minorTicks: 10,
    redFrom: 112.5, redTo: 150,
    yellowFrom: 75, yellowTo: 112.5,
    animation: { duration: 16 }
  };
}

function createChart() {
  return new google.visualization.Gauge(document.getElementById('chart'));
}





/* ---------------------------------------------------------------------------

		LOOP FUNCTIONS
	   
--------------------------------------------------------------------------- */

// fps count
var lastLoopTime = (new Date()).getTime();
function calculateDt(arg) {
	var newTime = (new Date()).getTime();
	arg.dt = newTime - lastLoopTime;
	DebugManagement.set({"fps": arg.dt});
	lastLoopTime = newTime;	
}

function render(arg) { 
	// make animation
	requestAnimationFrame(function() { render(arg); });
	// given
	arg.car.move(arg.NAV);
	// custom
	calculateDt(arg);
	MovementManagement.handleKeys(arg);
	CheckPointManagement.tick(arg.NAV);
	SpeedManagement.addPosition({x: arg.NAV.x, y: arg.NAV.y});
	CameraManagement.render(arg);
	GhostTrack.add({x: arg.NAV.x, y: arg.NAV.y, z: arg.NAV.z, theta: arg.car.rotationZ.rotation.z});
	GhostTrack.move();
	arg.helico.tick();
	
	arg.chartData.setValue(0, 1, SpeedManagement.speed());
	arg.chart.draw(arg.chartData, arg.chartOptions);
	
	DebugManagement.set({"car.speed": SpeedManagement.speed()});
	DebugManagement.set({"car.x": arg.NAV.x});
	DebugManagement.set({"car.y": arg.NAV.y});
	DebugManagement.set({"car.z": arg.NAV.z});

	arg.renderingEnvironment.renderer.render(
			arg.renderingEnvironment.scene,
			arg.renderingEnvironment.camera); 
};
	
	
	
	
	
/* ---------------------------------------------------------------------------

   EVENT LISTENER
   
--------------------------------------------------------------------------- */

function setListeners(arg) {
	function onResize() {
		arg.renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}
	function onKeyDown(event) {
		arg.currentlyPressedKeys[event.keyCode] = true;
	}
	function onKeyUp(event) {
		arg.currentlyPressedKeys[event.keyCode] = false;
	}	
	function onKeyPress(e) {
		if(e.key == "p") {
			CameraManagement.switch(arg);
		} else if(e.key == "c") {
			DebugManagement.toggle();
		}
	}
	window.addEventListener( 'resize', onResize, false );
	document.onkeydown = onKeyDown;
	document.onkeyup = onKeyUp;		
	document.onkeypress = onKeyPress;
}	
	
	



/* ---------------------------------------------------------------------------

	   MAIN
	   
--------------------------------------------------------------------------- */

//	--------------------------------------------------------------------------
//	MAR 2014 - nav test
//	author(s) : Cozot, R. and Lamarche, F.
//  edits : Gaudichon, P.
//	date : 11/16/2014
//	last : 17 Jan 2018
//	--------------------------------------------------------------------------
	
function start() {
			
	//	keyPressed
	var currentlyPressedKeys = {};
	
	// car Position
	var CARx = -220; 
	var CARy = 0; 
	var CARz = 0;
	var CARtheta = 0; 
	
	//	rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();
	var Lights = createLights(renderingEnvironment);
	var Loader = createLoader(renderingEnvironment);
	var NAV = createNAV(CARx, CARy, CARz);
	
	// Car
	var car = new Car(
			{x: CARx, y: CARy, z: CARz, theta: CARtheta},
			{renderingEnvironment, Loader}
	);
	
	// Helico
	var helico = new Helico({ z: 300 }, {Loader, renderingEnvironment});
		
	// Google chart - Gauge - for speed reporting
	var chartData = createChartData();
	var chartOptions = createChartOptions();
	var chart = createChart();
	
	var arg = {
		currentlyPressedKeys,
		//CARx, CARy, CARz, CARtheta,
		renderingEnvironment, Lights, Loader, NAV,
		car, helico,
		//vehicle, carPosition, carFloorSlope, carRotationZ, carGeometry,
		chartData, chartOptions, chart
	};
	
	// ghosts
	GhostTrack.loadGhosts(arg);
	
	
	// Debug	
	//NAV.debug();
	//var navMesh = NAV.toMesh();
	//renderingEnvironment.addToScene(navMesh);
	
	// Events
	setListeners(arg);	
	
	CheckPointManagement.onWrongDirection(function() {
		$wrongDirection.css("opacity", 1);
		setTimeout(function() {
			$wrongDirection.css("opacity", 0);
		}, 2000);
	});
	
	// Init
	CameraManagement.init(arg);
	DebugManagement.toggle(true);
	$(function() {
		initDomElements();
		render(arg); 	
	});
	
}
