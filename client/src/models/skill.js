import Taro from "@tarojs/taro";
import login from "../utils/login";
import promisify from "../utils/promisify";
import "@tarojs/async-await";
class SkillsModel {
  constructor() {
    this.collection = Taro.cloud.database().collection("skills");
  }

  async getList(options, index = 0) {
    const openid = await login();
    const { data } = await this.collection
      .where({
        _openid: openid,
        ...options
      })
      .get();

    const imageFileIdList = data.map(item => item.imageFileId);
    const videoFileIdList = data.map(item => item.videoFileId);
    const images = await this._getTempFileURL(imageFileIdList);
    const videos = await this._getTempFileURL(videoFileIdList);
    const skills = data.map((item, index) => ({
      ...item,
      imagePath: images[index].tempFileURL,
      videoPath: videos[index].tempFileURL
    }));

    return skills;
  }

  async add(typeid, skill) {
    const _openid = await login();
    const { imagePath, videoPath, ...rest } = skill;
    const createTime = new Date();

    // 添加到数据库
    const { _id } = await this.collection.add({
      data: {
        ...rest,
        typeid,
        createTime
      }
    });

    // 存储
    let imageFileId = "",
      videoFileId = "";
    if (imagePath) {
      imageFileId = await this._uploadFile(imagePath, _openid, typeid, _id);
    }

    if (videoPath) {
      videoFileId = await this._uploadFile(videoPath, _openid, typeid, _id);
    }

    // 更新 fileId
    await this.collection.doc(_id).update({
      data: {
        imageFileId,
        videoFileId
      }
    });

    return { _id, _openid, imageFileId, videoFileId };
  }

  async _uploadFile(src, openid, typeid, name) {
    const uploadFile = promisify(Taro.cloud.uploadFile);
    const suffix = src.substring(src.lastIndexOf("."));
    const { fileID } = await uploadFile({
      cloudPath: `${openid}/${typeid}/${name}/index${suffix}`, // 上传至云端的路径
      filePath: src // 小程序临时文件路径
    });
    return fileID;
  }

  async _deleteFile(fileIds) {
    const deleteFile = promisify(Taro.cloud.deleteFile);
    const fileList = fileIds.filter(item => item !== "" && item !== undefined);
    await deleteFile({ fileList });
  }

  async _getTempFileURL(fileList) {
    const getTempFileURL = promisify(Taro.cloud.getTempFileURL);
    const res = await getTempFileURL({
      fileList
    });
    return res.fileList;
  }

  async delete(skill) {
    const { _id, imageFileId, videoFileId } = skill;

    // 删除媒体文件
    await this._deleteFile([imageFileId, videoFileId]);

    // 删除数据
    await this.collection.doc(_id).remove();
  }

  async changeStatus(item) {
    const { _id, done } = item;
    return await this.collection.doc(_id).update({
      data: {
        done: !done
      }
    });
  }
  async update(skill, keys) {
    const data = {};
    let isImageChange = false,
      isVideoChange = false;
    keys.forEach(key => {
      if (key === "imagePath") {
        isImageChange = true;
        return;
      }

      if (key === "videoPath") {
        isVideoChange = true;
        return;
      }

      data[key] = skill[key];
    });

    // 添加新的媒体文件
    const openid = await login();
    const deleteFileIds = [];
    const {
      imagePath,
      videoPath,
      typeid,
      _id,
      imageFileId,
      videoFileId
    } = skill;

    if (isImageChange) {
      // 说明删除了图片
      if (imagePath === "" && imageFileId !== "") {
        deleteFileIds.push(imageFileId);
        data.imageFileId = "";
      } else {
        const imageFileId = await this._uploadFile(
          imagePath,
          openid,
          typeid,
          _id
        );
        data.imageFileId = imageFileId;
      }
    }

    if (isVideoChange) {
      // 说明删除了视频
      if (videoPath === "" && videoFileId !== "") {
        deleteFileIds.push(videofileId);
        data.videoFileId = "";
      } else {
        const videoFileId = await this._uploadFile(
          videoPath,
          openid,
          typeid,
          _id
        );
        data.videoFileId = videoFileId;
      }
    }

    // 删除媒体文件
    await this._deleteFile(deleteFileIds);

    await this.collection.doc(_id).update({
      data
    });

    return { ...skill, ...data };
  }

}

export default SkillsModel;
