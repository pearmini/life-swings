import Text from "../view3d/text.js";

class GameInfo {
  constructor(scene) {
    this.scene = scene;
    this.score = new Text(this.scene, -20, 40, "0", 0xffffff);
    this.msg = new Text(this.scene, -15, 30, "太棒了！", 0xffffff);
  }

  updateScore(score) {
    this.score.instance.visible = true;
    const scoreString = "" + Math.floor(score * 100);
    this.score.updateText(scoreString);
    this.score.render();
  }

  showSuccess() {
    this.msg.instance.visible = true;
    this.hideScore();
    this.msg.render();
    setTimeout(() => {
      this.msg.instance.visible = false;
    }, 1500);
  }

  hideScore() {
    this.score.instance.visible = false;
  }
}

export default GameInfo;
