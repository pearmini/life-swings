import Sprite from "../utils/sprite.js";
import { sceneConfig, globalConfig } from "../../config.js";
const { frustumSize } = sceneConfig;
const { aspect } = globalConfig;

class Background extends Sprite {
  constructor(scene) {
    super(scene);

    const backgroundGeometry = new THREE.PlaneGeometry(
        frustumSize * 2,
        aspect * frustumSize * 2
      ),
      material = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xd7dbe6,
        opacity: 1,
      });

    this.instance = new THREE.Mesh(backgroundGeometry, material);
    this.instance.position.z = -84;
  }
}

export default Background;
