class Rect {
  constructor(imgSrc, onClick = () => {}, width = 0, height = 0, x = 0, y = 0) {
    this.img = new Image();
    this.img.src = imgSrc;

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;
    this.onClick = onClick;
    this.visible = true;
  }

  set(x, y, width, height, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    if (imgSrc) {
      this.img = new Image();
      this.img.src = imgSrc;
    }
  }

  drawToCanvas(context, update) {
    if (this.img.complete) {
      context.drawImage(this.img, this.x, this.y, this.width, this.height);
      update && update();
    } else {
      this.img.onload = () => {
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
        update && update();
      };
    }
  }

  isIn(x, y) {
    if (this.visible) {
      return (
        x >= this.x &&
        x <= this.x + this.width &&
        this.y <= y &&
        y <= this.y + this.height
      );
    } else {
      return false;
    }
  }
}

export default Rect;
