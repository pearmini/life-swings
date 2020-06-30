import BaseBlock from "./base";
import { blockConfig } from "../../../../config";

class CylinderBlock extends BaseBlock {
  constructor(scene, x, y, z, width, height, colors) {
    super(scene, x, y, z, width, height);

    const topColor = colors[0];
    const middleColor = colors[1];
    const bottomColor = colors[2];
    const topMaterial = new THREE.MeshLambertMaterial({
      color: topColor,
    });
    const middleMaterial = new THREE.MeshLambertMaterial({
      color: middleColor,
    });
    const bottomMaterial = new THREE.MeshLambertMaterial({
      color: bottomColor,
    });

    const innerHeight = 3;
    const outerHeight = (blockConfig.height - innerHeight) / 2;
    const outerGeometry = new THREE.CylinderGeometry(
      width / 2,
      width / 2,
      outerHeight,
      120
    );
    const innerGeometry = new THREE.CylinderGeometry(
      width / 2,
      width / 2,
      innerHeight,
      120
    );

    const totalMesh = new THREE.Object3D();
    const topMesh = new THREE.Mesh(outerGeometry, topMaterial);
    topMesh.position.y = (innerHeight + outerHeight) / 2;
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;

    const middleMesh = new THREE.Mesh(innerGeometry, middleMaterial);
    middleMesh.receiveShadow = true;
    middleMesh.castShadow = true;

    const bottomMesh = new THREE.Mesh(outerGeometry, bottomMaterial);
    bottomMesh.position.y = -(innerHeight + outerHeight) / 2;
    bottomMesh.receiveShadow = true;
    bottomMesh.castShadow = true;

    totalMesh.add(topMesh);
    totalMesh.add(middleMesh);
    totalMesh.add(bottomMesh);
    this.instance = totalMesh;
    this.instance.position.set(x, y, z);
  }
}

export default CylinderBlock;
