sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("webar-test.controller.App", {
		onInit: function() {
			this.arView = this.byId("arView");
		},

		onShowHello: function() {
			this.shoot();
			MessageToast.show("Fire");
		},

		shoot: function() {
			var scene = this.arView.getThreeContext().scene;
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
			}.bind(this));
			tween.start();
			scene.add(laser);
			var laserFire = new Audio("sound/Laser.mp3");
			laserFire.play();
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