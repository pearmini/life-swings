import Rect from "../../utils/rect";
import Page from "../../utils/page";

class RankPage extends Page {
  constructor({ scene, gotoHome }) {
    super(scene);
    this.homeButton = new Rect("icons/home-fill.png", this.back);
    this.rightButton = new Rect("icons/right-fill.png", this.nextPage);
    this.leftButton = new Rect("icons/left-fill.png", this.prePage);
    this.buttons = [this.homeButton, this.leftButton, this.rightButton];
    this.gotoHome = gotoHome;

    // 初始化和排行榜相关的东西
    this.openDataContext = wx.getOpenDataContext();
    this.openDataContext.postMessage({
      type: "init",
      payload: {
        width: window.innerWidth * 2,
        height: window.innerHeight * 2,
      },
    });
  }

  prePage = () => {
    this.openDataContext.postMessage({
      type: "pre",
    });
    this.scene.updateSharedCanvas();
  };

  nextPage = () => {
    this.openDataContext.postMessage({
      type: "next",
    });
    this.scene.updateSharedCanvas();
  };

  back = () => {
    this.scene.hideSharedCanvas();
    this.gotoHome();
  };

  renderContent = () => {
    this.scene.showSharedCanvas();
  };

  renderPage = () => {
    // 绘制背景
    const iconSize = this.width * 0.1;
    const iconY = this.height * 0.8 + iconSize / 2;
    const backgroundWidth = this.width * 0.8,
      backgroundHeight = this.height * 0.6;
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "rgba(0,0,0,0.3)";
    this.context.fillRect(0, 0, this.width, this.height);

    //绘制 title
    this.context.font = `bold 25px '微软雅黑'`;
    this.context.fillStyle = "white";
    this.context.textBaseline = "bottom";
    this.context.textAlign = "left";
    const title = "好友排行榜";
    const titleWidth = this.context.measureText(title).width;
    this.context.fillText(
      title,
      (this.width - titleWidth) / 2,
      this.height * 0.2 - 15
    );

    // 绘制主要内容
    this.context.save();
    this.context.fillStyle = "#3d3b3f";
    this.context.translate(
      (this.width - backgroundWidth) / 2,
      (this.height - backgroundHeight) / 2
    );
    this.context.fillRect(0, 0, backgroundWidth, backgroundHeight);
    this.renderContent();
    this.context.restore();

    // 绘制按钮
    this.homeButton.set(this.width * 0.1, iconY, iconSize, iconSize);
    this.rightButton.set(
      this.width * 0.9 - iconSize,
      iconY,
      iconSize,
      iconSize
    );
    this.leftButton.set(
      this.width * 0.9 - iconSize * 2 - 10,
      iconY,
      iconSize,
      iconSize
    );
    this.homeButton.drawToCanvas(this.context, this.update);
    this.rightButton.drawToCanvas(this.context, this.update);
    this.leftButton.drawToCanvas(this.context, this.update);
  };

  render = (context, width, height, update) => {
    this.width = width;
    this.height = height;
    this.context = context;
    this.update = update;
    this.pageIndex = 0;
    this.renderPage();
  };

  handleTouchEnd = (e) => {
    const { x, y } = super.getMousePosition(e);
    for (let button of [...this.buttons]) {
      if (button.isIn(x, y)) {
        button.onClick(e);
        break;
      }
    }
  };
}

export default RankPage;
