class RankListRender {
  constructor() {
    this.sharedCanvas = wx.getSharedCanvas();
    this.context = this.sharedCanvas.getContext("2d");
    this.data = [];
    this.pageCount = 8;
  }

  init(payload) {
    const { width, height } = payload;
    this.width = width;
    this.height = height;
    wx.getFriendCloudStorage({
      keyList: ["sum"],
      success: (res) => {
        this.data = res.data;
        this.pageIndex = 0;
        this.totalCount = Math.ceil(this.data.length / this.pageCount);
        this.data.sort((a, b) => {
          const sum = (d) => d.split("+")[0];
          return sum(a) - sum(b);
        });
        this.render();
      },
    });
  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);
    const data = this.data.slice(this.pageIndex, this.pageCount);
    const cardWidth = this.width * 0.8,
      cardHeight = this.height * 0.6;
    const padding = 30;
    const translateX = (this.width - cardWidth) / 2;
    const translateY = (this.height - cardHeight) / 2;
    const lineHeight = (cardHeight - padding * 2) / this.pageCount;
    const linePadding = lineHeight * 0.1;

    data.forEach((d, index) => {
      const imgOffset = 80,
        nameOffset = 30,
        sumOffset = 50,
        countOffset = 80;
      const scores = d.KVDataList[0].value.split("+");

      // 设置
      this.context.textBaseline = "middle";

      // 排行
      this.context.font = "normal 60px sans-serif";
      this.context.fillStyle = "white";
      this.context.fillText(
        index + 1,
        translateX,
        translateY + (index * lineHeight) / 2
      );

      // 头像
      const img = wx.createImage();
      img.src = d.avatarUrl;
      img.onload = () =>
        this.context.drawImage(
          img,
          translateX + imgOffset,
          translateY + index * lineHeight,
          lineHeight,
          lineHeight
        );

      // 名字
      this.context.fillText(
        d.nickname,
        translateX + nameOffset,
        translateY + index * lineHeight
      );

      // 通过关卡的数量
      this.context.fillText(
        scores[0],
        translateX + sumOffset,
        translateY + index * lineHeight
      );

      // 创造的生命数量
      this.context.fillText(
        scores[1],
        translateX + countOffset,
        translateY + index * lineHeight
      );
    });
  }

  next() {
    if (this.pageIndex < this.totalCount - 1) {
      this.pageIndex++;
      this.render();
    }
  }

  pre() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.render();
    }
  }

  listen() {
    wx.onMessage(({ type, payload }) => {
      if (type === "init") {
        this.init(payload);
      } else if (type === "next") {
        this.next();
      } else if (type === "pre") {
        this.pre();
      }
    });
  }
}

export default new RankListRender();
