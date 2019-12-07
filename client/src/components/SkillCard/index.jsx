import { View, Image, Text, Switch } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import url from "../../assets/images/card.jpg";
import "./index.css";
export default function({
  name,
  src = url,
  info,
  done,
  onDelete: handleDelte,
  onDetail: handleDetail,
  onDone: handleDone
}) {
  function hide(string, maxLen) {
    if (!string) return;
    if (string.length < maxLen) return string;
    return `${string.substring(0, maxLen)}...`;
  }
  return (
    <View className="container">
      <View className="header">
        <Text>{name}</Text>
        <Switch onChange={() => handleDone()} checked={done} />
      </View>
      <View className="line" />
      <View className="content">
        <Image src={src} className="left" mode="aspectFit" />
        <View className="right">
          <View className="text">{hide(info, 100)}</View>
          <View className="btns">
            <AtIcon
              value="trash"
              size="20"
              onClick={() => handleDelte()}
            ></AtIcon>
            <AtIcon
              value="eye"
              size="20"
              onClick={() => handleDetail()}
            ></AtIcon>
          </View>
        </View>
      </View>
    </View>
  );
}
