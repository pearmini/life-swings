import { musicConfig } from "../../config";

class MusicManager {
  constructor() {
    for (let key in musicConfig) {
      this[key] = wx.createInnerAudioContext();
      this[key].src = musicConfig[key];
    }
  }
}

export default new MusicManager();
