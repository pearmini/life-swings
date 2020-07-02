import Rect from "../../utils/rect";
import Page from "../../utils/page";
import musicManager from "../../utils/musicManager";

class LevelPage extends Page {
  constructor({ scene, gotoHome, startGame, startGrid }) {
    super(scene);
    this.homeButton = new Rect("icons/home-fill.png", gotoHome);
    this.rightButton = new Rect("icons/right-fill.png", this.nextPage);
    this.leftButton = new Rect("icons/left-fill.png", this.prePage);
    this.title = new Rect("images/level_title.png");
    this.buttons = [this.homeButton, this.rightButton, this.leftButton];
    this.playButtons = [];
    this.page = 0;
    this.limit = 3;
    this.startGame = startGame;
    this.startGrid = startGrid;
  }

  prePage = () => {
    musicManager.page.play();
    if (this.page > 0) {
      this.page--;
    }
    this.renderPage();
  };

  nextPage = () => {
    musicManager.page.play();
    if (this.page < this.pageCount) {
      this.page++;
    }
    this.renderPage();
  };

  renderLevels = () => {
    this.playButtons = [];
    const levels = this.levels.slice(
      this.page * this.limit,
      (this.page + 1) * this.limit
    );
    const cardHeight = (this.height * 0.6) / Math.max(3, this.limit),
      cardWidth = this.width * 0.8,
      cardPadding = 20,
      cardInnerWidth = cardWidth - cardPadding * 2,
      cardInnerHeight = cardHeight - cardPadding * 2,
      translateX = (this.width - cardWidth) / 2,
      translateY = (this.height - cardHeight * levels.length) / 2;

    this.cardPadding = cardPadding;
    this.cardInnerHeight = cardInnerHeight;
    this.cardHeight = cardHeight;
    this.context.save();
    this.context.translate(translateX, translateY);
    this.context.fillStyle = "#3d3b3f";
    this.context.fillRect(0, 0, cardWidth, cardHeight * levels.length);
    this.context.font = "bold 15px '字体','字体','微软雅黑','宋体'";
    this.context.textBaseline = "middle";
    this.context.textAlign = "left";

    for (let i = 0; i < levels.length; i++) {
      this.context.save();
      this.context.translate(0, cardHeight * i);
      const d = levels[i];
      const preScore = this.userInfo.scores.find(
        (s) => s.level === d.index - 1 && s.value === 1
      );
      const score = this.userInfo.scores.find((s) => s.level === d.index);
      const canPlay = d.index === 0 ? true : preScore !== undefined;
      this.context.fillStyle = "#b1b2b3";
      this.context.textBaseline = "top";
      this.context.fillText(
        `第${d.index + 1}关：${d.name}`,
        cardPadding * 1.5,
        20
      );

      this.renderGrids(this.wrapper(d.data), cardHeight);

      const playButton = new Rect("icons/play.png", () =>
        this.startGame(d.index)
      );
      const tx = translateX;
      const ty = translateY;
      const iconSize = 35;
      this.context.save();
      this.context.translate(-tx, -ty - cardHeight * i);
      playButton.set(
        tx + cardInnerWidth - 100,
        ty +
          i * cardHeight +
          (cardHeight - iconSize) / 2 +
          this.cardPadding / 2,
        iconSize,
        iconSize
      );

      playButton.drawToCanvas(this.context, this.update);

      if (!canPlay) {
        playButton.visible = false;
        this.context.font = "bold 20px '字体','字体','微软雅黑','宋体'";
        this.context.fillStyle = "white";
        this.context.textBaseline = "middle";
        this.context.fillText(
          0 + "%",
          tx + cardInnerWidth - 40,
          ty + i * cardHeight + cardHeight / 2 + this.cardPadding / 2
        );
      } else {
        playButton.visible = true;
        if (score && score.value === 1) {
          const elButton = new Rect("icons/el.png", () =>
            this.startGrid(d.index)
          );
          elButton.set(
            tx + cardInnerWidth - 40,
            ty +
              i * cardHeight +
              (cardHeight - iconSize) / 2 +
              this.cardPadding / 2,
            iconSize,
            iconSize
          );
          elButton.drawToCanvas(this.context, this.update);
          this.playButtons.push(elButton);
        } else {
          this.context.font = "bold 20px '字体','字体','微软雅黑','宋体'";
          const value = score ? Math.floor(score.value * 100) : 0;
          this.context.fillStyle = "white";
          this.context.textBaseline = "middle";
          this.context.fillText(
            value + "%",
            tx + cardInnerWidth - 40,
            ty + i * cardHeight + cardHeight / 2 + this.cardPadding / 2
          );
        }
      }
      this.context.restore();

      if (!canPlay) {
        this.context.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.context.fillRect(0, 0, cardWidth, cardHeight);
      }

      this.playButtons.push(playButton);
      this.context.restore();
    }
    this.context.restore();
  };

