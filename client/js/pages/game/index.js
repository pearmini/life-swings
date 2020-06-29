import Ground from "./runtime/ground";
import GameInfo from "./runtime/gameinfo";
import Cylinder from "./block/cylinder";
import Pendulum from "./Pendulum/index";
import databus from "./databus";
import { blockConfig } from "../../../config";

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
    const radius = Math.pow(blockConfig.width / 2, 2);
    if (
      bobY <= blockY + blockConfig.height &&
      bobY > 0 &&
      originDistance < radius
    ) {
      return "continue";
    } else if (bobY <= 0) {
      return "over";
    } else {
      return "falling";
    }
  }

  moveToNextBlock() {
    if (this.databus.nextIndex === this.databus.data.length) {
      this.gameOver(true);
      return;
    }
    const d = this.databus.data[this.databus.nextIndex];
    const targetLocation = {
      x: d.x * 30,
      y: 0,
      z: -d.y * 30,
    };
    this.databus.hasTouched = false;
    this.databus.currentBlock = new Cylinder(
      this.scene.instance,
      targetLocation.x,
      targetLocation.y,
      targetLocation.z
    );
    this.databus.blocks.push(this.databus.currentBlock);
    this.databus.score = this.databus.nextIndex / this.databus.data.length;
    this.databus.nextIndex++;
    this.pendulum.updateLocation(targetLocation);
    this.scene.updateLocation(targetLocation);
    this.ground.updateLocation(targetLocation);
    if (this.databus.level !== -1) {
      this.gameInfo.updateScore(this.databus.score);
    }
  }

  gameOver(success) {
    this.databus.gameOver = true;
    if (success) {
      this.databus.score = 1;
      this.showGridPage({
        cells: this.databus.cells,
        canEdit: false,
        level: this.databus.level,
      });
    } else {
      this.showGameOverPage({ level: this.databus.level });
    }
    this.updateScore({
      score: this.databus.score,
      level: this.databus.level,
    });
    this.gameInfo.reset();
    this.scene.reset([...this.databus.blocks, ...this.databus.bobs]);
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
          this.gameOver();
        } else if (state === "continue") {
          this.databus.currentBob.state = "block";
          this.moveToNextBlock();
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
