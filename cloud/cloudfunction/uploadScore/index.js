// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database({
  env: "life-swings-vo1u2",
});

// 云函数入口函数
exports.main = async (event) => {
  const { scores } = event;
  const { OPENID } = cloud.getWXContext();
  await db.collection("users").where({ _openid: OPENID }).update({
    data: {
      scores,
    },
  });
};
