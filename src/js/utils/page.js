class Page {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
  }

  getMousePosition(e) {
    const touch = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : 
                  e.touches && e.touches[0] ? e.touches[0] : null;
    if (!touch) return { x: 0, y: 0 };
    
    // Get canvas bounding rect for accurate positioning
    const canvas = window.canvas;
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
    const pageX = touch.clientX - rect.left;
    const pageY = touch.clientY - rect.top;
    
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
