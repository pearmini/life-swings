class ColorManager {
  constructor(colorArray) {
    this.colorArray = colorArray;
    this.currentArray = [...colorArray];
  }

  pop() {
    const len = this.currentArray.length;
    if (!len) this.currentArray = [...this.colorArray];
    const index = Math.floor(Math.random() * this.currentArray.length);
    const [color] = this.currentArray.splice(index, 1);
    return color;
  }
}

export default ColorManager;
