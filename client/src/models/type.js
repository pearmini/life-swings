import Taro from "@tarojs/taro";
import login from "../utils/login";
import "@tarojs/async-await";
class TypeModel {
  constructor() {
    this.collection = Taro.cloud.database().collection("types");
  }

  async add(name) {
    const { _id } = await this.collection.add({
      data: {
        name
      }
    });
    const _openid = await login();
    return { _id, _openid };
  }

  async delete(id) {
    await this.collection.doc(id).remove();
  }

  async update(name, id) {
    await this.collection.doc(id).update({
      data: {
        name
      }
    });
  }

  async getList(index = 0) {
    const openid = await login();
    const { data } = await this.collection
      .where({
        _openid: openid
      })
      .get();
    return data;
  }
}

export default TypeModel;
