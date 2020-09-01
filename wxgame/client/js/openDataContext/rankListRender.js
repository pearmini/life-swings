class RankListRender {
  constructor() {
    this.sharedCanvas = wx.getSharedCanvas();
    this.context = this.sharedCanvas.getContext("2d");
    this.data = [];
    this.pageCount = 8;
    this.imageByOpenid = {};
    this.isLoadImage = false;
  }

  init(payload) {
    const { width, height } = payload;
    this.width = width;
    this.height = height;
    this.renderData();
  }

  renderData() {
    wx.getFriendCloudStorage({
      keyList: ["sum"],
      success: (res) => {
        const loadImage = (d) => {
          const img = wx.createImage();
          img.src = d.avatarUrl;
          this.imageByOpenid[d.openid] = img;
          img.onload = () => {};
        };
        this.data = res.data;
        this.pageIndex = 0;
        this.data.sort((a, b) => {
          const sum = (d) => d.KVDataList[0].value.split("+")[0];
          return sum(b) - sum(a);
        });

        // 先将图片获取一次
        if (!this.isLoadImage) {
          this.data.forEach(loadImage);
          this.isLoadImage = true;
          this.totalCount = Math.ceil(this.data.length / this.pageCount);
          setTimeout(() => {
            this.render();
          }, 1000);
        } else {
          // 只渲染有图片的用户
          this.data = this.data.filter((d) => this.imageByOpenid[d.openid]);
          this.totalCount = Math.ceil(this.data.length / this.pageCount);
          this.render();

          // 没有图片的用户延迟渲染
          const newData = this.data.filter(
            (d) => this.imageByOpenid[d.openid] === undefined
          );
          newData.forEach(loadImage);
          if (newData.length) {
            setTimeout(() => {
              this.render();
            }, 1000);
          }
        }
      },
    });
  }

  render = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    const data = this.data.slice(
      this.pageIndex * this.pageCount,
      (this.pageIndex + 1) * this.pageCount
    );
    const cardWidth = this.width * 0.8,
      cardHeight = this.height * 0.6;
    const padding = 20;
    const margin = 40;
    const translateX = (this.width - cardWidth) / 2;
    const translateY = (this.height - cardHeight) / 2;
    const gridHeight = (cardHeight - padding * 2 - margin) / this.pageCount;
    const girdWidth = (cardWidth - padding * 2) / 5;
    const gridPadding = gridHeight * 0.1;

    // 绘制提示信息
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.font = "normal 22px sans-serif";
    this.context.fillStyle = "#b1b2b3";
    this.context.fillText(
      "通关数",
      translateX + girdWidth * 3 + girdWidth / 2 + padding,
      translateY + margin
    );
    this.context.fillText(
      "创造生命数",
      translateX + girdWidth * 4 + girdWidth / 2 + padding,
      translateY + margin
    );

    data.forEach((d, index) => {
      const scores = d.KVDataList[0].value.split("+");

      // 设置
      this.context.textBaseline = "middle";
      this.context.textAlign = "center";
      this.context.font = "normal 35px sans-serif";
      this.context.fillStyle = "white";

      // 排行
      this.context.fillText(
        index + 1 + this.pageIndex * this.pageCount,
        translateX + girdWidth / 2 + padding,
        translateY + index * gridHeight + gridHeight / 2 + margin
      );

      // 头像
      const img = this.imageByOpenid[d.openid];
      this.context.drawImage(
        img,
        translateX + girdWidth + padding,
        translateY + index * gridHeight + gridPadding + margin,
        gridHeight - gridPadding * 2,
        gridHeight - gridPadding * 2
      );

      // 名字
      this.context.fillText(
        d.nickname,
        translateX + girdWidth * 2 + girdWidth / 2 + padding,
        translateY + index * gridHeight + gridHeight / 2 + margin
      );

      // 通过关卡的数量
      this.context.fillText(
        scores[0],
        translateX + girdWidth * 3 + girdWidth / 2 + padding,
        translateY + index * gridHeight + gridHeight / 2 + margin
      );

      // 创造的生命数量
      this.context.fillText(
        scores[1],
        translateX + girdWidth * 4 + girdWidth / 2 + padding,
        translateY + index * gridHeight + gridHeight / 2 + margin
      );
    });
  };

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
      } else if (type === "refresh") {
        this.renderData();
      }
    });
  }
}

export default new RankListRender();
