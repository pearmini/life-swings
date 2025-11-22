import Event from "../libs/event.js";

class GameModel {
  constructor() {
    this.stage = "home";
    this.stageChanged = new Event(this);
    this.levels = [];
    this.userInfo = {};
    this.lives = [];
  }

  async getLevels() {
    // Load levels from JSON files
    const levels = [];
    const levelNames = [
      "T-tetromino", "Glider", "Clock", "Toad", "Thunderbird",
      "Pi-heptomino", "Bun", "Butterfly", "Bipole", "Cap",
      "Gliders_by_the_dozen", "Lightweight_spaceship", "House",
      "Figure_eight", "Octagon", "Unix", "Tumbler", "Dinner_table",
      "Worker_bee", "Pulsar"
    ];
    
    for (let i = 0; i < 20; i++) {
      try {
        const response = await fetch(`data/${i}-${levelNames[i]}.json`);
        if (response.ok) {
          const data = await response.json();
          levels.push(data);
        }
      } catch (e) {
        console.warn(`Failed to load level ${i}`, e);
      }
    }
    
    return Promise.resolve({ result: { data: levels } });
  }

  getUserInfo() {
    // Load from localStorage
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const userInfo = JSON.parse(stored);
      return Promise.resolve({ result: userInfo });
    }
    
    // Create new user
    const userInfo = {
      scores: [],
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    return Promise.resolve({ result: userInfo });
  }

  getLives() {
    // Load from localStorage
    const stored = localStorage.getItem('lives');
    const lives = stored ? JSON.parse(stored) : [];
    return Promise.resolve({ result: { data: lives } });
  }

  updateScore(data) {
    const { level, score } = data;
    if (level < 0) return;
    const currentScore = this.userInfo.scores.find((d) => d.level === level);
    if (currentScore && currentScore.value > score) return;
    if (currentScore) {
      const index = this.userInfo.scores.indexOf(currentScore);
      this.userInfo.scores[index].value = score;
    } else {
      this.userInfo.scores.push({ value: score, level });
    }
    this.uploadScore(this.userInfo.scores);
  }

  uploadScore(scores) {
    // Save to localStorage
    this.userInfo.scores = scores;
    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    return Promise.resolve();
  }

  add(data) {
    // Save to localStorage
    const _id = Date.now().toString();
    const newLife = {
      ...data,
      _id,
      type: "mine",
      data: this.generateCells(data.data),
    };
    
    this.lives.push(newLife);
    localStorage.setItem('lives', JSON.stringify(this.lives));
    
    this.showToast("添加成功～");
  }

  remove(d) {
    const { _id } = d;
    this.lives = this.lives.filter(life => life._id !== _id);
    localStorage.setItem('lives', JSON.stringify(this.lives));
    this.showToast("删除成功");
  }

  update(id, data) {
    // Update local data
    const u = this.lives.find((d) => d._id === id);
    if (u) {
      const index = this.lives.indexOf(u);
      if (data.data) {
        this.lives[index] = { ...u, ...data, data: this.generateCells(data.data) };
      } else {
        this.lives[index] = { ...u, ...data };
      }
      localStorage.setItem('lives', JSON.stringify(this.lives));
      this.showToast("修改成功");
    }
  }
  
  showToast(message) {
    // Simple web notification - can be enhanced with a toast library
    console.log(message);
    // Optionally show browser notification or custom toast
    if (window.showToast) {
      window.showToast(message);
    }
  }

  getStage() {
    return this.stage;
  }

  generateCells(data) {
    let minX = Infinity,
      minY = Infinity;
    let maxX = -1,
      maxY = -1;

    // 找到边界
    data.forEach(([i, j]) => {
      minX = Math.min(minX, j);
      maxX = Math.max(maxX, j);
      minY = Math.min(minY, i);
      maxY = Math.max(maxY, i);
    });

    // 找到对应的映射关系
    const row = maxY - minY + 1;
    const col = maxX - minX + 1;
    const size = Math.max(row, col);
    const find = (data, i, j) => {
      const iOffset = ((size - row) / 2) | 0;
      const jOffset = ((size - col) / 2) | 0;
      return data.find((d) => d[0] + iOffset === i && d[1] + jOffset === j);
    };

    //放到中心去
    const newData = [];
    for (let i = 0; i < size; i++) {
      const rowData = [];
      for (let j = 0; j < size; j++) {
        const d = find(data, i, j);
        rowData.push(d ? 1 : 0);
      }
      newData.push(rowData);
    }
    return newData;
  }

  setStage(stage, data) {
    this.stage = stage;
    this.stageChanged.notify({
      stage,
      data,
    });
  }
}

export default new GameModel();
