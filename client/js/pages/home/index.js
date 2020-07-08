import Rect from "../../utils/rect";
import Page from "../../utils/page";

class HomePage extends Page {
  constructor({
    scene,
    startGame,
    showGridPage,
    showLevelPage,
    showMyPage,
    showRankPage,
    showHelpPage,
    isLoading = true,
  }) {
    super(scene);
    this.title = new Rect("images/title.png");
    this.classicTitle = new Rect("images/classic.png", showGridPage);
    this.startButton = new Rect("images/play.png", startGame);
    this.rankButton = new Rect("icons/rank.png", showRankPage);
    this.myButton = new Rect("icons/my.png", showMyPage);
    this.levelButton = new Rect("icons/level.png", showLevelPage);
    this.helpButton = new Rect("icons/help.png", showHelpPage);
    this.buttons = [
      this.startButton,
      this.classicTitle,
      this.levelButton,
      this.rankButton,
      this.helpButton,
    ];
    this.isLoading = isLoading;
    this.loadingTimer = null;
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

    if (data) {
      const { userInfo, levels, isLoading } = data;
      this.userInfo = userInfo;
      this.levels = levels;
      this.isLoading = isLoading;
    }

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

      // 绘制开始按钮
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
        height * 0.8 - 120,
        startButtonWidth,
        startButtonHeight,
        imagURL
      );
      this.startButton.drawToCanvas(context, update);

      this.helpButton.set(20, 40, 40, 40);
      this.helpButton.drawToCanvas(context, update);

      // 绘制继续经典模式的文字
      const classicWidth = 70;
      const classicHeight = (classicWidth * 127) / 492;
      this.classicTitle.set(
        (width - classicWidth) / 2,
        height * 0.8 - 40,
        classicWidth,
        classicHeight
      );
      this.classicTitle.drawToCanvas(context, update);

      const iconWidth = height * 0.2 * 0.3;
      const iconHeight = (iconWidth * 763) / 507;
      const iconY = height * 0.8 + (height * 0.2 - iconHeight) / 2,
        padding = 0.26;
      this.levelButton.set(
        (width - iconWidth) / 2 - width * padding,
        iconY,
        iconWidth,
        iconHeight
      );
      this.rankButton.set(
        (width - iconWidth) / 2,
        iconY,
        iconWidth,
        iconHeight
      );
      this.myButton.set(
        (width - iconWidth) / 2 + width * padding,
        iconY,
        iconWidth,
        iconHeight
      );
      this.levelButton.drawToCanvas(context, update);
      this.rankButton.drawToCanvas(context, update);
      this.myButton.drawToCanvas(context, update);
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
