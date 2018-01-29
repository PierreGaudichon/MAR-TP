





Bezier = {};


// add :: Vector, Vector, Number -> null
function add(r, p, k) {
	r.add(p.clone().multiplyScalar(k));
}


// Vector3 = THREE.Vector3

// Curve3 :: Number -> Vector3
// Number t in [0, 1]


// cubic :: (Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3) -> Curve3
// Calculate the cubic bezier curve from 4 points.
// https://fr.wikipedia.org/wiki/Courbe_de_B%C3%A9zier#Courbes_de_B%C3%A9zier_cubiques
//
Bezier.cubic = function(p0, p1, p2, p3) {
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


// cubicdt :: (Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3) -> Curve3
// Calculate the first derivative of the cubic bezier curve.
Bezier.cubicdt = function(p0, p1, p2, p3) {
	return function(t) {
		var r = new THREE.Vector3(0, 0, 0);
		add(r, p0, -3*t*t); add(r, p1, 9*t*t); add(r, p2, -9*t*t); add(r, p3, 3*t*t);
		add(r, p0, 6*t); add(r, p1, -12*t); add(r, p2, 6*t);
		add(r, p0, -3); add(r, p1, 3);
		return r;	
	};
};


// cubicdt2 :: (Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3) -> Curve3
// Calculate the second derivative of the bezier curve.
Bezier.cubicdt2 = function(p0, p1, p2, p3) {
	return function(t) {
		var r = new THREE.Vector3(0, 0, 0);
		add(r, p0, -6*t); add(r, p1, 18*t); add(r, p2, -18*t); add(r, p3, 3*t);
		add(r, p0, 6); add(r, p1, -12); add(r, p2, 6);
	};
};


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
