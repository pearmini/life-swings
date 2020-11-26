import Sprite from "../../../utils/sprite";
import font from "../../../../fonts/index";

class Text extends Sprite {
  constructor(scene, x, y, text = "", color = 0xffffff) {
    super(scene, x, y);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
    });
    const geometry = new THREE.TextGeometry(text, {
      font: new THREE.Font(font),
      size: 6.0,
      height: 0.1,
    });
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.position.set(x, y, 0);
  }

  updateText(text) {
    this.instance.geometry = new THREE.TextGeometry("" + text, {
      font: new THREE.Font(font),
      size: 6.0,
      height: 0.1,
    });
  }
}

export default Text;
