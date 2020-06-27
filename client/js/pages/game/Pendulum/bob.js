import Sprite from "../../../utils/sprite";
import { pendulumConfig, blockConfig } from "../../../../config";
const { bobSize } = pendulumConfig;
const { height } = blockConfig;

class Box extends Sprite {
  constructor(scene, x, y, z) {
    super(scene, x, y, z);
    const geometry = new THREE.BoxGeometry(bobSize, bobSize, bobSize);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });
    this.state = "normal";
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.receiveShadow = true;
  }

  fall(velocity) {
    this.acceleration = new THREE.Vector3(0, -0.1, 0);
    this.velocity = velocity;
    this.state = "falling";
  }

  update() {
    if (this.state === "falling") {
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
    } else if (this.state === "ground") {
      this.location.y = 0;
    } else if (this.state === "block") {
      this.location.y = height;
    }
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

export default Box;
