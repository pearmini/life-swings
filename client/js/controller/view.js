import GamePage from "../pages/game/index";

class GameView {
  constructor() {}

  initGamePage(props) {
    this.gamePage = new GamePage(props);
  }
}

export default new GameView();
