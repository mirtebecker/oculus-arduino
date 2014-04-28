Environment = (function () {
	//this is where you set up all of the meshes of your environment. Just make sure you use Config.Scene.add() 
	// var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
	// Config.scene.add(cube);
	// var cube2 = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
	// cube2.position.x = 400;
	// Config.scene.add(cube2);
	// this section is for loading models. Below is an example of terrain from blender
	// var loader = new THREE.JSONLoader();
	// loader.load("js/model.js", function (geometry) {
	// 	var material = new THREE.MeshBasicMaterial({
	// 		color: 0xff0000,
	// 		wireframe: false
	// 	});
	// 	mesh = new THREE.Mesh(geometry, material);
	// 	Config.scene.add(mesh);
	// 	Config.objects.push(mesh);
	// 	// mesh.material.materials[0].side = 1;
	// });
	var light = new THREE.PointLight(0xffffff);
	light.position.set(-100, 200, 100);
	light.intensity = 2;
	Config.scene.add(light);
	var light2 = new THREE.PointLight(0xffffff);
	light2.position.set(100, 200, 100);
	Config.scene.add(light2);
	var ambientLight = new THREE.AmbientLight(0xffffff);
	Config.scene.add(ambientLight);
	//Let's try to add some clouds
	var geometry = new THREE.Geometry();
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));
	console.log(texture);
	//This needs to be defined in the scope of init() for some reason
	for (var i = 0; i < 8000; i++) {
		plane.position.x = Math.random() * 1000 - 500;
		plane.position.y = -Math.random() * Math.random() * 200 - 15;
		plane.position.z = i;
		plane.rotation.z = Math.random() * Math.PI;
		plane.scale.x = plane.y = Math.random() * Math.random() * 1.5 + 0.5;
		THREE.GeometryUtils.merge(geometry, plane);
	}
	var mesh = new THREE.Mesh(geometry, Config.material);
	Config.scene.add(mesh);
	mesh = new THREE.Mesh(geometry, Config.material);
	mesh.position.z = -8000;
	Config.scene.add(mesh);
})();