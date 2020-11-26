// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const db = cloud.database({
  env: "life-swings-vo1u2",
});

async function get(openid) {
  const { data } = await db
    .collection("users")
    .where({
      _openid: openid,
    })
    .get();

  return data[0];
}

async function create(openid) {
  const user = {
    _openid: openid,
    scores: [],
  };
  const { _id } = await db.collection("users").add({ data: user });
  return { ...user, _id };
}

// 云函数入口函数
exports.main = async () => {
  const { OPENID } = cloud.getWXContext();
  let userInfo = await get(OPENID);
  userInfo = userInfo ? userInfo : await create(OPENID);
  return userInfo;
};
