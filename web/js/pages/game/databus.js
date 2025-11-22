class DataBus {
  constructor() {
    this.reset();
  }

  reset(data) {
    const { level, cells, rule, name } = this.getInfo(data);
    this.score = 0;
    this.rule = rule;
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
    this.name = name;
    this.colors = [];
  }

  getInfo(data) {
    if (!data) {
      return {
        cells: [[1]],
        level: -1,
        rule: [],
      };
    }
    return {
      ...data,
    };
  }

  traverse(cells) {
    const dist = (a, b) => Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    const validCells = cells
      .flatMap((row, i) =>
        row.map((d, j) => ({
          value: d,
          y: row.length - j - 1,
          x: cells.length - i - 1,
        }))
      )
      .filter((d) => d.value)
      .sort((a, b) => dist(a, { x: 0, y: 0 }) - dist(b, { x: 0, y: 0 }));

    let current = validCells.shift();
    const data = [current];
    while (validCells.length) {
      let min = Infinity,
        minIndex = -1;
      for (let i = 0; i < validCells.length; i++) {
        const c = validCells[i];
        const d = dist(current, c);
        if (d < min) {
          min = d;
          minIndex = i;
        }
      }
      const [d] = validCells.splice(minIndex, 1);
      current = d;
      data.push(d);
    }
    return data;
  }
}

export default new DataBus();
