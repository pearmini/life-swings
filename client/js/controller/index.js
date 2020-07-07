import gameView from "./view";
import gameModel from "./model";
import Scene from "../scene/index";
import musicManager from "../utils/musicManager";

class GameController {
  constructor() {
    this.gameModel = gameModel;
    this.gameView = gameView;
    this.gameModel.stageChanged.attach(this.switchPage);
  }

  switchPage = (_, { stage, data }) => {
    if (stage === "game") {
      this.gameView.showGamePage(data);
    } else if (stage === "game-over") {
      this.gameView.showGameOverPage(data);
    } else if (stage === "home") {
      this.gameView.showHomePage(data);
    } else if (stage === "grid") {
      this.gameView.showGridPage(data);
    } else if (stage === "level") {
      this.gameView.showLevelPage(data);
    } else if (stage === "help") {
      this.gameView.showHelpPage();
    }
  };

  initData() {
    const promiseArr = [
      this.gameModel.getUserInfo(),
      this.gameModel.getLevels(),
    ];

    Promise.all(promiseArr).then(([userData, levelData]) => {
      const levels = levelData.result.data.sort((a, b) => a.index - b.index),
        userInfo = userData.result;
      this.gameView.homePage.setData(userInfo, levels);
      this.gameModel.levels = levels;
      this.gameModel.userInfo = userInfo;
      this.gameView.homePage.show();
    });
  }

  initPages() {
    const initialStage = "home";
    const scene = new Scene();

    const gamePageProps = {
      scene,
      showGameOverPage: (data) => this.gameModel.setStage("game-over", data),
      showGridPage: (data) => this.gameModel.setStage("grid", data),
      updateScore: (data) => this.gameModel.updateScore(data),
    };

    const homePageProps = {
      scene,
      startGame: () => {
        musicManager.start.play();
        const sum = this.gameModel.userInfo.scores.reduce(
          (total, cur) => (total += cur.value),
          0
        );
        if (sum === this.gameModel.levels.length) {
          // 已经完成，去排行版页面
          this.gameModel.setStage("level", {
            levels: this.gameModel.levels,
            userInfo: this.gameModel.userInfo,
          });
        } else {
          // 找到第一个完成的关卡
          const current = this.gameModel.userInfo.scores
            .sort((a, b) => b.level - a.level)
            .find((d) => d.value === 1);
          const nextIndex = current ? current.level + 1 : 0;
          const nextLevel = this.gameModel.levels.find(
            (d) => d.index === nextIndex
          );
          this.gameModel.setStage("game", {
            cells: nextLevel.data,
            level: nextLevel.index,
            rule: nextLevel.rule,
            name: nextLevel.name,
          });
        }
      },
      showGridPage: () => this.gameModel.setStage("grid"),
      showLevelPage: () =>
        this.gameModel.setStage("level", {
          levels: this.gameModel.levels,
          userInfo: this.gameModel.userInfo,
        }),
      showHelpPage: () => this.gameModel.setStage("help"),
    };

    const gameOverPageProps = {
      scene,
      restartGame: (level) => {
        musicManager.start.play();
        const { data, rule, name } = this.gameModel.levels.find(
          (d) => d.index === level
        );
        this.gameModel.setStage("game", {
          cells: data,
          level,
          rule,
          name,
        });
      },
      gotoHome: () => this.gameModel.setStage("home"),
    };

    const gridPageProps = {
      scene,
      gotoHome: () => this.gameModel.setStage("home"),
      nextLevel: (level) => {
        if (level + 1 === this.gameModel.levels.length) {
          this.gameModel.setStage("level", {
            levels: this.gameModel.levels,
            userInfo: this.gameModel.userInfo,
          });
        } else {
          const { data, rule, name } = this.gameModel.levels.find(
            (d) => d.index === level + 1
          );
          this.gameModel.setStage("game", {
            cells: data,
            level: level + 1,
            rule,
            name,
          });
        }
      },
    };

    const levelPageProps = {
      scene,
      gotoHome: () => this.gameModel.setStage("home"),
      startGame: (level) => {
        musicManager.start.play();
        const { data, rule, name } = this.gameModel.levels.find(
          (d) => d.index === level
        );
        this.gameModel.setStage("game", {
          cells: data,
          level,
          rule,
          name,
        });
      },
      startGrid: (level) => {
        const d = this.gameModel.levels.find((d) => d.index === level);
        const data = {
          canEdit: false,
          cells: d.data,
          level,
          rule: d.rule,
          name: d.name,
        };
        this.gameModel.setStage("grid", data);
      },
    };

    const helpPageProps = {
      scene,
      gotoHome: () => this.gameModel.setStage("home"),
    };

    // 初始化 pages
    this.gameView.initGamePage(gamePageProps);
    this.gameView.initHomePage(homePageProps);
    this.gameView.initGameOverPage(gameOverPageProps);
    this.gameView.initGridPage(gridPageProps);
    this.gameView.initLevelPage(levelPageProps);
    this.gameView.initHelpPage(helpPageProps);

    this.gameModel.setStage(initialStage);
    musicManager.enterGame.play();

    // 设置事件监听
    canvas.addEventListener("touchstart", this.handleTouchStart);
    canvas.addEventListener("touchend", this.handleTouchEnd);
    canvas.addEventListener("touchmove", this.handleTouchMove);
  }

  handleTouchEnd = (e) => {
    const stage = this.gameModel.getStage();
    if (stage === "home") {
      this.gameView.homePage.handleTouchEnd(e);
    } else if (stage === "game-over") {
      this.gameView.gameOverPage.handleTouchEnd(e);
    } else if (stage === "grid") {
      this.gameView.girdPage.handleTouchEnd(e);
    } else if (stage === "level") {
      this.gameView.levelPage.handleTouchEnd(e);
    }else if(stage === "help"){
      this.gameView.helpPage.handleTouchEnd(e);
    }
  };

  handleTouchMove = (e) => {
    const stage = this.gameModel.getStage();
    if (stage === "grid") {
      this.gameView.girdPage.handleTouchMove(e);
    }
  };

  handleTouchStart = (e) => {
    const stage = this.gameModel.getStage();
    if (stage === "grid") {
      this.gameView.girdPage.handleTouchStart(e);
    } else if (stage === "game") {
      this.gameView.gamePage.handleTouchStart(e);
    }
  };
}

export default new GameController();
