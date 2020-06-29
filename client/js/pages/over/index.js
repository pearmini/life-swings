import Rect from "../../utils/rect";
import Page from "../../utils/page";

class OverPage extends Page {
  constructor({ scene, restartGame, gotoHome }) {
    super(scene);
    this.title = new Rect("images/game_over_title.png");
    this.restartButton = new Rect("images/noplay.png", this.restart);
    this.homeButton = new Rect("icons/home.png", gotoHome);
    this.buttons = [this.restartButton, this.homeButton];
    this.restartGame = restartGame;
  }

  restart = () => {
    this.restartGame(this.level);
  };

  render = (context, width, height, update, data) => {
    this.level = data.level;
    context.fillStyle = "rgba(0,0,0,0.3)";
    context.fillRect(0, 0, width, height);
    this.title.set((width - 200) / 2, 150, 200, 55);
    this.title.drawToCanvas(context, update);
    this.restartButton.set(
      (width - 200) / 2,
      (window.innerHeight - 200) / 2 + 200,
      200,
      85
    );
    this.restartButton.drawToCanvas(context, update);
    this.homeButton.set(
      (width - 200) / 2 + 70,
      (window.innerHeight - 20) / 2 + 200,
      50,
      50
    );
    this.homeButton.drawToCanvas(context, update);
  };

  handleTouchStart(e) {
    const { x, y } = super.handleTouchStart(e);
    for (let button of this.buttons) {
      if (button.isIn(x, y)) {
        button.onClick(e);
        break;
      }
    }
  }
}

export default OverPage;
