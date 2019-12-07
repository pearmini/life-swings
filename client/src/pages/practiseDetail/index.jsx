import { View } from "@tarojs/components";
import MyTextarea from "../../components/MyTextarea/index";
import MediaCard from "../../components/MediaCard/index";
import { useState } from "@tarojs/taro";
export default function() {
  const [log, setLog] = useState({
    imagePath: "",
    videoPath: "",
    content: ""
  });
  function handleContentChange() {}
  function handleImageChange() {}
  function handleVideoChange() {}
  return (
    <View className="container">
      <MyTextarea
        value={log.content}
        onChange={handleContentChange}
        placeholder="和该技能有关的东西..."
      />
      <View className="media">
        <MediaCard
          type="image"
          src={log.imagePath}
          onUpload={handleImageChange}
        />
        <MediaCard
          type="video"
          src={log.videoPath}
          onUpload={handleVideoChange}
        />
      </View>
    </View>
  );
}
