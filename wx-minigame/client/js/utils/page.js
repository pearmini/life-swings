class Page {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
  }

  getMousePosition(e) {
    const pageX = e.changedTouches[0].pageX;
    const pageY = e.changedTouches[0].pageY;
    return {
      x: pageX,
      y: pageY,
    };
  }

  showToast({ title, type = "i", success, duration = 1000 }) {
    const bgColor =
      type === "s"
        ? "rgba(0, 255, 0, 0.8)"
        : type === "f"
        ? "rgba(255, 0, 0, 0.8)"
        : "rgba(0, 0, 255, 0.8)";
    const bgW = this.width * 0.8,
      bgH = 50,
      bgX = this.width * 0.1,
      bgY = 120;

    // 绘制背景
    this.context.fillStyle = bgColor;
    this.context.fillRect(bgX, bgY, bgW, bgH);

    // 绘制文字
    this.context.font = `normal 18px '微软雅黑'`;
    this.context.fillStyle = "white";
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.fillText(title, this.width / 2, bgY + bgH / 2);

    this.update();
    setTimeout(() => {
      success && success();
      this.update();
    }, duration);
  }

  show(data) {
    this.render && this.scene.canvas.render(this.render, data);
  }

  hide() {
    this.scene.canvas.hide();
  }
}

export default Page;
