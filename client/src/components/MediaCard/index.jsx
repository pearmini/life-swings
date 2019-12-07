import Taro, { useState } from "@tarojs/taro";
import "./index.css";
import { View, Image, Video } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import promisify from "../../utils/promisify";
import "@tarojs/async-await";

export default function({
  type = "image",
  height = 150,
  onUpload: handleUpload,
  src
}) {
  const [path, setPath] = useState(src);
  async function handleChoose(e) {
    try {
      if (type === "image") {
        const chooseImage = promisify(Taro.chooseImage);
        const { tempFilePaths } = await chooseImage({
          count: 1,
          sourceType: ["album", "camera"]
        });
        handleUpload(tempFilePaths[0]);
        setPath(tempFilePaths[0]);
      } else if (type === "video") {
        const chooseVideo = promisify(Taro.chooseVideo);
        const { tempFilePath } = await chooseVideo({
          sourceType: ["album", "camera"],
          camera: "back"
        });
        handleUpload(tempFilePath);
        setPath(tempFilePath);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleDelete() {
    setPath("");
    handleUpload("");
  }
  return (
    <View className="container">
      {path !== "" ? (
        <View className="edit-card">
          {type === "image" ? (
            <Image src={path} mode="aspectFit" />
          ) : (
            <Video src={path} />
          )}
          <AtIcon value="trash" onClick={handleDelete} />
        </View>
      ) : (
        <View
          className="card"
          style={{ height: `${height}px` }}
          onClick={handleChoose}
        >
          <AtIcon value={type} />
        </View>
      )}
    </View>
  );
}
