import GamePage from "../pages/game/index";
import HomePage from "../pages/home/index";
import GridPage from "../pages/grid/index";
import GameOverPage from "../pages/over/index";
import LevelPage from "../pages/level/index";
import HelpPage from "../pages/help/index";

class GameView {
  constructor() {}

  showHomePage() {
    this.gamePage.restart();
    this.gameOverPage.hide();
    this.homePage.show();
  }

  showGamePage(data) {
    this.gameOverPage.hide();
    this.homePage.hide();
    this.gamePage.restart(data);
  }
  
  showHelpPage(){
    this.helpPage.show();
  }

  showLevelPage(data) {
    this.levelPage.show(data);
  }

  showGridPage(data) {
    this.girdPage.show(data);
  }

  showGameOverPage(data) {
    this.gameOverPage.show(data);
  }

  initGamePage(props) {
    this.gamePage = new GamePage(props);
  }

  initGameOverPage(props) {
    this.gameOverPage = new GameOverPage(props);
  }

  initGridPage(props) {
    this.girdPage = new GridPage(props);
  }

  initHomePage(props) {
    this.homePage = new HomePage(props);
  }

  initHelpPage(props) {
    this.helpPage = new HelpPage(props);
  }

  initLevelPage(props) {
    this.levelPage = new LevelPage(props);
  }
}

export default new GameView();
