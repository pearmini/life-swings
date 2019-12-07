import { View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.css";

export default function({ title, onDetail: handleDetail, onAdd: handleAdd }) {
  return (
    <View className="container">
      <View className="left">{title}</View>
      <View className="right">
        <AtIcon value="eye" onClick={() => handleDetail()} />
        <AtIcon value="add" onClick={() => handleAdd()} />
      </View>
    </View>
  );
}
