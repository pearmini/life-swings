import Event from "../libs/event";

class GameModel {
  constructor() {
    wx.cloud.init();
    this.stage = "home";
    this.stageChanged = new Event(this);
    this.levels = [];
    this.userInfo = {};
    this.lives = [];
    this.db = wx.cloud.database();
  }

  getLevels() {
    return wx.cloud.callFunction({
      name: "getLevels",
    });
  }

  getUserInfo() {
    return wx.cloud.callFunction({
      name: "getUserInfo",
    });
  }

  getLives() {
    return wx.cloud.callFunction({
      name: "getLives",
    });
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
    // 更新微信服务器数据
    const sum = scores.reduce((total, cur) => (total += cur.value), 0) | 0;
    wx.setUserCloudStorage({
      KVDataList: [{ key: "sum", value: `${sum}+${0}` }],
    });

    // 更新云端数据
    return wx.cloud.callFunction({
      name: "uploadScore",
      data: {
        scores,
      },
    });
  }

  add(data) {
    // 更新云端数据
    this.db
      .collection("lives")
      .add({
        data,
      })
      .then(({ _id }) => {
        this.lives.push({
          ...data,
          _id,
          type: "mine",
          data: this.generateCells(data.data),
        });

        // 更新排行榜数据
        const sum =
          this.userInfo.scores.reduce((total, cur) => (total += cur.value), 0) |
          0;
        const count = this.lives.length;
        wx.setUserCloudStorage({
          KVDataList: [{ key: "sum", value: `${sum}+${count}` }],
        });

        wx.showToast({
          title: "添加成功～",
        });
      });
  }

  remove(d) {
    const { _id } = d;
    this.db
      .collection("lives")
      .doc(_id)
      .remove()
      .then(() => {
        // 更新排行榜数据
        const sum =
          this.userInfo.scores.reduce((total, cur) => (total += cur.value), 0) |
          0;
        const count = this.lives.length;
        wx.setUserCloudStorage({
          KVDataList: [{ key: "sum", value: `${sum}+${count}` }],
        });

        wx.showToast({
          title: "删除成功",
        });
      });
  }

  update(id, data) {
    // 更新本地数据，如果是更新了 data
    const u = this.lives.find((d) => d._id === id);
    if (u && data.data) {
      const index = this.lives.indexOf(u);
      this.lives[index] = { ...u, data: this.generateCells(data.data) };
    }

    // 更新云端数据
    this.db
      .collection("lives")
      .doc(id)
      .update({
        data,
      })
      .then(() => {
        wx.showToast({
          title: "修改成功",
        });
      });
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
