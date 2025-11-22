import Camera from "./camera.js";
import Light from "./light.js";
import Canvas from "./canvas.js";
import Background from "./background.js";

class Scene {
  constructor() {
    // 渲染器设置
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      perserveDrawinigBuffer: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // 创建场景中的物体
    const offscreenCanvas = document.createElement("canvas");
    // For web, use a regular canvas instead of shared canvas
    const sharedCanvas = document.createElement("canvas");
    this.instance = new THREE.Scene();
    this.camera = new Camera(this.instance);
    this.light = new Light(this.instance);
    this.canvas = new Canvas(this.camera.instance, offscreenCanvas); // 用于绘制基本的页面
    this.sharedCanvas = new Canvas(this.camera.instance, sharedCanvas, true); // 用于绘制排行版页面
    this.background = new Background(this.camera.instance);
  }

  updateLocation(location) {
    this.camera.updateLocation(location);
    this.light.updateLocation(location);
  }

  showSharedCanvas() {
    this.sharedCanvas.render();
  }

  hideSharedCanvas(){
    this.sharedCanvas.hide();
  }

  updateSharedCanvas(){
    this.sharedCanvas.update();
  }

  render() {
    this.camera.render();
    this.light.render();
    this.background.render();
    this.renderer.render(this.instance, this.camera.instance);
  }

  clear(array) {
    array.forEach((obj) => {
      const instance = obj.instance;
      this.instance.remove(instance);
      if (instance.geometry) {
        instance.geometry.dispose();
      }
      if (instance.material) {
        instance.material.dispose();
      }
    });
  }

  reset() {
    this.camera.reset();
    this.light.reset();
  }
}

export default Scene;
