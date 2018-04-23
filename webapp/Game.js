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
		var cube = new THREE.Mesh(geometry, material);
		var startPosition = this.getPositionWithOffset(0.5);
		startPosition.y -= 0.2;
		this.isHit(startPosition);
		var endPosition = this.getPositionWithOffset(10);
		cube.position.copy(startPosition);
		cube.quaternion.copy(this.getOrientation());
		var tween = new TWEEN.Tween(startPosition).to(endPosition, 2000);
		tween.onUpdate(function() {
			cube.position.x = startPosition.x;
			cube.position.y = startPosition.y;
			cube.position.z = startPosition.z;
		});
		tween.onComplete(function() {
			this.scene.remove(cube);
		}.bind(this));
		tween.start();
		this.scene.add(cube);
	}

	isHit(pos) {
		var direction = this.getNormalizedDirectoin();
		//this.visualizeRay(pos, direction);
		var ray = new THREE.Raycaster(pos, direction);
		var collisionResults = ray.intersectObjects([this.tieFighter]);
		if (collisionResults.length > 0) {
			debugger;
			console.log("Hit");
		}
	}

	visualizeRay(pointA, direction) {
		var distance = 100; // at what distance to determine pointB

		var pointB = new THREE.Vector3();
		pointB.addVectors(pointA, direction.multiplyScalar(distance));

		var geometry = new THREE.Geometry();
		geometry.vertices.push(pointA);
		geometry.vertices.push(pointB);
		var material = new THREE.LineBasicMaterial({
			color: 0xff0000
		});
		var line = new THREE.Line(geometry, material);
		this.scene.add(line);
	}

	update() {
		if (!this.fighterInScene) {
			this.spawnFighter();
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