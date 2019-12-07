import { useRouter, useState, useEffect, useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtMessage } from "taro-ui";
import SkillCard from "../../components/SkillCard/index";
import SkillsModel from "../../models/skill";
import "./index.css";

export default function(props) {
  const router = useRouter();
  const skillsModel = new SkillsModel();
  const [skills, setSkills] = useState([]);
  const { typeid } = router.params;
  function handleAdd() {
    Taro.navigateTo({
      url: `../skillDetail/index?typeid=${typeid}`
    });
  }
  async function handleDone(item) {
    try {
      Taro.showLoading({
        title: "change"
      });
      await skillsModel.changeStatus(item);

      // 更新视图
      const updatedSkill = skills.find(ele => ele._id === item._id);
      const index = skills.indexOf(updatedSkill);
      updatedSkill.done = !item.done;
      const newSkills = [...skills];
      newSkills.splice(index, 1, updatedSkill);
      setSkills(newSkills);

      // 显示反馈
      Taro.atMessage({
        message: "修改成功",
        type: "success"
      });
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "修改失败～",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
    }
  }
  async function handleDelete(item) {
    try {
      Taro.showLoading({
        title: "deleting"
      });
      await skillsModel.delete(item);

      // 更新界面
      const deleteSkill = skills.find(element => element._id === item._id);
      const index = skills.indexOf(deleteSkill);
      const upatedSkills = [...skills];
      upatedSkills.splice(index, 1);
      setSkills(upatedSkills);

      // 用户反馈
      Taro.atMessage({
        message: "删除成功",
        type: "success"
      });
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "删除失败",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
    }
  }

  async function handleDetail(item) {
    Taro.setStorageSync("skill", item);
    Taro.navigateTo({
      url: "../../pages/skillDetail/index"
    });
  }
  useDidShow(() => {
    // 更新数据
    const updatedSkill = Taro.getStorageSync("updatedSkill");
    if (updatedSkill) {
      Taro.removeStorageSync("updatedSkill");
      const obj = skills.find(item => item.id === updatedSkill.id);
      const index = skills.indexOf(obj);
      skills.splice(index, 1, updatedSkill);
      setSkills([...skills]);
    }

    //  添加新的数据
    const newSkill = Taro.getStorageSync("newSkill");
    if (newSkill) {
      Taro.removeStorageSync("newSkill");
      setSkills([newSkill, ...skills]);
      Taro.atMessage({
        message: "上传成功",
        type: "success"
      });
    }
  });

  useEffect(async () => {
    try {
      Taro.showLoading({
        title: "loading"
      });
      const skills = await skillsModel.getList({ typeid });
      setSkills(skills);
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "加载失败~",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
    }
  }, []);
  return (
    <View className="container">
      {skills.map(item => (
        <View key={item._id}>
          <SkillCard
            name={item.name}
            done={item.done}
            info={item.content}
            src={item.imagePath}
            onDone={() => handleDone(item)}
            onDelete={() => handleDelete(item)}
            onDetail={() => handleDetail(item)}
          />
        </View>
      ))}
      <AtButton
        type="primary"
        className="add-btn"
        full={true}
        onClick={handleAdd}
      >
        添加
      </AtButton>
      <AtMessage />
    </View>
  );
}
