import { useRouter, useState } from "@tarojs/taro";
import { View, Image, Video} from "@tarojs/components";
import { AtForm, AtInput, AtMessage, AtFab } from "taro-ui";
import MediaCard from "../../components/MediaCard/index";
import SkillsModel from "../../models/skill";
import MyTextarea from "../../components/MyTextarea/index";
import "@tarojs/async-await";
import "./index.css";

export default function() {
  const skillsModel = new SkillsModel();
  const router = useRouter(),
    { typeid } = router.params;

  const initialState = typeid
    ? {
        done: false,
        imagePath: "",
        videoPath: "",
        name: "",
        content: "",
        typeid
      }
    : Taro.getStorageSync("skill");
  Taro.removeStorageSync("skill");

  const [skill, setSkill] = useState(initialState);
  const [initialSkill, setInitialSkill] = useState(initialState);
  const [mode, setMode] = useState(typeid ? "edit" : "read");

  function handleNameChange(value) {
    setSkill({ ...skill, name: value });
  }
  function handleContentChange(value) {
    setSkill({ ...skill, content: value });
  }
  function handleImageChange(path) {
    setSkill({ ...skill, imagePath: path });
  }
  function handleVideoChange(path) {
    setSkill({ ...skill, videoPath: path });
  }

  function handleClick() {
    if (mode === "edit" && typeid) {
      handleAddSkill();
    } else if (mode === "edit" && !typeid) {
      handleUpdateSkill();
      setMode("read");
    } else if (mode === "read") {
      setMode("edit");
    }
  }

  async function handleUpdateSkill() {
    const changedKeys = Object.keys(initialSkill).filter(
      key => initialSkill[key] !== skill[key]
    );

    if (changedKeys.length === 0) {
      Taro.atMessage({
        message: "没有修改～"
      });
      return;
    }
    try {
      Taro.showLoading({
        title: "uploading..."
      });

      const data = await skillsModel.update(skill, changedKeys);
      console.log(data);

      Taro.setStorageSync("updatedSkill", skill);
      Taro.atMessage({
        message: "修改成功～",
        type: "success"
      });
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "上传失败",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
      setInitialSkill({ ...skill });
    }
  }

  async function handleAddSkill() {
    if (skill.name === "" || skill.content === "") {
      Taro.atMessage({
        message: "名字和内容不能为空~",
        type: "error"
      });
      return;
    }

    // 保存
    try {
      Taro.showLoading({
        title: "uploading"
      });
      const info = await skillsModel.add(typeid, skill);
      Taro.setStorageSync("newSkill", { ...skill, ...info });
      Taro.navigateBack({
        delta: 1
      });
    } catch (err) {
      console.log(err);
      Taro.atMessage({
        message: "上传失败",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
    }
  }
  return (
    <View>
      {mode === "read" ? (
        <View className="container">
          <View>{skill.name}</View>
          {skill.imagePath && (
            <View>
              <Image src={skill.imagePath} mode="aspectFit" />
            </View>
          )}
          {skill.videoPath && (
            <View>
              <Video src={skill.videoPath} />
            </View>
          )}
          <View className="content">
            {skill.content &&
              skill.content
                .split("\n")
                .map(item => <View class="p">{item}</View>)}
          </View>
        </View>
      ) : (
        <View>
          <AtForm>
            <AtInput
              name="value"
              title="名字"
              type="text"
              placeholder="想要培养技能的名字"
              value={skill.name}
              onChange={handleNameChange}
            />
            <View className="media">
              <MediaCard
                type="image"
                src={skill.imagePath}
                onUpload={handleImageChange}
              />
              <MediaCard
                type="video"
                src={skill.videoPath}
                onUpload={handleVideoChange}
              />
              <MyTextarea
                value={skill.content}
                onChange={handleContentChange}
                placeholder="和该技能有关的东西..."
              />
            </View>
          </AtForm>
        </View>
      )}
      <View className="btn">
        <AtFab onClick={handleClick}>
          <Text
            className={`at-fab__icon at-icon ${
              mode === "read" ? "at-icon-edit" : "at-icon-upload"
            }`}
          ></Text>
        </AtFab>
      </View>
      <AtMessage />
    </View>
  );
}
