import Rect from "../../utils/rect";
import Page from "../../utils/page";

class OverPage extends Page {
  constructor({ scene, restartGame, gotoHome }) {
    super(scene);
    this.title = new Rect("images/over_title.png");
    this.restartButton = new Rect("images/replay.png", this.restart);
    this.homeButton = new Rect("icons/home-fill.png", gotoHome);
    this.buttons = [this.restartButton, this.homeButton];
    this.restartGame = restartGame;
  }

  restart = () => {
    this.restartGame(this.level);
  };

  render = (context, width, height, update, data = {}) => {
    const { cells, nextIndex, grids, level = 0, score = 0 } = data;
    this.level = level;
    this.score = score;
    this.nextIndex = nextIndex;
    this.grids = grids;
    this.cells = cells;
    this.context = context;
    this.width = width;

    context.fillStyle = "rgba(0,0,0,0.3)";
    context.fillRect(0, 0, width, height);

    context.textAlign = "center";
    context.fillStyle = "#fff";
    context.font = "normal 20px '字体','字体','微软雅黑','宋体'";
    context.fillText(
      `第 ${this.level + 1} 关本次得分`,
      width / 2,
      height * 0.3 - 100
    );
    context.font = "bold 50px '字体','字体','微软雅黑','宋体'";
    context.fillText((score * 100) | 0, width / 2, height * 0.3 - 30);

    const cardWidth = width * 0.8;
    const cardHeight = height * 0.4;
    const cardPadding = cardWidth * 0.15;
    const tx = (width - cardWidth) / 2;
    const ty = (height - cardHeight) / 2;
    this.cardPadding = cardPadding;
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    context.save();
    context.translate(tx, ty);
    context.fillStyle = "#3d3b3f";
    context.fillRect(0, 0, cardWidth, cardHeight);
    context.font = "bold 30px '字体','字体','微软雅黑','宋体'";
    this.cardInnerHeight = cardWidth * 0.5;
    const stateCells = this.getState(cells);
    this.renderGrids(this.wrapper(stateCells), height);
    context.restore();

    const titleWidth = cardWidth * 0.6,
      titleHeight = (titleWidth * 83) / 428;

    this.titleHeight = titleHeight;
    this.title.set(
      (width - titleWidth) / 2,
      ty + cardPadding / 2,
      titleWidth,
      titleHeight
    );

    const startButtonWidth = width * 0.5,
      startButtonHeight = (startButtonWidth * 3) / 10;
    const iconSize = width * 0.1;
    const buttonY = height * 0.7 + startButtonHeight / 2;
    const iconY = buttonY + (startButtonHeight - iconSize) / 2;

    this.restartButton.set(
      width * 0.9 - startButtonWidth,
      buttonY,
      startButtonWidth,
      startButtonHeight
    );

    this.title.drawToCanvas(context, update);
    this.restartButton.drawToCanvas(context, update);
    this.homeButton.set(width * 0.1, iconY, iconSize, iconSize);
    this.homeButton.drawToCanvas(context, update);
  };

  getState = (data) => {
    const rowcnt = data.length;
    const colcnt = data.length ? data[0].length : 0;
    const newData = this.copy(data);
    const validGrids = this.grids.slice(0, this.nextIndex - 1);
    validGrids.forEach(({ x, y }) => {
      const dx = rowcnt - x - 1;
      const dy = colcnt - y - 1;
      newData[dx][dy] = 2;
    });
    return newData;
  };

  copy(array) {
    const newArray = [];
    for (let row of array) {
      newArray.push([...row]);
    }
    return newArray;
  }

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
    const matrixSize = this.cardHeight * 0.5;
    const row = data.length;
    const col = data.length ? data[0].length : 0;
    const maxCellSize = 25;
    const cellSize =
      Math.min(maxCellSize, matrixSize / row, matrixSize / row) | 0;
    const translateX = (this.cardWidth - col * cellSize) / 2,
      translateY =
        this.cardPadding +
        (this.cardHeight - col * cellSize - this.cardPadding) / 2;
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
        if (row[j] === 2) {
          this.context.fillStyle = "black";
        } else if (row[j] === 1) {
          this.context.fillStyle = "#bbb";
        } else {
          this.context.fillStyle = "white";
        }
        this.context.fillRect(x, y, cellSize, cellSize);
      }
    }
    this.context.restore();
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

export default OverPage;
