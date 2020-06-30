import Sprite from "../../../utils/sprite";
import animate from "../../../libs/animate";

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

  updateLocation(location) {
    animate(
      this.instance.position,
      {
        x: this.instance.position.x,
        y: this.instance.position.y,
        z: this.instance.position.z,
      },
      {
        x: location.x - Math.PI / 2,
        y: location.y - 16 / 3.2,
        z: location.z,
      },
      0.5
    );
  }

  reset() {
    this.instance.rotation.x = -Math.PI / 2;
    this.instance.position.y = -16 / 3.2;
  }
}

export default Ground;
