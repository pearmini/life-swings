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
  }

  updateLocation() {}

  reset() {
    this.instance.rotation.x = -Math.PI / 2;
    this.instance.position.y = -16 / 3.2;
  }
}

export default Ground;
