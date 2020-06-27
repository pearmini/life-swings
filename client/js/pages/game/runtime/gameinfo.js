import { globalConfig, sceneConfig } from "../../../../config";
const { aspect } = globalConfig;
const { frustumSize } = sceneConfig;

class GameInfo {
  constructor(scene) {
    this.scene = scene;
    this.addGameOver();
    this.hideGameOver();
  }

  addGameOver() {
    this.region = [
      (window.innerWidth - 200) / 2,
      (window.innerWidth - 200) / 2 + 200,
      (window.innerHeight - 100) / 2,
      (window.innerHeight - 100) / 2 + 100,
    ];
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.texture = new THREE.Texture(this.canvas);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
    });
    this.geometry = new THREE.PlaneGeometry(
      frustumSize * 2,
      aspect * frustumSize * 2
    );
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.z = 20;
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "#333";
    this.context.fillRect(
      (window.innerWidth - 200) / 2,
      (window.innerHeight - 100) / 2,
      200,
      100
    );
    this.context.fillStyle = "#eee";
    this.context.font = "20px Georgia";
    this.context.fillText(
      "Game Over",
      (window.innerWidth - 200) / 2 + 50,
      (window.innerHeight - 100) / 2 + 55
    );
    this.texture.needsUpdate = true;
    this.scene.add(this.obj);
  }

  reset() {
    this.hideGameOver();
  }

  renderGameOver() {
    this.obj.visible = true;
  }

  hideGameOver() {
    this.obj.visible = false;
  }

  renderGameScore() {}
}

export default GameInfo;
