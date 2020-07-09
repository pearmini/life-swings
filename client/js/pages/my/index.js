import Rect from "../../utils/rect";
import Page from "../../utils/page";

class MyPage extends Page {
  constructor({ scene, gotoHome, removeLife, updateLife, showGrid }) {
    super(scene);
    this.homeButton = new Rect("icons/home-fill.png", this.back);
    this.rightButton = new Rect("icons/right-fill.png", this.nextPage);
    this.leftButton = new Rect("icons/left-fill.png", this.prePage);
    this.buttons = [this.homeButton, this.rightButton, this.leftButton];
    this.pageIndex = 0;
    this.pageCount = 3;
    this.removeLife = removeLife;
    this.updateLife = updateLife;
    this.gotoHome = gotoHome;
    this.showGrid = showGrid;
  }

  back = () => {
    this.removeEventLisenter();
    this.gotoHome();
  };

  addEventLisenter() {
    wx.onKeyboardConfirm(this.handleKeyboardConfirm);
  }

  removeEventLisenter() {
    wx.offKeyboardConfirm(this.handleKeyboardConfirm);
  }

  handleKeyboardConfirm = ({ value }) => {
    if (value === "") {
      wx.showToast({
        title: "名字不能为空～",
        icon: "none",
      });
      return;
    }

    if (value.length > 20) {
      wx.showToast({
        title: "名字不能超过20个字符",
        icon: "none",
      });
      return;
    }

    // 更新云端数据
    this.updateLife(this.selectedLife._id, {
      name: value,
    });

    // 更新本地数据
    const u = this.data.find((s) => this.selectedLife._id === s._id);
    const i = this.data.indexOf(u);
    this.data[i].name = value;
    this.renderPage();
    this.isInput = false;
    wx.hideKeyboard();
  };

  nextPage = () => {
    this.pageIndex++;
    this.renderPage();
  };

  prePage = () => {
    this.pageIndex--;
    this.renderPage();
  };

  renderContent = () => {
    const lives = this.data.slice(
      this.pageIndex * this.pageCount,
      (this.pageIndex + 1) * this.pageCount
    );

    const padding = 0;
    const margin = 30;
    const gridHeight =
      (this.backgroundHeight - padding * 2 - margin) / this.pageCount;
    const buttonsWidth = this.backgroundWidth * 0.5;
    const cellsWidth = this.backgroundWidth - buttonsWidth;
    const girdWidth = (buttonsWidth - padding) / 3;
    const iconSize = gridHeight * 0.2;
    const translateX = this.translateX,
      translateY = this.translateY;

    this.cellsWidth = cellsWidth;
    this.gridHeight = gridHeight;
    this.margin = margin;

    lives.forEach((d, index) => {
      // 设置
      this.context.textBaseline = "middle";
      this.context.textAlign = "left";
      this.context.font = "normal 15px sans-serif";

      // 绘制名字
      this.context.fillStyle = "#b1b2b3";
      this.context.fillText(
        d.name,
        translateX + girdWidth / 2 + padding,
        translateY + index * gridHeight + margin
      );

      // 绘制格子
      this.context.save();
      this.context.translate(
        translateX,
        translateY + index * gridHeight + margin
      );
      this.renderGrids(this.wrapper(d.data));
      this.context.restore();

      // 绘制查看
      const eyeButton = new Rect("icons/el.png", () => this.eye(d));
      eyeButton.set(
        translateX + cellsWidth,
        translateY + index * gridHeight + margin + (gridHeight - iconSize) / 2,
        iconSize,
        iconSize
      );
      eyeButton.drawToCanvas(this.context, this.update);

      // 绘制编辑
      const editButton = new Rect("icons/edit-fill.png", () => this.edit(d));
      editButton.set(
        translateX + cellsWidth + girdWidth,
        translateY + index * gridHeight + margin + (gridHeight - iconSize) / 2,
        iconSize,
        iconSize
      );
      editButton.drawToCanvas(this.context, this.update);

      // 绘制删除
      const removeButton = new Rect("icons/delete-fill.png", () =>
        this.remove(d)
      );
      removeButton.set(
        translateX + cellsWidth + girdWidth * 2,
        translateY + index * gridHeight + margin + (gridHeight - iconSize) / 2,
        iconSize,
        iconSize
      );
      removeButton.drawToCanvas(this.context, this.upadte);

      this.extraButtons.push(eyeButton, editButton, removeButton);
    });
  };

  eye = (d) => {
    this.showGrid(d);
  };

  edit = (d) => {
    this.isInput = true;
    this.selectedLife = d;
    wx.showKeyboard({
      defaultValue: d.name,
      maxLength: 20,
      multiple: false,
      confirmHold: true,
      confirmType: "done",
    });
  };

  remove = (d) => {
    wx.showModal({
      title: "确认删除？",
      content: "删除之后不能恢复！",
      success: (res) => {
        if (res.confirm) {
          // 云端删除
          this.removeLife(d);

          // 本地删除
          const r = this.data.find((s) => d._id === s._id);
          const i = this.data.indexOf(r);
          this.data.splice(i, 1);
          this.renderPage();
        }
      },
    });
  };

  renderGrids(data) {
    const matrixSize = this.gridHeight * 0.7;
    const row = data.length;
    const col = data.length ? data[0].length : 0;
    const maxCellSize = 15;
    const cellSize =
      Math.min(maxCellSize, matrixSize / row, matrixSize / col) | 0;

    this.context.save();
    this.context.translate(
      (this.cellsWidth - cellSize * col) / 2,
      (this.gridHeight - cellSize * row) / 2
    );
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

  renderPage = () => {
    this.extraButtons = [];
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

    //绘制 title
    this.context.font = `bold 30px '微软雅黑'`;
    this.context.fillStyle = "white";
    this.context.textBaseline = "bottom";
    this.context.textAlign = "left";
    const title = "我的生命";
    const titleWidth = this.context.measureText(title).width;
    this.context.fillText(
      title,
      (this.width - titleWidth) / 2,
      this.height * 0.2 - 15
    );

    this.context.fillStyle = "#3d3b3f";
    this.translateX = (this.width - backgroundWidth) / 2;
    this.translateY = (this.height - backgroundHeight) / 2;
    this.context.fillRect(
      this.translateX,
      this.translateY,
      backgroundWidth,
      backgroundHeight
    );
    this.renderContent();

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

  render = (context, width, height, update, data) => {
    this.width = width;
    this.height = height;
    this.context = context;
    this.update = update;
    this.pageIndex = 0;
    this.data = data;
    this.pageIndex = 0;
    this.totalCnt = Math.ceil(this.data.length / this.pageCount);
    this.selectedLife = null;
    this.isInput = false;
    this.addEventLisenter();
    this.renderPage();
  };

  handleTouchEnd = (e) => {
    const { x, y } = super.getMousePosition(e);

    if (this.isInput) {
      wx.hideKeyboard();
      this.isInput = false;
      return;
    }

    for (let button of [...this.buttons, ...this.extraButtons]) {
      if (button.isIn(x, y)) {
        button.onClick(e);
        break;
      }
    }
  };
}

export default MyPage;
