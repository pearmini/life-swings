import Rect from "../../utils/rect";
import Page from "../../utils/page";
import musicManager from "../../utils/musicManager";

class GridPage extends Page {
  constructor({ scene, gotoHome, nextLevel }) {
    super(scene);
    this.playButton = new Rect("icons/play.png", this.play);
    this.ffButton = new Rect("icons/ff.png", this.ff);
    this.stopButton = new Rect("icons/stop.png", this.stop);
    this.homeButton = new Rect("icons/home-fill-black.png", this.backHome);
    this.clearButton = new Rect("icons/clear.png", this.clear);
    this.rightButton = new Rect("icons/right-fill-black.png", this.goNext);
    this.saveButton = new Rect("icons/save-fill.png");
    this.helpButton = new Rect("icons/help-fill.png");
    this.buttons = [
      this.playButton,
      this.homeButton,
      this.clearButton,
      this.rightButton,
      this.ffButton,
      this.stopButton,
      this.saveButton,
    ];

    this.nextLevel = nextLevel;
    this.gotoHome = gotoHome;
    this.speed = 1000;
  }

  backHome = () => {
    this.stop();
    this.gotoHome();
  };

  ff = () => {
    this.playButton.visible = false;
    this.stopButton.visible = true;
    this.ffButton.visible = false;
    this.isFast = true;
    this.speed = 500;
    this.isPlaying = true;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const state = this.evolution();
      this.renderGrids();
      if (state) {
        this.stop();
      }
    }, this.speed);
  };

  goNext = () => {
    this.stop();
    this.nextLevel(this.level);
  };

  clear = () => {
    this.stop();
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.grids = this.formGrids(this.row, this.col, this.cells);
    this.renderGrids();
  };

  play = () => {
    this.playButton.visible = false;
    this.stopButton.visible = false;
    this.ffButton.visible = true;
    this.isPlaying = true;
    this.isFast = false;
    this.renderGrids();
    this.timer = setInterval(() => {
      const state = this.evolution();
      this.renderGrids();
      if (state) {
        this.stop();
      }
    }, this.speed);
  };

  stop = () => {
    this.playButton.visible = true;
    this.stopButton.visible = false;
    this.ffButton.visible = false;
    this.isPlaying = false;
    this.isFast = false;
    this.speed = 1000;
    clearInterval(this.timer);
    this.renderGrids();
  };

  renderGrids = () => {
    this.iconSize = 50;
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.save();
    const lineWidth = 1;
    const row = this.grids.length,
      col = this.grids.length ? this.grids[0].length : 0;
    this.context.strokeStyle = "#eeeeee";
    this.context.fillStyle = "black";
    this.context.lineWidth = lineWidth;
    this.matrixWidth = this.cellSize * col;
    this.matrixHeight = this.cellSize * row;
    this.translateX = this.width / 2;
    this.translateY = this.height / 2;
    this.context.translate(this.translateX, this.translateY);

    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i];
      for (let j = 0; j < row.length; j++) {
        const x = j * this.cellSize - this.matrixWidth / 2;
        const y = i * this.cellSize - this.matrixHeight / 2;
        if (row[j]) {
          this.context.fillRect(
            x * this.scale + this.offsetX,
            y * this.scale + this.offsetY,
            this.cellSize * this.scale,
            this.cellSize * this.scale
          );
        }
        this.context.strokeRect(
          x * this.scale + this.offsetX,
          y * this.scale + this.offsetY,
          this.cellSize * this.scale,
          this.cellSize * this.scale
        );
      }
    }

    this.context.restore();
    const selectedButton = this.isFast
      ? this.stopButton
      : this.isPlaying
      ? this.ffButton
      : this.playButton;

    selectedButton.set(
      this.width / 2 - 10 - this.iconSize,
      this.height - 100,
      this.iconSize,
      this.iconSize
    );

    selectedButton.drawToCanvas(this.context, this.update);

    if (!this.canEdit) {
      this.rightButton.visible = true;
      this.saveButton.visible = false;
      this.rightButton.set(
        this.width * 0.9 - this.iconSize,
        this.height - 100,
        this.iconSize,
        this.iconSize
      );
      this.rightButton.drawToCanvas(this.context, this.update);
    } else {
      this.rightButton.visible = false;
      this.saveButton.visible = true;
      this.saveButton.set(
        this.width * 0.9 - this.iconSize,
        this.height - 100,
        this.iconSize,
        this.iconSize
      );
      this.saveButton.drawToCanvas(this.context, this.update);
    }

    this.clearButton.set(
      this.width / 2 + 10,
      this.height - 100,
      this.iconSize,
      this.iconSize
    );
    this.homeButton.set(
      this.width * 0.1,
      this.height - 100,
      this.iconSize,
      this.iconSize
    );
    this.helpButton.set(this.width * 0.1, 40, this.iconSize, this.iconSize);

    this.helpButton.drawToCanvas(this.context, this.update);
    this.clearButton.drawToCanvas(this.context, this.update);
    this.homeButton.drawToCanvas(this.context, this.update);

    // 绘制标题
    if (!this.isPlaying) {
      const title = this.name ? this.name : "随意创造";
      this.context.textAlign = "center";
      this.context.fillStyle = "black";
      this.context.font = "bold 30px '字体','字体','微软雅黑','宋体'";
      this.context.fillText(title, this.width / 2, this.height * 0.2);
    }
  };

  render = (context, width, height, update, data, canvas) => {
    const { cells = [[]], canEdit = true, level, rule, name } = data || {};
    this.level = level;
    this.cells = cells;
    this.rule = rule;
    this.row = this.col = this.cells.length % 2 ? 101 : 100;
    this.grids = this.formGrids(this.row, this.col, cells);
    this.context = context;
    this.width = width;
    this.height = height;
    this.update = update;
    this.cellSize = 20;
    this.canEdit = canEdit;
    this.canvas = canvas;
    this.name = name;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isPlaying = false;
    this.isFast = false;
    this.playButton.visible = true;
    this.stopButton.visible = false;
    this.ffButton.visible = false;
    this.touchArray = [];
    this.renderGrids();
  };

  evolution() {
    musicManager.el.play();
    const getState = (i, j) => {
      if (
        i >= 0 &&
        i < this.grids.length &&
        j >= 0 &&
        j < this.grids[0].length
      ) {
        return Math.min(1, this.grids[i][j]);
      } else {
        return 0;
      }
    };

    const newGrids = [];
    let same = true;
    let survive = new Set([2, 3]),
      born = new Set([3]);

    if (this.rule) {
      survive = new Set(this.rule.survive);
      born = new Set(this.rule.born);
    }

    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i];
      const newRow = [];
      for (let j = 0; j < row.length; j++) {
        const current = this.grids[i][j];
        const roundCells = [
          [i - 1, j - 1],
          [i - 1, j],
          [i - 1, j + 1],
          [i, j - 1],
          [i, j + 1],
          [i + 1, j - 1],
          [i + 1, j],
          [i + 1, j + 1],
        ];
        const sum = roundCells
          .map(([x, y]) => getState(x, y))
          .reduce((total, cur) => total + cur);
        let next;
        if (current) {
          next = survive.has(sum) ? 1 : 0;
        } else {
          next = born.has(sum) ? 1 : 0;
        }
        if (next !== current) {
          same = false;
        }
        newRow.push(next);
      }
      newGrids.push(newRow);
    }

    this.grids = newGrids;
    return same;
  }

  formGrids(width, height, cells) {
    const data = [];
    const cellHeight = cells.length;
    const cellWidth = cells.length ? cells[0].length : 0;
    const startI = ((height - cellHeight) / 2) | 0,
      endI = startI + cellHeight;
    const startJ = ((width - cellWidth) / 2) | 0,
      endJ = startJ + cellWidth;
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        if (i >= startI && i < endI && j >= startJ && j < endJ) {
          row.push(cells[i - startI][j - startJ]);
        } else {
          row.push(0);
        }
      }
      data.push(row);
    }
    return data;
  }

  handleTouchMove(e) {
    this.isMove = true;
    const { touches } = e;

    // 处理缩放
    if (touches.length === 2) {
      const dist = (a, b) =>
        Math.sqrt(
          Math.pow(a.pageX - b.pageX, 2) + Math.pow(a.pageY - b.pageY, 2)
        );
      const [preA, preB] = this.preTouches;
      const [curA, curB] = touches;
      const preDist = dist(preA, preB);
      const curDist = dist(curA, curB);
      const diff = curDist - preDist;
      const ratio = 0.005,
        minScale = 0.5,
        maxScale = 2;

      // 限制距离
      this.scale += diff * ratio;
      this.scale = Math.min(this.scale, maxScale);
      this.scale = Math.max(this.scale, minScale);
    }

    // 处理移动
    for (let curTouch of touches) {
      const preTouch = this.preTouches.find(
        (d) => d.identifier === curTouch.identifier
      );
      const diffX = curTouch.pageX - preTouch.pageX;
      const diffY = curTouch.pageY - preTouch.pageY;
      this.offsetX += diffX;
      this.offsetY += diffY;

      // 防止移出屏幕
      this.offsetX = Math.min(
        (this.matrixWidth / 2) * this.scale - this.translateX,
        this.offsetX
      );
      this.offsetX = Math.max(
        (-this.matrixWidth / 2) * this.scale + this.translateX,
        this.offsetX
      );

      this.offsetY = Math.min(
        (this.matrixHeight / 2) * this.scale - this.translateY,
        this.offsetY
      );
      this.offsetY = Math.max(
        (-this.matrixHeight / 2) * this.scale + this.translateY,
        this.offsetY
      );
    }

    this.preTouches = touches;
    this.renderGrids();
  }

  handleTouchEnd(e) {
    const { x, y } = this.getMousePosition(e);

    if (this.isMove) {
      return;
    }

    for (let button of this.buttons) {
      if (button.isIn(x, y) && button.visible) {
        button.onClick(e);
        return;
      }
    }

    const inGrid = (i, j) => {
      const startX =
        j * this.cellSize * this.scale +
        this.translateX +
        this.offsetX -
        (this.matrixWidth / 2) * this.scale;
      const endX = startX + this.cellSize * this.scale;
      const startY =
        i * this.cellSize * this.scale +
        this.translateY +
        this.offsetY -
        (this.matrixHeight / 2) * this.scale;
      const endY = startY + this.cellSize * this.scale;
      return x >= startX && x <= endX && y >= startY && y <= endY;
    };

    if (this.canEdit && !this.isPlaying) {
      for (let i = 0; i < this.grids.length; i++) {
        const row = this.grids[i];
        for (let j = 0; j < row.length; j++) {
          if (inGrid(i, j)) {
            this.grids[i][j] = !this.grids[i][j];
            this.renderGrids();
            return;
          }
        }
      }
    }
  }

  handleTouchStart(e) {
    const { touches } = e;
    this.isMove = false;
    this.preTouches = touches;
  }
}

export default GridPage;
