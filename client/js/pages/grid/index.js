import Rect from "../../utils/rect";
import Page from "../../utils/page";

class GridPage extends Page {
  constructor({ scene, gotoHome, nextLevel }) {
    super(scene);
    this.playButton = new Rect("icons/play.png", this.play);
    this.stopButton = new Rect("icons/stop.png", this.stop);
    this.homeButton = new Rect("icons/home.png", this.backHome);
    this.clearButton = new Rect("icons/clear.png", this.clear);
    this.downloadButton = new Rect("icons/download.png", this.download);
    this.rightButton = new Rect("icons/right.png", this.goNext);
    this.buttons = [
      this.playButton,
      this.homeButton,
      this.stopButton,
      this.clearButton,
      this.downloadButton,
      this.rightButton,
    ];
    this.isPlaying = false;
    this.nextLevel = nextLevel;
    this.gotoHome = gotoHome;
  }

  backHome = () => {
    this.stop();
    this.gotoHome();
  };
  goNext = () => {
    this.stop();
    this.nextLevel(this.level);
  };

  clear = () => {
    this.stop();
    this.grids = this.formGrids(this.row, this.col, this.cells);
    this.renderGrids();
  };

  download = () => {
    this.stop();
    this.canvas.toTempFilePath({
      x: this.translateX * 2,
      y: this.translateY * 2,
      width: this.matrixWidth * 2,
      height: this.matrixHeight * 2,
      destWidth: this.matrixWidth * 2,
      destHeight: this.matrixHeight * 2,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          fail: console.error,
        });
      },
    });
  };

  play = () => {
    this.isPlaying = true;
    this.stopButton.visible = true;
    this.playButton.visible = false;
    this.renderGrids();
    this.timer = setInterval(() => {
      const state = this.evolution();
      this.renderGrids();
      if (state) {
        this.stop();
      }
    }, 1000);
  };

  stop = () => {
    this.isPlaying = false;
    this.stopButton.visible = false;
    this.playButton.visible = true;
    clearInterval(this.timer);
    this.renderGrids();
  };

  renderGrids = () => {
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.save();
    const lineWidth = 1;
    const row = this.grids.length,
      col = this.grids.length ? this.grids[0].length : 0;
    this.context.strokeStyle = "black";
    this.context.fillStyle = "black";
    this.context.lineWidth = lineWidth;
    this.matrixWidth = this.cellSize * col;
    this.matrixHeight = this.cellSize * row;
    this.translateX = (this.width - this.matrixWidth) / 2;
    this.translateY = (this.height - this.matrixHeight) / 2;
    this.context.translate(this.translateX, this.translateY);

    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i];
      for (let j = 0; j < row.length; j++) {
        const x = j * this.cellSize;
        const y = i * this.cellSize;
        if (row[j]) {
          this.context.fillRect(x, y, this.cellSize, this.cellSize);
        }
        this.context.strokeRect(x, y, this.cellSize, this.cellSize);
      }
    }
    this.context.restore();
    if (this.isPlaying) {
      this.stopButton.set((this.width - 50) / 2, this.height - 150, 50, 50);
      this.stopButton.drawToCanvas(this.context, this.update);
    } else {
      this.playButton.set((this.width - 50) / 2, this.height - 150, 50, 50);
      this.playButton.drawToCanvas(this.context, this.update);
    }

    if (!this.canEdit) {
      this.rightButton.visible = true;
      this.rightButton.set(
        (this.width - 50) / 2 + 120,
        this.height - 100,
        50,
        50
      );
      this.rightButton.drawToCanvas(this.context, this.update);
    } else {
      this.rightButton.visible = false;
    }

    this.clearButton.set((this.width - 50) / 2 + 60, this.height - 100, 50, 50);
    this.downloadButton.set(
      (this.width - 50) / 2 - 60,
      this.height - 100,
      50,
      50
    );
    this.downloadButton.drawToCanvas(this.context, this.update);
    this.homeButton.set((this.width - 50) / 2 - 120, this.height - 100, 50, 50);

    this.clearButton.drawToCanvas(this.context, this.update);
    this.homeButton.drawToCanvas(this.context, this.update);
  };

  render = (context, width, height, update, data, canvas) => {
    const { cells = [[]], canEdit = true, level } = data || {};
    this.level = level;
    this.cells = cells;
    this.row = 50;
    this.col = 50;
    this.grids = this.formGrids(this.row, this.col, cells);
    this.context = context;
    this.width = width;
    this.height = height;
    this.update = update;
    this.cellSize = 20;
    this.canEdit = canEdit;
    this.canvas = canvas;
    this.renderGrids();
  };

  evolution() {
    const getState = (i, j) => {
      if (
        i >= 0 &&
        i < this.grids.length &&
        j >= 0 &&
        j < this.grids[0].length
      ) {
        return this.grids[i][j];
      } else {
        return 0;
      }
    };

    const newGrids = [];
    let same = true;
    for (let i = 0; i < this.grids.length; i++) {
      const row = this.grids[i];
      const newRow = [];
      for (let j = 0; j < row.length; j++) {
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
        const current = this.grids[i][j];
        const sum = roundCells
          .map(([x, y]) => getState(x, y))
          .reduce((total, cur) => total + cur);
        let next;

        const low = 2,
          high = 3;
        if (current && sum < low) {
          next = 0;
        } else if (current && (sum === low || sum === high)) {
          next = 1;
        } else if (current && sum > high) {
          next = 0;
        } else if (!current && sum === high) {
          next = 1;
        } else {
          next = 0;
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

  handleTouchStart(e) {
    const { x, y } = super.handleTouchStart(e);
    for (let button of this.buttons) {
      if (button.isIn(x, y) && button.visible) {
        button.onClick(e);
        return;
      }
    }

    const inGrid = (i, j) => {
      const startX = j * this.cellSize + this.translateX;
      const endX = startX + this.cellSize;
      const startY = i * this.cellSize + this.translateY;
      const endY = startY + this.cellSize;
      return x >= startX && x <= endX && y >= startY && y <= endY;
    };

    if (this.canEdit) {
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
}

export default GridPage;
