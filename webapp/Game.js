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
						// this.boxHelper = new THREE.BoxHelper( this.tieFighter );
						// this.boxHelper.material.color.set( 0xffffff );
						// this.scene.add( this.boxHelper );
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
				this.explode();
				var explosion = new Audio("sound/Explosion.mp3");
				explosion.play();		
				this.spawnFighter();
				tween.stop();
			}
		}.bind(this));
		tween.onComplete(function() {
			this.scene.remove(laser);
		}.bind(this));
		tween.start();
		this.scene.add(laser);
		var laserFire = new Audio("sound/Laser.mp3");
		laserFire.play();
	}

	update() {
		if (!this.fighterInScene) {
			this.spawnFighter();
		}
		if (this.boxHelper) {
			this.boxHelper.update();
		}
		if (this.tieFighter) {
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

	getOrientation() {
		return new THREE.Quaternion(
			this.vrFrameData.pose.orientation[0],
			this.vrFrameData.pose.orientation[1],
			this.vrFrameData.pose.orientation[2],
			this.vrFrameData.pose.orientation[3]
		);
	}

	explode() {

		var material = new THREE.SpriteMaterial({
			map: new THREE.CanvasTexture(this.generateSprite()),
			blending: THREE.AdditiveBlending
		});
		for (var i = 0; i < 100; i++) {
			var particle = new THREE.Sprite(material);
			this.initParticle(particle, i * 10);
			this.scene.add(particle);
		}
	}

	generateSprite() {
		var canvas = document.createElement('canvas');
		canvas.width = 16;
		canvas.height = 16;
		var context = canvas.getContext('2d');
		var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width /
			2);
		gradient.addColorStop(0, 'rgba(255,255,255,1)');
		gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
		gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
		gradient.addColorStop(1, 'rgba(0,0,0,1)');
		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);
		return canvas;
	}

	initParticle(particle, delay) {
		particle.position.set(0, 0, 0);
		particle.scale.x = particle.scale.y = Math.random() * 32 + 16;
		var duration = 1000;
		new TWEEN.Tween(particle)
			.to({}, duration)
			.start();
		new TWEEN.Tween(particle.position)
			.to({
				x: Math.random() * 4000 - 2000,
				y: Math.random() * 1000 - 500,
				z: Math.random() * 4000 - 2000
			}, duration)
			.start();
		new TWEEN.Tween(particle.scale)
			.to({
				x: 0.01,
				y: 0.01
			}, duration)
			.start();
	}

}