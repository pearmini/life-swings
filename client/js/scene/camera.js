import Sprite from "../utils/sprite";
import { sceneConfig, globalConfig } from "../../config";
import animate from "../libs/animate";

const { frustumSize } = sceneConfig;
const { aspect } = globalConfig;

class Camera extends Sprite {
  constructor(scene) {
    super(scene);
    this.instance = new THREE.OrthographicCamera(
      -frustumSize,
      frustumSize,
      frustumSize * aspect,
      -frustumSize * aspect,
      -100,
      85
    );
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
        x: location.x - 10,
        y: location.y + 10,
        z: location.z + 10,
      },
      0.5
    );

    animate(
      this.target,
      {
        x: this.target.x,
        y: this.target.y,
        z: this.target.z,
      },
      location,
      0.5
    );
  }

  reset() {
    this.instance.position.set(-10, 10, 10);
    this.target = new THREE.Vector3(0, 0, 0);
    this.instance.lookAt(this.target);
  }
}

export default Camera;
