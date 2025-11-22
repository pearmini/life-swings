import Sprite from "../../../utils/sprite.js";
import { pendulumConfig } from "../../../../config.js";
const { armLength } = pendulumConfig;
class Arm extends Sprite {
  constructor(scene, x = 0, y = 0, z = 0) {
    super(scene, x, y, z);

    const sGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
    const sMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    const sphere = new THREE.Mesh(sGeometry, sMaterial);
    sphere.position.y = armLength / 2;

    const cGeometry = new THREE.CylinderGeometry(0.5, 0.5, armLength, 32);
    const cMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    const cylinder = new THREE.Mesh(cGeometry, cMaterial);

    this.instance = new THREE.Object3D();
    this.instance.add(sphere);
    this.instance.add(cylinder);
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
