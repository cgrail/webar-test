class Game {

  constructor(scene, vrFrameData) {
    this.scene = scene;
    this.vrFrameData = vrFrameData;

    var manager = new THREE.LoadingManager();
    var textureLoader = new THREE.TextureLoader( manager );

  new THREE.MTLLoader()
    .load( 'assets/materials.mtl', function ( materials ) {
      materials.preload();
      new THREE.OBJLoader()
      .setMaterials( materials )
      .load( 'assets/tie.obj', function ( object ) {
        var scale = 0.1
          object.scale.set(scale, scale, scale);
          this.maleObj = object;
      }.bind(this));
    }.bind(this) );
  }

  onClick() {
    this.add3DObject(this.maleObj);
  }

  getCone() {
    var geometry = new THREE.ConeGeometry( 0.1, 0.1, 0.1 );
    var material = new THREE.MeshBasicMaterial( {color: 0xFF00FF} );
    var cone = new THREE.Mesh( geometry, material );
    return cone;
  }

  add3DObject(obj, vrFrameData) {
    // Fetch the pose data from the current frame
    var pose = this.vrFrameData.pose;

    // Convert the pose orientation and position into
    // THREE.Quaternion and THREE.Vector3 respectively
    var ori = new THREE.Quaternion(
      pose.orientation[0],
      pose.orientation[1],
      pose.orientation[2],
      pose.orientation[3]
    );

    var pos = new THREE.Vector3(
      pose.position[0],
      pose.position[1],
      pose.position[2]
    );

    var dirMtx = new THREE.Matrix4();
    dirMtx.makeRotationFromQuaternion(ori);

    var push = new THREE.Vector3(0, 0, -1.0);
    push.transformDirection(dirMtx);
    pos.addScaledVector(push, 0.125);

    obj.position.copy(pos);
    obj.quaternion.copy(ori);
    this.scene.add(obj);
  }

}