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
    this.classicButton = new Rect("icons/classic.png", showGridPage);
    this.levelButton = new Rect("icons/level.png", showLevelPage);
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
    context.fillStyle = "rgba(0,0,0,0.2)";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(0,0,0,0.3)";
    context.fillRect(0, height * 0.8, width, height * 0.2);
    const titleWidth = width * 0.65,
      titleHeight = titleWidth / 4;
    this.title.set(
      (width - titleWidth) / 2,
      height * 0.25,
      titleWidth,
      titleHeight
    );
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
      const startButtonWidth = width * 0.5,
        startButtonHeight = (startButtonWidth * 3) / 10;

      this.startButton.set(
        (width - startButtonWidth) / 2,
        height * 0.8 - 100,
        startButtonWidth,
        startButtonHeight
      );
      this.startButton.drawToCanvas(context, update);

      const iconSize = height * 0.2 * 0.6;
      const iconY = height * 0.8 + (height * 0.2 - iconSize) / 2;
      this.classicButton.set(
        (width - iconSize) / 2 + width * 0.15,
        iconY,
        iconSize,
        iconSize
      );
      this.classicButton.drawToCanvas(context, update);
      this.levelButton.set(
        (width - iconSize) / 2 - width * 0.15,
        iconY,
        iconSize,
        iconSize
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
