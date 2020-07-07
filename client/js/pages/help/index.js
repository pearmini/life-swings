import Rect from "../../utils/rect";
import Page from "../../utils/page";

class HelpPage extends Page {
  constructor({ scene, gotoHome }) {
    super(scene);
    this.homeButton = new Rect("icons/home-fill.png", gotoHome);
    this.rightButton = new Rect("icons/right-fill.png", this.nextPage);
    this.leftButton = new Rect("icons/left-fill.png", this.prePage);
    this.img = new Rect("images/person.jpg");
    this.buttons = [this.homeButton, this.rightButton, this.leftButton];
    this.pageIndex = 0;
    this.totalCnt = 3;
  }

  nextPage = () => {
    this.pageIndex++;
    this.renderPage();
  };

  prePage = () => {
    this.pageIndex--;
    this.renderPage();
  };

  renderContent = () => {
    if (this.pageIndex === 0) {
      const content = [
        "《生命摇摆》是一个结合《搭楼房》和《生命游戏》的小游戏。",
        "该游戏用于纪念因 COVID-19 病毒去世的生命游戏之父：英国数学家 John Horton Conway 。",
        "生命就是在跌跌撞撞中成长，在摇摇摆摆中繁荣!",
      ];
      const imageURL = "images/person.jpg";
      const ratio = 620 / 775;
      this.renderHelp(content, imageURL, ratio);
    } else if (this.pageIndex === 1) {
      const content = [
        `在“闯关模式”中你的任务是将“能量方块”放在“圆柱体细胞”上。当细胞们都有营养之后，它们会按照一定的规则进行繁衍。`,
        `你可以选择游戏自带的关卡，其中每一个关卡都对应一个经典的《生命游戏》初始状态。同时也可以玩朋友分享的关卡，看看朋友创造的生命。`,
      ];
      const imageURL = "images/game.png";
      const ratio = 820 / 1462;
      this.renderHelp(content, imageURL, ratio);
    } else if (this.pageIndex === 2) {
      const content = [
        `在通过“闯关模式”了解《生命游戏》的基本规则之后，“经典模式”可以让你随心所欲地创造自己的生命。`,
        `你可以将它们保存或者通过关卡的形式分享给好友，让他们来挑战一下你创造的生命！`,
      ];
      const imageURL = "images/game-classic.png";
      const ratio = 824 / 1468;
      this.renderHelp(content, imageURL, ratio);
    }
  };

  renderHelp = (content, imageURL, ratio) => {
    const lineHeight = 15;
    const padding = 20;
    const containerWidth = this.backgroundWidth - padding * 2;
    const lines = [];
    this.context.fillStyle = "white";
    this.context.font = `normal ${lineHeight}px '微软雅黑'`;
    this.context.textBaseline = "top";
    this.context.textAlign = "left";

    // 绘制文字
    for (let c of content) {
      let s = "";
      for (let ch of c) {
        const w = this.context.measureText(s + ch).width;
        if (w > containerWidth) {
          lines.push(s);
          s = ch;
        } else {
          s += ch;
        }
      }
      lines.push(s, " ");
    }
    lines.forEach((l, index) =>
      this.context.fillText(l, padding, index * lineHeight * 1.2 + padding)
    );

    // 绘制图片
    this.context.save();
    this.context.translate(-this.translateX, -this.translateY);
    const imageHeight =
      this.backgroundHeight - padding * 2 - lines.length * lineHeight * 1.2;
    const imageWidth = imageHeight * ratio;
    const imageY = this.backgroundHeight - imageHeight - padding;
    const imageX = (this.backgroundWidth - imageWidth) / 2;

    this.img.set(
      this.translateX + imageX,
      this.translateY + imageY,
      imageWidth,
      imageHeight,
      imageURL
    );
    this.img.drawToCanvas(this.context, this.update);
    this.context.restore();
  };

  renderPage = () => {
    // 绘制背景
    const iconSize = this.width * 0.1;
    const iconY = this.height * 0.8 + iconSize / 2;
    const backgroundWidth = this.width * 0.8,
      backgroundHeight = this.height * 0.6;
    this.backgroundHeight = backgroundHeight;
    this.backgroundWidth = backgroundWidth;
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "rgba(0,0,0,0.3)";
    this.context.fillRect(0, 0, this.width, this.height);
    this.translateX = (this.width - backgroundWidth) / 2;
    this.translateY = (this.height - backgroundHeight) / 2;

    //绘制 title
    this.context.font = `bold 25px '微软雅黑'`;
    this.context.fillStyle = "white";
    this.context.textBaseline = "bottom";
    this.context.textAlign = "left";
    const title = "游戏介绍";
    const titleWidth = this.context.measureText(title).width;
    this.context.fillText(
      title,
      (this.width - titleWidth) / 2,
      this.height * 0.2 - 15
    );

    // 绘制主体
    this.context.save();
    this.context.fillStyle = "#3d3b3f";
    this.context.translate(this.translateX, this.translateY);
    this.context.fillRect(0, 0, backgroundWidth, backgroundHeight);
    this.renderContent();
    this.context.restore();

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

    if (this.pageIndex > 0) {
      this.leftButton.drawToCanvas(this.context, this.update);
      this.leftButton.visible = true;
    } else {
      this.leftButton.visible = false;
    }

    if (this.pageIndex < this.totalCnt - 1) {
      this.rightButton.drawToCanvas(this.context, this.update);
      this.rightButton.visible = true;
    } else {
      this.rightButton.visible = false;
    }

    this.homeButton.drawToCanvas(this.context, this.update);
  };

  render = (context, width, height, update) => {
    this.width = width;
    this.height = height;
    this.context = context;
    this.update = update;
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

export default HelpPage;
