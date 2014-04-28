Logic = (function () {
	//this is just an example of simple logic, and where to put it.
	return {
		//you can define scene logic here
		rotate: function () {
			if (Config.scene.children[2]) {
				Config.scene.children[2].rotation.y += .0005;
			}
		}
	}
})();