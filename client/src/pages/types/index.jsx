import Taro, { useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import TypeItem from "../../components/TypeItem/index";
import TypeModel from "../../models/type";
import {
  AtIcon,
  AtFloatLayout,
  AtInput,
  AtButton,
  AtMessage,
  AtModal
} from "taro-ui";
import "@tarojs/async-await";
import "./index.css";

export default function() {
  const [types, setTypes] = useState([]);
  const [add, setAdd] = useState(false);
  const [trash, setTrash] = useState(false);
  const [curId, setCurId] = useState("");
  const [addTypeValue, setAddTypeValue] = useState("");
  const typeModel = new TypeModel();

  async function handleAddType() {
    if (addTypeValue === "") {
      Taro.atMessage({
        message: "名字不能为空~",
        type: "error"
      });
      return;
    }

    try {
      // 添加
      Taro.showLoading({
        title: "添加中"
      });
      const info = await typeModel.add(addTypeValue);

      // 显示反馈信息
      Taro.atMessage({
        message: "添加成功！",
        type: "success"
      });

      // 添加
      setAdd(false);
      const updatedTypes = [...types, { name: addTypeValue, ...info }];
      setTypes(updatedTypes);
      setAddTypeValue("");
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "添加失败~",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
    }
  }

  async function handleDelete(id) {
    try {
      Taro.showLoading({
        title: "删除中～"
      });
      await typeModel.delete(id);

      // 更新视图
      const updatedTypes = [...types];
      const type = types.find(item => item._id === id);
      const index = types.indexOf(type);
      updatedTypes.splice(index, 1);
      setTypes(updatedTypes);

      Taro.atMessage({
        message: "删除成功~",
        type: "success"
      });
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "删除失败~",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
      setTrash(false);
    }
  }

  async function handleSave(value) {
    try {
      const type = types.find(item => item._id === curId);
      if (type.name === value) {
        return;
      }
      Taro.showLoading({
        title: "changing..."
      });
      await typeModel.update(value, curId);

      // 修改视图
      const index = types.indexOf(type);
      const updateTypes = [...types],
        updateType = { ...type, name: value };
      updateTypes.splice(index, 1, updateType);
      setTypes(updateTypes);

      Taro.atMessage({
        message: "成功",
        type: "success"
      });
    } catch (e) {
      console.error(e);
      Taro.atMessage({
        message: "失败",
        type: "error"
      });
    } finally {
      Taro.hideLoading();
      setCurId(-1);
    }
  }

  function handleSkill(id) {
    Taro.navigateTo({
      url: `../../pages/skills/index?typeid=${id}`
    })
  }

  useEffect(async () => {
    try {
      Taro.showLoading({
        title: "loading"
      });
      const types = await typeModel.getList();
      setTypes(types);
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
    <View>
      <View>
        {types.map((item, index) => (
          <TypeItem
            key={item._id}
            name={item.name}
            editable={curId === item._id}
            onEdit={() => {
              setCurId(item._id);
            }}
            onSkill={() => handleSkill(item._id)}
            onSave={handleSave}
            onDelete={() => {
              setTrash(true);
              setCurId(item._id);
            }}
          />
        ))}
      </View>
      <AtIcon
        value="add-circle"
        size="30"
        className="add-btn"
        onClick={() => setAdd(true)}
      ></AtIcon>
      <AtFloatLayout
        title="添加技能种类"
        isOpened={add}
        onClose={() => setAdd(false)}
      >
        <AtInput
          name="value"
          title="名字"
          type="text"
          value={addTypeValue}
          onChange={value => setAddTypeValue(value)}
        />
        <AtButton type="primary" onClick={handleAddType}>
          确定
        </AtButton>
      </AtFloatLayout>
      <AtModal
        isOpened={trash}
        title="确认删除?"
        cancelText="取消"
        confirmText="确认"
        onClose={() => setTrash(false)}
        onCancel={() => setTrash(false)}
        onConfirm={() => handleDelete(curId)}
      />
      <AtMessage />
    </View>
  );
}
