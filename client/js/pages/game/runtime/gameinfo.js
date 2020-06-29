import Text from "../view3d/text";

class GameInfo {
  constructor(scene) {
    this.scene = scene;
    this.score = new Text(this.scene, -20, 40, "0");
  }

  updateScore(score) {
    const scoreString = "" + Math.floor(score * 100);
    this.score.updateText(scoreString);
    this.score.render();
  }

  reset() {
    this.score.isRendered = false;
    this.scene.remove(this.score.instance);
  }
}

export default GameInfo;
