Environment = (function() {


	//this is where you set up all of the meshes of your environment. Just make sure you use Config.Scene.add() 

	  // var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
	  // Config.scene.add(cube);

	  // var cube2 = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
	  // cube2.position.x = 400;
	  // Config.scene.add(cube2);

	// this section is for loading models. Below is an example of terrain from blender
	var loader = new THREE.JSONLoader();
    loader.load( "js/model.js", function(geometry, materials){
      	mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
      	mesh.postion={x:0, y:0, z:0};
      	mesh.scale={x:200, y:200, z:200};
      	Config.scene.add(mesh);
      	mesh.material.materials[0].side = 1;
    });
 




})();
