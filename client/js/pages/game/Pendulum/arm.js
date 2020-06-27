import Sprite from "../../../utils/sprite";
import { pendulumConfig } from "../../../../config";
const { armLength } = pendulumConfig;
class Arm extends Sprite {
  constructor(scene, x = 0, y = 0, z = 0) {
    super(scene, x, y, z);
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, armLength, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.receiveShadow = true;
  }

  render() {
    super.render();
    this.instance.position.set(
      this.location.x,
      this.location.y,
      this.location.z
    );
  }
}

export default Arm;
