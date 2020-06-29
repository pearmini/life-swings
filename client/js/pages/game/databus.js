class DataBus {
  constructor() {
    this.reset();
  }

  reset(data) {
    const { level, cells } = this.getInfo(data);
    this.score = 0;
    this.blocks = [];
    this.bobs = [];
    this.nextIndex = 0;
    this.cells = cells;
    this.data = this.traverse(this.cells);
    this.nextIndex = 0;
    this.currentBlock = null;
    this.currentBob = null;
    this.gameOver = false;
    this.level = level;
  }

  getInfo(data) {
    if (!data) {
      return {
        cells: [[1]],
        level: -1,
      };
    }
    return {
      ...data,
    };
  }

  traverse(cells) {
    const dist = (d) => d.x * d.x + d.y * d.y;
    const compare = (a, b) => a.x - b.x || dist(a) - dist(b);
    return cells
      .flatMap((row, i) =>
        row.map((d, j) => ({
          value: d,
          y: row.length - j - 1,
          x: cells.length - i - 1,
        }))
      )
      .filter((d) => d.value)
      .sort(compare);
  }
}

export default new DataBus();
