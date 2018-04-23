class Game {

	constructor(scene, vrFrameData) {
		this.scene = scene;
		this.vrFrameData = vrFrameData;
		this.fighterInScene = false;

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
						this.boxHelper = new THREE.BoxHelper( this.tieFighter );
						this.boxHelper.material.color.set( 0xffffff );
						this.scene.add( this.boxHelper );
					}.bind(this));
			}.bind(this));
	}

	spawnFighter() {
		if (!this.tieFighter) {
			return;
		}
		var fighter = this.tieFighter;
		var target = this.getPositionWithOffset(1);
		target.x -= Math.random();
		var initialPos = target.clone();
		initialPos.z -= 10;
		fighter.position.copy(initialPos);
		fighter.quaternion.copy(this.getOrientation());
		this.scene.add(fighter);
		var tween = new TWEEN.Tween(initialPos).to(target, 2000);
		tween.onUpdate(function() {
			fighter.position.z = initialPos.z;
		});
		tween.start();
		this.fighterInScene = true;
	}

	onClick() {
		this.shoot();
	}

	shoot() {
		var geometry = new THREE.BoxGeometry(0.03, 0.03, 2);
		var material = new THREE.MeshBasicMaterial({
			color: 0xff0000
		});
		var laser = new THREE.Mesh(geometry, material);
		var startPosition = this.getPositionWithOffset(0.5);
		startPosition.y -= 0.2;
		var endPosition = this.getPositionWithOffset(10);
		laser.position.copy(startPosition);
		laser.quaternion.copy(this.getOrientation());
		var tween = new TWEEN.Tween(startPosition).to(endPosition, 2000);
		tween.onUpdate(function() {
			laser.position.x = startPosition.x;
			laser.position.y = startPosition.y;
			laser.position.z = startPosition.z;
			var laserBox = new THREE.Box3().setFromObject(laser);
			if (this.tieFighterBox.intersectsBox(laserBox)) {
				scene.remove(laser);
				this.spawnFighter();
				tween.stop();
			}
		}.bind(this));
		tween.onComplete(function() {
			this.scene.remove(laser);
		}.bind(this));
		tween.start();
		this.scene.add(laser);
	}

	update() {
		if (!this.fighterInScene) {
			this.spawnFighter();
		}
		if (this.boxHelper) {
			this.boxHelper.update();
		}
		if(this.tieFighter) {
			this.tieFighterBox = new THREE.Box3().setFromObject(this.tieFighter);
		}
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
	
	getNormalizedDirectoin() {
		var direction = new THREE.Vector3(0, 0, -1);
		direction.applyQuaternion(this.getOrientation());
		direction.normalize();
		return direction;
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