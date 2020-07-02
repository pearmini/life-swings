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
    this.buttons = [this.startButton, this.classicButton, this.levelButton];
    this.isLoading = isLoading;
    this.loadingTimer = null;
  }

  setData(userInfo, levels) {
    this.isLoading = false;
    this.userInfo = userInfo;
    this.levels = levels;
  }

  renderLoading = (context, width, height, update) => {
    const start = Date.now();
    const radius = 20;
    this.loadingTimer = setInterval(() => {
      const current = Date.now() - start;
      const degree = current % 360;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(0,0,0,0.2)";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "white";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(
        width / 2,
        height / 2,
        radius,
        (degree - 180) * (Math.PI / 180),
        degree * (Math.PI / 180)
      );
      context.stroke();
      this.title.drawToCanvas(context, update);
      update();
    }, 10);
  };

  render = (context, width, height, update, data) => {
    context.fillStyle = "rgba(0,0,0,0.2)";
    context.fillRect(0, 0, width, height);

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
      this.renderLoading(context, width, height, update);
    } else {
      if (this.loadingTimer) {
        clearInterval(this.loadingTimer);
      }
      context.fillStyle = "rgba(0,0,0,0.3)";
      context.fillRect(0, height * 0.8, width, height * 0.2);
      const startButtonWidth = width * 0.5,
        startButtonHeight = (startButtonWidth * 3) / 10;

      let imagURL;
      if (this.userInfo.scores.length === 0) {
        imagURL = "images/play.png";
      } else {
        const sum = this.userInfo.scores.reduce(
          (total, cur) => (total += cur.value),
          0
        );
        if (sum === this.levels.length) {
          imagURL = "images/finish.png";
        } else {
          imagURL = "images/continue.png";
        }
      }

      this.startButton.set(
        (width - startButtonWidth) / 2,
        height * 0.8 - 100,
        startButtonWidth,
        startButtonHeight,
        imagURL
      );
      this.startButton.drawToCanvas(context, update);

      const iconSize = height * 0.2 * 0.5;
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

  handleTouchEnd(e) {
    const { x, y } = super.getMousePosition(e);
    for (let button of this.buttons) {
      if (button.isIn(x, y)) {
        button.onClick(e);
        break;
      }
    }
  }
}

export default HomePage;
