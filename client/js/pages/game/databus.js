class DataBus {
  constructor() {
    this.reset();
  }

  reset(cells) {
    this.score = 0;
    this.blocks = [];
    this.bobs = [];
    this.nextIndex = 0;
    this.defaultCells = [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ];
    this.data = this.traverse(cells || this.defaultCells);
    this.nextIndex = 0;
    this.currentBlock = null;
    this.currentBob = null;
    this.gameOver = false;
  }

  traverse(cells) {
    const dist = (d) => d.x * d.x + d.y * d.y;
    const compare = (a, b) => a.x - b.x || dist(a) - dist(b);
    return cells
      .flatMap((row, i) =>
        row.map((d, j) => ({
          value: d,
          y: cells.length - j - 1,
          x: row.length - i - 1,
        }))
      )
      .filter((d) => d.value)
      .sort(compare);
  }
}

export default new DataBus();
