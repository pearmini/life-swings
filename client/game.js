import "./js/libs/weapp-adapter";
import "./js/libs/symbol";
import * as THREE from "./js/libs/three";
import Main from "./js/main";

// 挂载 THREE 到 window 全部变量上，方便使用
window.THREE = THREE;

// 防止在高清屏幕上模糊
canvas.height = window.innerHeight * 2;
canvas.width = window.innerWidth * 2;

new Main();
