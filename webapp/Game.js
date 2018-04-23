class Game {

	constructor(scene, vrFrameData) {
		this.scene = scene;
		this.vrFrameData = vrFrameData;

		var manager = new THREE.LoadingManager();
		var textureLoader = new THREE.TextureLoader(manager);

		new THREE.MTLLoader()
			.load('3dmodel/materials.mtl', function(materials) {
				materials.preload();
				new THREE.OBJLoader()
					.setMaterials(materials)
					.load('3dmodel/tie.obj', function(object) {
						var scale = 0.1
						object.scale.set(scale, scale, scale);
						this.tieFighter = object;
					}.bind(this));
			}.bind(this));
	}

	update() {

	}

	onClick() {
		this.fighter = this.add3DObject(this.tieFighter);
		var initialPos = this.fighter.position.clone();
		var target = this.getPositionWithOffset(5);
		var tween = new TWEEN.Tween(initialPos).to(target, 2000);
		tween.onUpdate(function() {
			this.fighter.position.x = initialPos.x;
			this.fighter.position.y = initialPos.y;
		}.bind(this));
		tween.start();
	}

	add3DObject(obj, vrFrameData) {
		obj.position.copy(this.getPositionWithOffset(1));
		obj.quaternion.copy(this.getOrientation());
		this.scene.add(obj);
		return obj;
	}
	
	getPositionWithOffset(offset) {
		var dirMtx = new THREE.Matrix4();
		dirMtx.makeRotationFromQuaternion(this.getOrientation());
		var push = new THREE.Vector3(0, 0, -1.0);
		push.transformDirection(dirMtx);
		var pos = this.getPosition();
		pos.addScaledVector(push, offset);
		return pos;
	} 
	
	getPosition() {
		return new THREE.Vector3(
			this.vrFrameData.pose.position[0],
			this.vrFrameData.pose.position[1],
			this.vrFrameData.pose.position[2]
		);
	}
	
	getOrientation() {
		return new THREE.Quaternion(
			this.vrFrameData.pose.orientation[0],
			this.vrFrameData.pose.orientation[1],
			this.vrFrameData.pose.orientation[2],
			this.vrFrameData.pose.orientation[3]
		);
	}

}