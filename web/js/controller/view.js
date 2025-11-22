import GamePage from "../pages/game/index.js";
import HomePage from "../pages/home/index.js";
import GridPage from "../pages/grid/index.js";
import GameOverPage from "../pages/over/index.js";
import LevelPage from "../pages/level/index.js";
import HelpPage from "../pages/help/index.js";
import RankPage from "../pages/rank/index.js";
import MyPage from "../pages/my/index.js";

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

  showHelpPage() {
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

  showRankPage(data) {
    this.rankPage.show(data);
  }

  showMyPage(data) {
    this.myPage.show(data);
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

  initRankPage(props) {
    this.rankPage = new RankPage(props);
  }

  initMyPage(props) {
    this.myPage = new MyPage(props);
  }
}

export default new GameView();
