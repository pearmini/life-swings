import Ground from "./runtime/ground";
import GameInfo from "./runtime/gameinfo";
import Cylinder from "./block/cylinder";
import Pendulum from "./Pendulum/index";
import ColorManager from "../../utils/colorManager";
import databus from "./databus";
import { blockConfig, colorConfig } from "../../../config";

const S = 0;
const F = 1;
const RR = 2;
const RL = 3;

class GamePage {
  constructor({ scene, showGameOverPage, showGridPage, updateScore }) {
    this.aniId = 0;
    this.databus = databus;
    this.scene = scene;
    this.gameInfo = new GameInfo(this.scene.camera.instance);
    this.ground = new Ground(this.scene.instance);
    this.pendulum = new Pendulum(this.scene.instance);
    this.showGameOverPage = showGameOverPage;
    this.showGridPage = showGridPage;
    this.updateScore = updateScore;
    this.colorManager = new ColorManager(colorConfig.list);
  }

  restart(data) {
    // 清除状态
    this.ground.reset();
    this.scene.reset([...this.databus.blocks, ...this.databus.bobs]);
    this.pendulum.reset();
    this.databus.reset(data);

    // 初始化场景
    this.moveToNextBlock();

    // 清除上一局的动画
    cancelAnimationFrame(this.aniId);
    this.aniId = requestAnimationFrame(this.loop);
  }

  handleTouchStart = (e) => {
    if (this.databus.gameOver) {
      const pageX = e.changedTouches[0].pageX;
      const pageY = e.changedTouches[0].pageY;
      if (
        pageX > this.gameInfo.region[0] &&
        pageX < this.gameInfo.region[1] &&
        pageY > this.gameInfo.region[2] &&
        pageY < this.gameInfo.region[3]
      ) {
        this.restart();
      }
    } else {
      if (!this.databus.hasTouched) {
        this.databus.currentBob = this.pendulum.release(this.scene.instance);
        this.databus.bobs.push(this.databus.currentBob);
        this.databus.hasTouched = true;
      }
    }
  };

  collisionDetection() {
    const {
      x: blockX,
      y: blockY,
      z: blockZ,
    } = this.databus.currentBlock.location;
    const { x: bobX, y: bobY, z: bobZ } = this.databus.currentBob.location;
    const originDistance =
      Math.pow(blockX - bobX, 2) + Math.pow(blockZ - bobZ, 2);
    const blockWidth = this.databus.currentBlock.width;
    const blockHeight = this.databus.currentBlock.height;
    const bobWidth = (this.databus.currentBob.width / 2) * Math.sqrt(2);
    const radius = Math.pow(blockWidth / 2, 2);

    if (originDistance < radius) {
      // 可以落上去
      if (bobY <= blockY + blockHeight) {
        // 已经落上去了
        return "continue";
      } else {
        return "falling";
      }
    } else {
      // 不能落上去
      if (originDistance >= Math.pow(bobWidth + blockWidth / 2, 2)) {
        // 可以直接掉下去
        if (bobY <= 0) {
          // 已经落地
          return "over";
        } else {
          return "fallinig";
        }
      } else {
        // 会落在圆柱体上
        if (bobY <= blockY + blockHeight) {
          // 已经落地
          return bobX < blockX ? "rotate-left" : "rotate-right";
        } else {
          return "fallinig";
        }
      }
    }
  }

  moveToNextBlock() {
    if (this.databus.nextIndex === this.databus.data.length) {
      this.gameOver(S);
      return;
    }
    const d = this.databus.data[this.databus.nextIndex];
    this.cellSize = 30;
    const targetLocation = {
      x: d.x * this.cellSize,
      y: 0,
      z: -d.y * this.cellSize,
    };
    this.databus.hasTouched = false;
    const { maxWidth, minWidth } = blockConfig;
    const isReverse = Math.floor(Math.random() * 2);
    const originColor = this.colorManager.pop();
    const colors = isReverse ? this.reverseArray(originColor) : originColor;
    const [bobColor, ...blockColors] = colors;
    this.databus.currentBlock = new Cylinder(
      this.scene.instance,
      targetLocation.x,
      targetLocation.y,
      targetLocation.z,
      minWidth + Math.random() * (maxWidth - minWidth),
      blockConfig.height,
      blockColors
    );
    this.databus.blocks.push(this.databus.currentBlock);
    this.databus.score = this.databus.nextIndex / this.databus.data.length;
    this.databus.nextIndex++;
    this.pendulum.updateBobColor(bobColor);
    this.pendulum.updateAcceleration();
    this.pendulum.updateLocation(targetLocation);
    this.scene.updateLocation(targetLocation);
    this.ground.updateLocation(targetLocation);
    if (this.databus.level !== -1) {
      this.gameInfo.updateScore(this.databus.score);
    }
  }

  reverseArray(array) {
    const newArray = [];
    for (let i = array.length - 1; i >= 0; i--) {
      newArray.push(array[i]);
    }
    return newArray;
  }

  gameOver(state) {
    this.databus.gameOver = true;
    const delay = 1500;
    if (state === S) {
      setTimeout(() => {
        this.showGridPage({
          cells: this.databus.cells,
          canEdit: false,
          level: this.databus.level,
          rule: this.databus.rule,
        });
      }, delay);
    } else if (state === F) {
      setTimeout(() => {
        this.showGameOverPage({
          level: this.databus.level,
          score: this.databus.score,
          cells: this.databus.cells,
          nextIndex: this.databus.nextIndex,
          grids: this.databus.data,
          rule: this.databus.data,
        });
      }, delay);
    } else if (state === RR || state === RL) {
      this.databus.currentBob.rotate(state);
      setTimeout(() => {
        this.showGameOverPage({
          level: this.databus.level,
          score: this.databus.score,
          cells: this.databus.cells,
          nextIndex: this.databus.nextIndex,
          grids: this.databus.data,
        });
      }, delay);
    }
    this.updateScore({
      score: this.databus.score,
      level: this.databus.level,
    });
    setTimeout(() => {
      this.gameInfo.reset();
      this.pendulum.reset();
      this.scene.reset([...this.databus.blocks, ...this.databus.bobs]);
    }, delay);
  }

  loop = () => {
    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.loop);
  };

  update() {
    this.pendulum.update();
    if (this.databus.currentBob) {
      this.databus.currentBob.update();
      if (this.databus.currentBob.state === "falling") {
        const state = this.collisionDetection();
        if (state === "over") {
          this.databus.currentBob.state = "ground";
          this.gameOver(F);
        } else if (state === "continue") {
          this.databus.currentBob.state = "block";
          this.moveToNextBlock();
        } else if (state === "rotate-left" || state === "rotate-right") {
          this.databus.currentBob.state = "rotate";
          const flag = state === "rotate-left" ? RL : RR;
          this.gameOver(flag);
        }
      }
    }
  }

  render() {
    this.databus.blocks.forEach((d) => d.render());
    this.databus.bobs.forEach((d) => d.render());
    this.ground.render();
    this.pendulum.render();
    this.scene.render();
  }
}

export default GamePage;
