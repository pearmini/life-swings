import Sprite from "../../../utils/sprite";
import { pendulumConfig, blockConfig } from "../../../../config";
import animate, { tweenAnimation } from "../../../libs/animate";
import musicManager from "../../../utils/musicManager";

const { bobSize } = pendulumConfig;
const { height } = blockConfig;

const RR = 2;
const RL = 3;

class Bob extends Sprite {
  constructor(scene, x, y, z, color = 0xffffff) {
    super(scene, x, y, z);

    const geometry = new THREE.BoxGeometry(bobSize, bobSize, bobSize);
    const material = new THREE.MeshLambertMaterial({
      color,
    });
    this.state = "normal";
    this.width = bobSize;
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.receiveShadow = true;
    this.rotateAxis = new THREE.Vector3(-1, 0, 1).normalize();
  }

  updateColor(color) {
    this.instance.material.color = new THREE.Color(color);
    this.instance.material.needsUpdate = true;
  }

  fall(velocity) {
    this.acceleration = new THREE.Vector3(0, -0.1, 0);
    this.velocity = velocity;
    this.state = "falling";
  }

  rotate(flag) {
    this.location.y = height;
    let preValue = 0;
    const toAngle = flag === RL ? Math.PI / 2 : -Math.PI / 2;
    const toOffset = flag === RL ? -7 : 7;
    tweenAnimation(0, toAngle, 0.8, "Linear", (value) => {
      const currentVlaue = value - preValue;
      preValue = value;
      this.instance.rotateOnAxis(this.rotateAxis, currentVlaue);
    });
    animate(
      this.location,
      { x: this.location.x },
      { x: this.location.x + toOffset },
      0.4,
      100
    );
    animate(
      this.location,
      {
        y: this.location.y,
      },
      {
        y: 0,
      },
      0.4,
      350
    );

    setTimeout(() => {
      musicManager.out.play();
    }, 350);
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

export default Bob;
