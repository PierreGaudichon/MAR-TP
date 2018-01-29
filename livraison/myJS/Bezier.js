





Bezier = {};


// add :: Vector, Vector, Number -> null
function add(r, p, k) {
	r.add(p.clone().multiplyScalar(k));
}


// Vector3 = THREE.Vector3

// Curve3 :: Number -> Vector3
// Number t in [0, 1]

// Control3 :: Vector3[4]


// cubic :: Control3 -> Curve3
// Calculate the cubic bezier curve from 4 points.
// https://fr.wikipedia.org/wiki/Courbe_de_B%C3%A9zier#Courbes_de_B%C3%A9zier_cubiques
//
Bezier.cubic = function([p0, p1, p2, p3]) {
	return function(t) {
		var r = new THREE.Vector3(0, 0, 0);
		var a = (1-t)*(1-t)*(1-t);
		var b = 3*t*(1-t)*(1-t);
		var c = 3*t*t*(1-t);
		var d = t*t*t;
		r.add(p0.clone().multiplyScalar(a));
		r.add(p1.clone().multiplyScalar(b));
		r.add(p2.clone().multiplyScalar(c));
		r.add(p3.clone().multiplyScalar(d));
		return r;
	};
};


// cubicdt :: Control3 -> Curve3
// Calculate the first derivative of the cubic bezier curve.
Bezier.cubicdt = function([p0, p1, p2, p3]) {
	return function(t) {
		var r = new THREE.Vector3(0, 0, 0);
		add(r, p0, -3*t*t); add(r, p1, 9*t*t); add(r, p2, -9*t*t); add(r, p3, 3*t*t);
		add(r, p0, 6*t); add(r, p1, -12*t); add(r, p2, 6*t);
		add(r, p0, -3); add(r, p1, 3);
		return r;	
	};
};


// cubicdt2 :: Control3 -> Curve3
// Calculate the second derivative of the bezier curve.
Bezier.cubicdt2 = function([p0, p1, p2, p3]) {
	return function(t) {
		var r = new THREE.Vector3(0, 0, 0);
		add(r, p0, -6*t); add(r, p1, 18*t); add(r, p2, -18*t); add(r, p3, 3*t);
		add(r, p0, 6); add(r, p1, -12); add(r, p2, 6);
	};
};


// lengthBase :: Control3 -> Number
// Calculate the length of the bezier curve (cheap, not accurate).
// https://stackoverflow.com/a/37862545/3765413
Bezier.lengthBase = function([p0, p1, p2, p3]) {
	function al(a, b) { return b.clone().sub(a).length(); }
	var chord = p3.clone().sub(p0).length();
	var net = al(p0, p1) + al(p1, p2) + al(p2, p3);
	return (chord + net) / 2;
}


// length :: Control3 -> Number
// calculate the length of the bezier curve (using recustion to make it converge).
Bezier.length = function(control) {
	var TOLERANCE = 0.1;
	var length = Bezier.lengthBase(control);
	if(length < TOLERANCE) {
		return length;
	}
	var [control1, control2] = Bezier.split(0.5, control);
	return Bezier.length(control1) + Bezier.length(control2);
};


// subControls :: Number endpoint, Control3 -> Control3
// Split the bezier curve from start to endpoint.
// https://stackoverflow.com/a/8405756/3765413
Bezier.subControls = function(endpoint, [p0, p1, p2, p3]) {
	var p01 = p1.clone().sub(p0).multiplyScalar(endpoint).add(p0);
	var p12 = p2.clone().sub(p1).multiplyScalar(endpoint).add(p1);
	var p23 = p3.clone().sub(p2).multiplyScalar(endpoint).add(p2);
	var p012 = p12.clone().sub(p01).multiplyScalar(endpoint).add(p01);
	var p123 = p23.clone().sub(p12).multiplyScalar(endpoint).add(p12);
	var p0123 = p123.clone().sub(p012).multiplyScalar(endpoint).add(p012);
	return [p0, p01, p012, p0123];
}


// subControls :: Number endpoint, Control3 -> [Control3, Control3]
// Split the bezier curve from start to endpoint. Returns both parts of the splitted curve.
Bezier.split = function(endpoint, control) {
	return [
		Bezier.subControls(endpoint, control),
		Bezier.subControls((1-endpoint), control.reverse()).reverse()
	];
}


// addZ :: (Vector2, Number) -> Vector3
Bezier.addZ = function(v, z) {
	return new THREE.Vector3(v.x, v.y, z);
}


Bezier.interpolate = function(curve, n) {
// interpolate :: (Curve3, Integer n) -> Vector3[n]
	var r = [];
	for(var i = 0; i < n; i++) {
		r.push(curve(i/n));
	}
	return r;
}
