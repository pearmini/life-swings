import Text from "../view3d/text";

class GameInfo {
  constructor(scene) {
    this.scene = scene;
    this.score = new Text(this.scene, -20, 40, "0", 0xffffff);
    this.msg = new Text(this.scene, -15, 30, "太棒了！", 0xffffff);
  }

  updateScore(score) {
    const scoreString = "" + Math.floor(score * 100);
    this.score.updateText(scoreString);
    this.score.render();
  }

  showSuccess() {
    this.msg.instance.visible = true;
    this.score.instance.visible = false;
    this.msg.render();
    setTimeout(() => {
      this.msg.instance.visible = false;
    }, 1500);
  }

  reset() {
    this.score.isRendered = false;
    this.score.instance.visible = true;
    this.scene.remove(this.score.instance);
  }
}

export default GameInfo;
