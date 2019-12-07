import { View, Textarea } from "@tarojs/components";
import { AtIcon } from "taro-ui";
export default function({
  value,
  onChange: handleChange,
  placeholder,
  height = 150
}) {
  return (
    <View className="container card" style={{ height: `${height}px` }}>
      <Textarea
        value={value}
        onInput={e => handleChange(e.target.value)}
        placeholder={placeholder}
        maxlength={-1}
        auto-height={true}
      />
      <View>
        <AtIcon value="trash" size="20" onClick={() => handleChange("")} />
      </View>
    </View>
  );
}
