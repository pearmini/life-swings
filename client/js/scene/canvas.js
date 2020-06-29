import Sprite from "../utils/sprite";
import { globalConfig, sceneConfig } from "../../config";
const { aspect } = globalConfig;
const { frustumSize } = sceneConfig;

class Canvas extends Sprite {
  constructor(scene) {
    super(scene);
    // 设置 canvas
    this.canvas = document.createElement("canvas");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * 2;
    this.canvas.height = this.height * 2;
    this.context = this.canvas.getContext("2d");
    this.context.scale(2, 2);

    // 添加到场景中
    this.texture = new THREE.Texture(this.canvas);
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(
      frustumSize * 2,
      aspect * frustumSize * 2
    );
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.visible = false;
    this.instance.position.z = 60;
  }

  render(cb, data) {
    super.render();
    this.context.clearRect(0, 0, this.width, this.height);
    cb &&
      cb(this.context, this.width, this.height, this.update, data, this.canvas);
    this.instance.visible = true;
    this.update();
  }

  update = () => {
    this.texture.needsUpdate = true;
  };

  hide() {
    this.instance.visible = false;
  }
}

export default Canvas;
