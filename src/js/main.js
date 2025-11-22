import controller from "./controller/index.js";

class Main {
  constructor() {
    controller.initPages();
    controller.initData();
  }
}

export default Main;
