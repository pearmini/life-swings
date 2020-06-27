import BaseBlock from "./base";

class CylinderBlock extends BaseBlock {
  constructor(scene, x, y, z, width, height) {
    super(scene, x, y, z, width, height);
    const geometry = new THREE.CylinderGeometry(
      this.width / 2,
      this.width / 2,
      this.height,
      120
    );
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });

    this.instance = new THREE.Mesh(geometry, material);
    this.instance.name = "block";
    this.instance.receiveShadow = true;
    this.instance.castShadow = true;
    this.instance.position.set(x, y, z);
  }
}

export default CylinderBlock;
