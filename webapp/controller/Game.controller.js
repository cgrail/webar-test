sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("webar-test.controller.Game", {
		onInit: function() {
			this.arView = this.byId("arView");
			this.loadTieFighter();
		},

		loadTieFighter: function() {
			new THREE.MTLLoader()
				.load('3dmodel/materials.mtl', function(materials) {
					materials.preload();
					new THREE.OBJLoader()
						.setMaterials(materials)
						.load('3dmodel/tie.obj', function(object) {
							var scale = 0.1
							object.scale.set(scale, scale, scale);
							this.tieFighter = object;
							this.spawnFighter();
						}.bind(this));
				}.bind(this));
		},

		spawnFighter: function() {
			var fighter = this.tieFighter;
			var target = this.getPositionWithOffset(1);
			target.x -= Math.random();
			var initialPos = target.clone();
			initialPos.z -= 10;
			fighter.position.copy(initialPos);
			fighter.quaternion.copy(this.getOrientation());
			this.getScene().add(fighter);
			var tween = new TWEEN.Tween(initialPos).to(target, 2000);
			tween.onUpdate(function() {
				fighter.position.z = initialPos.z;
			});
			tween.start();
		},

		shoot: function() {
			var scene = this.getScene();
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
			});
			tween.onComplete(function() {
				scene.remove(laser);
			});
			tween.start();
			scene.add(laser);
			var laserFire = new Audio("sound/Laser.mp3");
			laserFire.play();
		},

		getScene: function() {
			return this.arView.getThreeContext().scene;
		},

		getPositionWithOffset: function(offset) {
			var dirMtx = new THREE.Matrix4();
			dirMtx.makeRotationFromQuaternion(this.getOrientation());
			var push = new THREE.Vector3(0, 0, -1.0);
			push.transformDirection(dirMtx);
			var pos = this.getPosition();
			pos.addScaledVector(push, offset);
			return pos;
		},

		getPosition: function() {
			var vrFrameData = this.arView.getThreeContext().vrFrameData;
			return new THREE.Vector3(
				vrFrameData.pose.position[0],
				vrFrameData.pose.position[1],
				vrFrameData.pose.position[2]
			);
		},

		getOrientation: function() {
			var vrFrameData = this.arView.getThreeContext().vrFrameData;
			return new THREE.Quaternion(
				vrFrameData.pose.orientation[0],
				vrFrameData.pose.orientation[1],
				vrFrameData.pose.orientation[2],
				vrFrameData.pose.orientation[3]
			);
		}
	});
});