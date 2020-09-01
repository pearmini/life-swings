// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database({
  env: "life-swings-vo1u2",
});

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  return db
    .collection("lives")
    .where({
      _openid: OPENID,
    })
    .get();
};
