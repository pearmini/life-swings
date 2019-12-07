import { View } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import MyList from "../../components/MyList/index";
import { useState, useEffect } from "@tarojs/taro";
import SkillModel from "../../models/skill";
import "./index.css";
export default function() {
  const [practise, setPractise] = useState([]);
  const skillModel = new SkillModel();

  function onDetail(skill) {
    Taro.setStorageSync("skill", skill);
    Taro.navigateTo({
      url: `../../pages/skillDetail/index`
    });
  }

  function onAdd(id) {
    Taro.navigateTo({
      url:`../../pages/practiseDetail/index?sid=${id}`
    })
  }
  useEffect(async () => {
    try {
      Taro.showLoading({
        title: "loading..."
      });
      const practiseList = await skillModel.getList({
        done: false
      });
      setPractise(practiseList);
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "获取失败～",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
    }
  }, []);
  return (
    <View className="container">
      {practise.map(item => (
        <MyList
          key={item._id}
          title={item.name}
          onDetail={() => onDetail(item)}
          onAdd={() => onAdd(item._id)}
        />
      ))}
      <AtMessage />
    </View>
  );
}
