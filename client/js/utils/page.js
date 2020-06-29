class Page {
  constructor(scene) {
    this.scene = scene;
    this.buttons = [];
  }

  handleTouchStart(e) {
    const pageX = e.changedTouches[0].pageX;
    const pageY = e.changedTouches[0].pageY;
    return {
      x: pageX,
      y: pageY,
    };
  }

  show(data) {
    this.render && this.scene.canvas.render(this.render, data);
  }

  hide() {
    this.scene.canvas.hide();
  }
}

export default Page;