  wrapper = (data) => {
    const col = data.length ? data[0].length : 0;
    const newData = [];
    const row = [];
    for (let i = 0; i < col + 2; i++) {
      row.push(0);
    }
    newData.push(row);
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      newData.push([0, ...row, 0]);
    }
    newData.push([...row]);
    return newData;
  };

  renderGrids = (data) => {
    const matrixSize = this.cardInnerHeight * 0.7;
    const row = data.length;
    const col = data.length ? data[0].length : 0;
    const maxCellSize = 15;
    const cellSize =
      Math.min(maxCellSize, matrixSize / row, matrixSize / col) | 0;
    const translateX = this.cardPadding + this.width * 0.12,
      translateY =
        (this.cardHeight - cellSize * row) / 2 + this.cardPadding / 2;
    this.context.save();
    this.context.translate(translateX, translateY);
    this.context.strokeStyle = "#aaa";
    this.context.lineWidth = 1;
    this.context.fillStyle = "black";
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        this.context.strokeRect(x, y, cellSize, cellSize);
        if (row[j]) {
          this.context.fillStyle = "black";
        } else {
          this.context.fillStyle = "white";
        }
        this.context.fillRect(x, y, cellSize, cellSize);
      }
    }
    this.context.restore();
  };

  renderPage = () => {
    const iconSize = this.width * 0.1;
    const iconY = this.height * 0.8 + iconSize / 2;
    const titleWidth = this.width * 0.12,
      titleHeight = (titleWidth * 87) / 173;
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "rgba(0,0,0,0.3)";
    this.context.fillRect(0, 0, this.width, this.height);
    this.title.set(
      (this.width - titleWidth) / 2,
      this.height * 0.2 - titleHeight - iconSize / 2,
      titleWidth,
      titleHeight
    );
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
    this.renderLevels();
    if (this.page < this.pageCount - 1) {
      this.rightButton.visible = true;
      this.rightButton.drawToCanvas(this.context, this.update);
    } else {
      this.rightButton.visible = false;
    }
    if (this.page > 0) {
      this.leftButton.visible = true;
      this.leftButton.drawToCanvas(this.context, this.upadte);
    } else {
      this.leftButton.visible = false;
    }
    this.title.drawToCanvas(this.context, this.update);
    this.homeButton.drawToCanvas(this.context, this.update);
  };

  render = (context, width, height, update, data) => {
    const { levels, userInfo } = data;
    this.levels = levels;
    this.userInfo = userInfo;
    this.context = context;
    this.width = width;
    this.height = height;
    this.update = update;
    this.pageCount = Math.ceil(this.levels.length / this.limit);
    this.renderPage();
  };

  handleTouchEnd(e) {
    const { x, y } = super.getMousePosition(e);
    for (let button of [...this.buttons, ...this.playButtons]) {
      if (button.isIn(x, y)) {
        button.onClick(e);
        break;
      }
    }
  }
}

export default LevelPage;
