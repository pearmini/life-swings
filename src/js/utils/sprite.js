class Sprite {
  constructor(scene, x = 0, y = 0, z = 0) {
    this.scene = scene;
    this.instance = null;
    this.isRendered = false;
    this.initLocation = new THREE.Vector3(x, y, z);
    this.location = new THREE.Vector3(x, y, z);
  }

  update() {}

  render() {
    if (!this.isRendered) {
      if (this.instance instanceof Array) {
        this.instance.forEach((d) => this.scene.add(d));
      } else {
        this.scene.add(this.instance);
      }
      this.isRendered = true;
    }
  }
}

export default Sprite;
