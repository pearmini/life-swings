import Rect from "../../utils/rect";
import Page from "../../utils/page";

class LevelPage extends Page {
  constructor({ scene, gotoHome, startGame, startGrid }) {
    super(scene);
    this.homeButton = new Rect("icons/home.png", gotoHome);
    this.rightButton = new Rect("icons/right.png", this.nextPage);
    this.leftButton = new Rect("icons/left.png", this.prePage);
    this.buttons = [this.homeButton, this.rightButton, this.leftButton];
    this.playButtons = [];
    this.page = 0;
    this.limit = 3;
    this.startGame = startGame;
    this.startGrid = startGrid;
  }

  prePage = () => {
    if (this.page > 0) {
      this.page--;
    }
    this.renderPage();
  };

  nextPage = () => {
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
    const cardHeight = 150,
      cardWidth = this.width * 0.8,
      cardPadding = 10,
      cardInnerWidth = cardWidth - cardPadding * 2,
      cardInnerHeight = cardHeight - cardPadding * 2,
      translateX = (this.width - cardWidth) / 2,
      translateY = (this.height - cardHeight * this.limit) / 2;

    this.context.save();
    this.context.translate(translateX, translateY);
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, cardWidth, cardHeight * levels.length);
    this.context.fillStyle = "black";
    this.context.font = "bold 20px '字体','字体','微软雅黑','宋体'";
    this.context.textBaseline = "top";
    for (let i = 0; i < levels.length; i++) {
      this.context.save();
      this.context.translate(0, cardHeight * i);
      const d = levels[i];
      const preScore = this.userInfo.scores.find(
        (s) => s.level === d.index - 1 && s.value === 1
      );
      const score = this.userInfo.scores.find((s) => s.level === d.index);
      const canPlay = d.index === 0 ? true : preScore !== undefined;
      this.context.fillText(
        `第${d.index + 1}关`,
        cardPadding * 1.5,
        cardPadding * 1.5
      );

      this.renderGrids(d.data, cardHeight);

      const playButton = new Rect("icons/play.png", () =>
        this.startGame(d.index)
      );
      const tx = translateX;
      const ty = translateY;
      this.context.save();
      this.context.translate(-tx, -ty - cardHeight * i);
      playButton.set(
        tx + cardInnerWidth - 120,
        ty + i * cardHeight + (cardHeight - 50) / 2,
        50,
        50
      );

      playButton.drawToCanvas(this.context, this.update);

      if (!canPlay) {
        playButton.visible = false;
        this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.context.fillRect(
          cardPadding,
          cardPadding,
          cardInnerWidth,
          cardInnerHeight
        );
      } else {
        playButton.visible = true;
        if (score && score.value === 1) {
          const elButton = new Rect("icons/el.png", () =>
            this.startGrid(d.index)
          );
          elButton.set(
            tx + cardInnerWidth - 60,
            ty + i * cardHeight + (cardHeight - 50) / 2,
            50,
            50
          );
          elButton.drawToCanvas(this.context, this.update);
          this.playButtons.push(elButton);
        } else {
          this.context.font = "bold 20px '字体','字体','微软雅黑','宋体'";
          const value = score ? Math.floor(score.value * 100) : 0;
          this.context.fillText(
            value + "%",
            cardInnerWidth - 60 + 10,
            (cardHeight - 50) / 2 + 15
          );
        }
      }
      this.context.restore();

      this.playButtons.push(playButton);
      this.context.restore();
    }
    this.context.restore();
  };

  renderGrids = (data, height) => {
    const matrixSize = 100;
    const row = data.length,
      col = data.length ? data[0].length : 0;
    const maxCellSize = 20;
    const cellSize =
      Math.min(maxCellSize, matrixSize / row, matrixSize / row) | 0;
    const translateX = (200 - col * cellSize) / 2,
      translateY = (height - row * cellSize) / 2;
    this.context.save();
    this.context.translate(translateX, translateY);
    this.context.strokeStyle = "black";
    this.context.lineWidth = 1;
    this.context.fillStyle = "black";
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        const x = j * cellSize;
        const y = i * cellSize;
        if (row[j]) {
          this.context.fillRect(x, y, cellSize, cellSize);
        }
        this.context.strokeRect(x, y, cellSize, cellSize);
      }
    }
    this.context.restore();
  };

  renderPage = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "rgba(0,0,0,0.3)";
    this.context.fillRect(0, 0, this.width, this.height);
    this.homeButton.set(30, 30, 50, 50);
    this.leftButton.set(this.width - 150, this.height - 100, 50, 50);
    this.rightButton.set(this.width - 100, this.height - 100, 50, 50);
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

  handleTouchStart(e) {
    const { x, y } = super.handleTouchStart(e);
    for (let button of [...this.buttons, ...this.playButtons]) {
      if (button.isIn(x, y)) {
        button.onClick(e);
        break;
      }
    }
  }
}

export default LevelPage;
