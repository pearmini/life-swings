import Taro from "@tarojs/taro";
import "@tarojs/async-await";
export default async function() {
  let openid = Taro.getStorageSync("openid");
  if (openid) {
    return openid;
  }
  const res = await Taro.cloud.callFunction({
    name: "login",
    data: {}
  });

  openid = res.result.openid;
  Taro.setStorageSync("openid", openid);
  return openid;
}
