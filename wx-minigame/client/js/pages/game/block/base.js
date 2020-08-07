import Sprite from "../../../utils/sprite";
import { blockConfig } from "../../../../config";

class BaseBlock extends Sprite {
  constructor(
    scene,
    x = 0,
    y = 0,
    z = 0,
    width = blockConfig.width,
    height = blockConfig.height
  ) {
    super(scene, x, y, z);
    this.height = height;
    this.width = width;
  }
}

export default BaseBlock;
