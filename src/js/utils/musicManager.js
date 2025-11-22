import { musicConfig } from "../../config.js";

class MusicManager {
  constructor() {
    for (let key in musicConfig) {
      this[key] = new Audio(musicConfig[key]);
      this[key].preload = 'auto';
      // Wrap play() to handle autoplay restrictions
      const originalPlay = this[key].play.bind(this[key]);
      this[key].play = () => {
        const promise = originalPlay();
        if (promise !== undefined) {
          promise.catch(error => {
            // Autoplay was prevented - this is expected and can be ignored
            // Audio will play on next user interaction
            console.debug('Audio autoplay prevented:', error.message);
          });
        }
        return promise;
      };
    }
  }
}

export default new MusicManager();
