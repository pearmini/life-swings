import Rect from "../../utils/rect";
import Page from "../../utils/page";

class HomePage extends Page {
  constructor({
    scene,
    startGame,
    showGridPage,
    showLevelPage,
    isLoading = true,
  }) {
    super(scene);
    this.title = new Rect("images/title.png");
    this.startButton = new Rect("images/play.png", startGame);
    this.classicButton = new Rect("images/classic_title.png", showGridPage);
    this.levelButton = new Rect("images/level_title.png", showLevelPage);
    this.loading = new Rect("images/loading.png");
    this.buttons = [this.startButton, this.classicButton, this.levelButton];
    this.isLoading = isLoading;
  }

  setData(userInfo, level) {
    this.isLoading = false;
    this.userInfo = userInfo;
    this.level = level;
  }

  render = (context, width, height, update) => {
    context.fillStyle = "rgba(0,0,0,0.3)";
    context.fillRect(0, 0, width, height);
    this.title.set((width - 200) / 2, 150, 200, 55);
    this.title.drawToCanvas(context, update);
    if (this.isLoading) {
      this.loading.set(
        (width - 200) / 2,
        (window.innerHeight - 190) / 2 + 200,
        200,
        50
      );
      this.loading.drawToCanvas(context, update);
    } else {
      const imgSrc =
        this.userInfo.scores.length === 0
          ? "images/play.png"
          : "images/continue.png";
      this.startButton.set(
        (width - 200) / 2,
        (window.innerHeight - 190) / 2 + 200,
        200,
        50,
        imgSrc
      );
      this.startButton.drawToCanvas(context, update);
      this.classicButton.set(
        (width - 200) / 2,
        (window.innerHeight - 70) / 2 + 200,
        200,
        50
      );
      this.classicButton.drawToCanvas(context, update);
      this.levelButton.set(
        (width - 200) / 2,
        (window.innerHeight + 50) / 2 + 200,
        200,
        50
      );
      this.levelButton.drawToCanvas(context, update);
    }
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

export default HomePage;
