import { View, Input } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.css";
import { useState } from "@tarojs/taro";
export default function({
  name,
  onDelete: handleDelete,
  editable,
  onEdit: handleEdit,
  onSave: handleSave,
  onSkill: handleSkill
}) {
  const [value, setValue] = useState(name);
  return (
    <View className="container card">
      {editable ? (
        <Input
          value={value}
          type="text"
          className={"left"}
          onInput={e => {
            setValue(e.target.value);
          }}
        />
      ) : (
        <View className={"left"}>{name}</View>
      )}
      <View className="right">
        <AtIcon
          value={editable ? "check-circle" : "edit"}
          size="20"
          onClick={() => (editable ? handleSave(value) : handleEdit())}
        ></AtIcon>
        <AtIcon value="trash" size="20" onClick={() => handleDelete()}></AtIcon>
        <AtIcon value="eye" size="20" onClick={() => handleSkill()}></AtIcon>
      </View>
    </View>
  );
}
