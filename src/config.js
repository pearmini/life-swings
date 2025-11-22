// iPhone XR dimensions: 414x896
const IPHONE_XR_WIDTH = 414;
const IPHONE_XR_HEIGHT = 896;

// Get container dimensions (iPhone XR size) or window size if smaller
const getContainerSize = () => {
  if (typeof window === 'undefined') {
    return { width: IPHONE_XR_WIDTH, height: IPHONE_XR_HEIGHT };
  }
  
  const container = document.getElementById('gameContainer');
  if (container && container.clientWidth > 0) {
    return {
      width: container.clientWidth,
      height: container.clientHeight
    };
  }
  // Fallback to iPhone XR size or window size if smaller
  return {
    width: Math.min(IPHONE_XR_WIDTH, window.innerWidth),
    height: Math.min(IPHONE_XR_HEIGHT, window.innerHeight)
  };
};

const containerSize = getContainerSize();

export const globalConfig = {
  aspect: containerSize.height / containerSize.width,
};

export const sceneConfig = {
  frustumSize: 30,
};

export const blockConfig = {
  height: 10,
  width: 15,
  maxWidth: 20,
  minWidth: 8,
};

export const pendulumConfig = {
  armLength: 30,
  bobSize: 10,
  locationY: 65,
};

export const colorConfig = {
  list: [
    ["#1b6ca8", "#0a97b0", "#ffd3e1", "#fce8d5"],
    ["#5fdde5", "#f4ea8e", "#f37121", "#d92027"],
    ["#fee2b3", "#ffa299", "#ad6989", "#562349"],
    ["#00005c", "#6a097d", "#c060a1", "#ffdcb4"],
    ["#ffd31d", "#d63447", "#f57b51", "#f6eedf"],
    ["#eb6383", "#fa9191", "#ffe9c5", "#b4f2e1"],
    ["#f9f9f9", "#ffe0ac", "#ffacb7", "#6886c5"],
    ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
    ["#162447", "#1f4068", "#1b1b2f", "#e43f5a"],
    ["#120136", "#035aa6", "#40bad5", "#fcbf1e"],
    ["#f7f7f7", "#43d8c9", "#95389e", "#100303"],
    ["#222831", "#30475e", "#f2a365", "#ececec"],
    ["#0779e4", "#4cbbb9", "#77d8d8", "#eff3c6"],
    ["#f79071", "#fa744f", "#16817a", "#024249"],
  ],
};

export const musicConfig = {
  sucess: "audios/sucess.mp3",
  on: "audios/on.mp3",
  enterGame: "audios/enter-game.mp3",
  out: "audios/out.mp3",
  el: "audios/el.mp3",
  page: "audios/page.mp3",
  start: "audios/start.mp3",
};
