Config = (function () {
	return {
		WIDTH: window.innerWidth,
		HEIGHT: window.innerHeight,
		camera: new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 0.1, 2000),
		scene: null,
		renderer: new THREE.WebGLRenderer({
			antialias: false
		}),
		geometry: new THREE.Geometry(),
		geometry2: new THREE.Geometry(),
		fog: new THREE.Fog(0xffffff, -100, 3000),
		plane: new THREE.Mesh(new THREE.PlaneGeometry(64, 64)),
		plane2: new THREE.Mesh(new THREE.PlaneGeometry(100, 100)),
		oculus: true,
		// animate: null,
		bodyAngle: 45,
		material: null,
		ray: new THREE.Raycaster(),
		timeNow: Date.now(),
		objects: [],
		zData: '',
		init: function () {
			//basic three.js configs: Here is where you can set up the initial settings for the environment
			var container = document.createElement('div');
			document.body.appendChild(container);
			// We create a canvas and a gradient for it
			var canvas = document.createElement('canvas');
			canvas.width = 32;
			canvas.height = window.innerHeight;
			var context = canvas.getContext('2d');
			var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
			gradient.addColorStop(0, "#1e4877");
			gradient.addColorStop(0.5, "#4584b4");
			context.fillStyle = gradient;
			context.fillRect(0, 0, canvas.width, canvas.height);
			container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
			container.style.backgroundSize = '32px 100%';
			this.scene = new THREE.Scene();
			//CAMERA
			this.camera.position.z = 50;
			this.camera.position.y = 0;
			this.camera.position.x = 0;
			this.scene.add(this.camera);
			//LIGHTS
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
			//
			var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.25);
			hemiLight.color.setHSL(0.6, 1, 0.75);
			hemiLight.groundColor.setHSL(0.1, 0.8, 0.7);
			hemiLight.position.y = 500;
			this.scene.add(hemiLight);
			//Let's create a background for our sky
			var vertexShader = document.getElementById('vertexShader').textContent,
				fragmentShader = document.getElementById('fragmentShader').textContent,
				uniforms = {
					topColor: {
						type: "c",
						value: new THREE.Color(0x0077ff)
					},
					bottomColor: {
						type: "c",
						value: new THREE.Color(0xffffff)
					},
					offset: {
						type: "f",
						value: 400
					},
					exponent: {
						type: "f",
						value: 0.6
					}
				};
			uniforms.topColor.value.copy(hemiLight.color);
			// this.scene.fog.color.copy(uniforms.bottomColor.value);
			var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
			var skyMat = new THREE.ShaderMaterial({
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				uniforms: uniforms,
				side: THREE.BackSide
			});
			var sky = new THREE.Mesh(skyGeo, skyMat);
			this.scene.add(sky);
			//Let's try to add some clouds
			var texture = new THREE.ImageUtils.loadTexture('js/textures/cloud10.png', undefined, animate);
			// console.log(texture);
			texture.magFilter = THREE.LinearMipMapLinearFilter;
			texture.minFilter = THREE.LinearMipMapLinearFilter;
			//This needs to be defined in the scope of init() for some reason
			material = new THREE.ShaderMaterial({
				uniforms: {
					"map": {
						type: "t",
						value: texture
					},
					"fogColor": {
						type: "c",
						value: this.fog.color
					},
					"fogNear": {
						type: "f",
						value: this.fog.near
					},
					"fogFar": {
						type: "f",
						value: this.fog.far
					}
				},
				vertexShader: document.getElementById('vs').textContent,
				fragmentShader: document.getElementById('fs').textContent,
				depthWrite: false,
				depthTest: false,
				transparent: true
			});
			//This is the first placement of clouds
			for (var i = 0; i < 8000; i++) {
				this.plane.position.x = Math.random() * 1000 - 500;
				this.plane.position.y = -Math.random() * Math.random() * 200 - 15;
				this.plane.position.z = i;
				this.plane.rotation.z = Math.random() * Math.PI;
				this.plane.scale.x = this.plane.y = Math.random() * Math.random() * 1.5 + 0.5;
				THREE.GeometryUtils.merge(this.geometry, this.plane);
			}
			var mesh = new THREE.Mesh(this.geometry, material);
			this.scene.add(mesh);
			mesh = new THREE.Mesh(this.geometry, material);
			mesh.position.z = -8000;
			this.scene.add(mesh);
			//Second placement of clouds
			for (var i = 0; i < 8000; i++) {
				this.plane2.position.x = Math.random() * 10000 - 200;
				this.plane2.position.y = -Math.random() * Math.random() * 2000 - 15;
				this.plane2.position.z = i;
				this.plane.rotation.z = Math.random() * Math.PI;
				this.plane.scale.x = this.plane.y = Math.random() * Math.random() * 1.5 + 0.5;
				THREE.GeometryUtils.merge(this.geometry2, this.plane2);
			}
			var mesh2 = new THREE.Mesh(this.geometry2, material);
			this.scene.add(mesh2);
			mesh2 = new THREE.Mesh(this.geometry2, material);
			mesh2.position.z = -8000;
			this.scene.add(mesh2);
			//
			//renderer final settings
			this.renderer.setSize(this.WIDTH, this.HEIGHT);
			this.renderer.setClearColor(0xffffff);
			container.appendChild(this.renderer.domElement);
			window.addEventListener('resize', this.onWindowResize, false);
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
			//Here I pass the function of the logic
			Logic.rotate();
			Logic.move();
			// console.log(this.Zdata);
		},
		onWindowResize: function () {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}
	};
})();