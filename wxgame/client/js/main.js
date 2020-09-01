import controller from "./controller/index";

class Main {
  constructor() {
    controller.initPages();
    controller.initData();
  }
}

export default Main;
