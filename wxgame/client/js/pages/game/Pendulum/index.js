import Sprite from "../../../utils/sprite";
import { pendulumConfig } from "../../../../config";
import Bob from "./bob";
import Arm from "./arm";
import animate from "../../../libs/animate";

const { bobSize, armLength, locationY } = pendulumConfig;

class Pendulum extends Sprite {
  constructor(scene) {
    super(scene);
  }

  reset() {
    if (this.instance) {
      this.scene.remove(this.instance);
      this.instance.geometry && this.instance.geometry.dispose();
      this.instance.material && this.instance.material.dispose();
    }

    this.instance = new THREE.Object3D();
    this.bob = new Bob(this.instance, 0, -(armLength + bobSize / 2), 0);
    this.arm = new Arm(this.instance, 0, -armLength / 2, 0);
    this.angle = Math.PI / 4;
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.rotateAxis = new THREE.Vector3(-1, 0, 1).normalize();
    this.instance.rotateOnAxis(this.rotateAxis, this.angle);
    this.gravity = 0.005;
    this.needsUpdateGravity = false;
    this.isRendered = false;
    this.location.set(0, locationY, 0);
  }

  updateBobColor(color) {
    this.color = color;
    this.bob.updateColor(color);
  }

  updateAcceleration() {
    this.needsUpdateGravity = true;
  }

  release(scene) {
    const isVertical = true;
    const theta = Math.PI / 4;
    const len = armLength + bobSize / 2;
    const y = locationY - len * Math.cos(this.angle);
    const x = len * Math.sin(this.angle) * Math.sin(theta) + this.location.x;
    const z = len * Math.sin(this.angle) * Math.cos(theta) + this.location.z;
    const speed = len * this.aVelocity;
    const bob = new Bob(scene, x, y, z, this.color);
    const initialVelocity = isVertical
      ? new THREE.Vector3(0, 0, 0)
      : new THREE.Vector3(speed * Math.cos(theta), 0, speed * Math.sin(theta));
    bob.fall(initialVelocity);
    return bob;
  }

  updateLocation(location) {
    animate(
      this.location,
      {
        x: this.location.x,
        y: this.location.y,
        z: this.location.z,
      },
      {
        x: location.x,
        y: locationY,
        z: location.z,
      },
      0.5
    );
  }

  update() {
    const threshold = 0.1;
    if (this.needsUpdateGravity && this.aVelocity < threshold) {
      const max = 0.009;
      const min = 0.004;
      this.gravity = min + Math.random() * (max - min);
      this.needsUpdateGravity = false;
    }
    this.aAcceleration = -1 * this.gravity * Math.sin(this.angle);
    this.aVelocity += this.aAcceleration;
    this.angle += this.aVelocity;
  }

  render() {
    super.render();
    this.bob.render();
    this.arm.render();
    this.instance.position.set(
      this.location.x,
      this.location.y,
      this.location.z
    );
    this.instance.rotateOnAxis(this.rotateAxis, this.aVelocity);
  }
}

export default Pendulum;
