import Sprite from "../utils/sprite.js";
import animate from "../libs/animate.js";

class Light extends Sprite {
  constructor(scene) {
    super(scene);
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

    // 平行光看向的物体
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const shadowTarget = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 0.1),
      basicMaterial
    );
    shadowTarget.visible = false;
    shadowTarget.name = "shadowTarget";

    // 平行光
    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.3);
    shadowLight.castShadow = true;
    shadowLight.target = shadowTarget;
    shadowLight.shadow.camera.near = 0.5;
    shadowLight.shadow.camera.far = 500;
    shadowLight.shadow.camera.left = -100;
    shadowLight.shadow.camera.right = 100;
    shadowLight.shadow.camera.bottom = -100;
    shadowLight.shadow.camera.top = 100;
    shadowLight.shadow.mapSize.widhth = 1024;
    shadowLight.shadow.mapSize.height = 1024;

    // 封装成一个数组
    this.instance = [ambientLight, shadowLight, shadowTarget];
  }

  updateLocation(location) {
    const [_, shadowLight, shadowTarget] = this.instance;
    animate(
      shadowTarget.position,
      {
        x: shadowTarget.position.x,
        y: shadowTarget.position.y,
        z: shadowTarget.position.z,
      },
      location,
      0.5
    );
    animate(
      shadowLight.position,
      {
        x: shadowLight.position.x,
        y: shadowLight.position.y,
        z: shadowLight.position.z,
      },
      {
        x: location.x + 10,
        y: location.y + 30,
        z: location.z + 20,
      },
      0.5
    );
  }

  reset() {
    const [ambientLight, shadowLight] = this.instance;
    ambientLight.position.set(0, 0, 0);
    shadowLight.position.set(10, 30, 20);
  }
}

export default Light;
