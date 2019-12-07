import Taro, { Component } from "@tarojs/taro";
import Index from "./pages/index";
import "taro-ui/dist/style/index.scss";

import "./app.css";

class App extends Component {
  config = {
    pages: [
      "pages/types/index",
      "pages/person/index",
      "pages/practise/index",
      "pages/skills/index",
      "pages/skillDetail/index",
      "pages/practiseDetail/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/types/index",
          text: "技能"
        },
        {
          pagePath: "pages/practise/index",
          text: "培养"
        },
        {
          pagePath: "pages/person/index",
          text: "个人"
        }
      ]
    },
    cloud: true
  };

  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
