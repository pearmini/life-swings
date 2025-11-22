class Rect {
  constructor(imgSrc, onClick = () => {}, width = 0, height = 0, x = 0, y = 0) {
    this.img = new Image();
    this.img.src = imgSrc;
    this.img.onerror = () => {
      // Mark image as broken to prevent draw errors
      this.img._broken = true;
    };

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
      this.img.onerror = () => {
        // Mark image as broken to prevent draw errors
        this.img._broken = true;
      };
    }
  }

  drawToCanvas(context, update) {
    // Skip if image is broken or not loaded
    if (this.img._broken) {
      return;
    }
    
    if (this.img.complete && this.img.naturalWidth > 0) {
      try {
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
        update && update();
      } catch (e) {
        // Image is broken, mark it and skip drawing
        this.img._broken = true;
        console.warn('Failed to draw image:', this.img.src);
      }
    } else {
      this.img.onload = () => {
        if (!this.img._broken && this.img.naturalWidth > 0) {
          try {
            context.drawImage(this.img, this.x, this.y, this.width, this.height);
            update && update();
          } catch (e) {
            this.img._broken = true;
            console.warn('Failed to draw image:', this.img.src);
          }
        }
      };
      this.img.onerror = () => {
        this.img._broken = true;
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
