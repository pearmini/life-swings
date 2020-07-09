import Event from "../libs/event";

class GameModel {
  constructor() {
    wx.cloud.init();
    this.stage = "home";
    this.stageChanged = new Event(this);
    this.levels = [];
    this.userInfo = {};
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

  getStage() {
    return this.stage;
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
