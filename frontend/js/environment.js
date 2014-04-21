Environment = (function () {
	//this is where you set up all of the meshes of your environment. Just make sure you use Config.Scene.add() 
	// var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
	// Config.scene.add(cube);
	// var cube2 = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
	// cube2.position.x = 400;
	// Config.scene.add(cube2);
	// this section is for loading models. Below is an example of terrain from blender
	var loader = new THREE.JSONLoader();
	loader.load("js/model.js", function (geometry) {
		var material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: false
		});
		mesh = new THREE.Mesh(geometry, material);
		Config.scene.add(mesh);
		Config.objects.push(mesh);
		mesh.material.materials[0].side = 1;
	});
	//Load custom geometry
	// var loader = new THREE.JSONLoader();
	// loader.load("js/model.js", function (geometry) {
	// 	// var material = new THREE.MeshLambertMaterial({color: 0xff0000});
	// 	var material = new THREE.MeshBasicMaterial({
	// 		color: 0xff0000,
	// 		wireframe: false
	// 	});
	// 	mesh = new THREE.Mesh(geometry, material);
	// 	// scene.add(mesh);
	// 	// objects.push(mesh);
	// 	Config.scene.add(mesh);
	// });
})();