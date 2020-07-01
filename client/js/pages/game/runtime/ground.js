import Sprite from "../../../utils/sprite";

class Ground extends Sprite {
  constructor(scene) {
    super(scene);
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.ShadowMaterial({
      transparent: true,
      color: 0x000000,
      opacity: 0.3,
    });
    this.instance = new THREE.Mesh(groundGeometry, material);
    this.instance.receiveShadow = true;
    this.instance.rotation.x = -Math.PI / 2;
    this.instance.position.y = -16 / 3.2;
  }

  updateLocation(location) {
    this.instance.position.x = location.x;
    this.instance.position.z = location.z;
  }

  reset() {
    this.instance.position.x = 0;
    this.instance.position.z = 0;
  }
}

export default Ground;
