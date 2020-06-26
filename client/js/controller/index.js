import gameView from "./view";
import gameModel from "./model";

class GameController {
  constructor() {
    this.gameModel = gameModel;
    this.gameView = gameView;
  }

  initPages() {
    const gamePageProps = {};
    this.gameView.initGamePage(gamePageProps);
  }
}

export default new GameController();
