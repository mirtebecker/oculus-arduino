Logic = (function () {
	//this is just an example of simple logic, and where to put it.
	return {
		//you can define scene logic here
		rotate: function () {
			if (Config.scene.children[2]) {
				Config.scene.children[2].rotation.y += .05;
			}
		},
		move: function () {
			Config.scene.children[0].position.z -= Math.floor(Config.zData);
			if (Math.floor(Config.zData) == 0) {
				Config.scene.children[0].position.y -= .3;
			}
			// Config.scene.children[0].position.z
		}
	}
})();