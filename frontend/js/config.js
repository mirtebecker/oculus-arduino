Config = (function () {
	return {
		WIDTH: window.innerWidth,
		HEIGHT: window.innerHeight,
		camera: new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 0.1, 2000),
		scene: new THREE.Scene(),
		renderer: new THREE.WebGLRenderer({
			antialias: true
		}),
		oculus: true,
		animate: null,
		bodyAngle: 45,
		ray: new THREE.Raycaster(),
		timeNow: Date.now(),
		objects: [],
		gForce: '',
		init: function () {
			//basic three.js configs: Here is where you can set up the initial settings for the environment
			this.renderer.setSize(this.WIDTH, this.HEIGHT);
			this.renderer.setClearColor(0x000000);
			document.body.appendChild(this.renderer.domElement);
			window.addEventListener('resize', this.onWindowResize, false);
			this.camera.position.z = 500;
			this.camera.position.y = 0;
			this.camera.position.x = 0;
			this.scene.add(this.camera);
			var light = new THREE.PointLight(0xffffff);
			light.position.set(-100, 200, 100);
			light.intensity = 2;
			this.scene.add(light);
			var light2 = new THREE.PointLight(0xffffff);
			light2.position.set(100, 200, 100);
			this.scene.add(light2);
			var ambientLight = new THREE.AmbientLight(0xffffff);
			this.scene.add(ambientLight);
			this.ray.ray.direction.set(0, -1, 0);
			controls = new THREE.FlyControls(this.camera);
			controls.dragToLook = "true";
			this.ray.ray.direction.set(0, -1, 0);
			//set up the oculus rift config
			this.effect = new THREE.OculusRiftEffect(this.renderer, {
				worldScale: 100
			});
			this.effect.setSize(window.innerWidth, window.innerHeight);
			// rotate a THREE.js object based on the orientation of the Oculus Rift
			var bridge = new OculusBridge({
				"onOrientationUpdate": function (quatValues) {
					bridgeOrientationUpdated(quatValues);
				}
			});
			bridge.connect();
		},
		render: function () {
			controls.update(1);
			this.renderer.render(this.scene, this.camera);
			this.effect.render(this.scene, this.camera);
			Logic.rotate();
			console.log(this.gForce);
		},
		onWindowResize: function () {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	};
})();