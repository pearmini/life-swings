import Camera from "./camera";
import Light from "./light";
import Canvas from "./canvas";
import Background from "./background";

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
    this.instance = new THREE.Scene();
    this.camera = new Camera(this.instance);
    this.light = new Light(this.instance);
    this.canvas = new Canvas(this.camera.instance);
    this.background = new Background(this.camera.instance);

    // 添加辅助轴线
    // const axesHelper = new THREE.AxesHelper(100);
    // this.instance.add(axesHelper);
  }

  updateLocation(location) {
    this.camera.updateLocation(location);
    this.light.updateLocation(location);
  }

  render() {
    this.camera.render();
    this.light.render();
    this.background.render();
    this.renderer.render(this.instance, this.camera.instance);
  }

  reset(deleteObjList) {
    this.camera.reset();
    this.light.reset();
    deleteObjList.forEach((obj) => {
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
}

export default Scene;
