import {requestApi} from "@/utils/request";
// 获取邮箱验证码
export const sendEmail = (data) => {
  return requestApi({
    url: "/api/sendEmail",
    method: "POST",
    data
  });
}
// 邮箱验证码验证
export const verifyEmail = (data) => {
  return requestApi({
    url: "/api/verifyEmail",
    method: "POST",
    data
  });
}
// 获取首页数据
export const getIndexData = () => {
  return requestApi({
    url: "/api/index",
    method: "POST",
  });
}

// 登录
export const login = (data) => {
  return requestApi({
    url: "/api/login",
    method: "POST",
    data,
  });
}
// 注册
export const register = (data) => {
  return requestApi({
    url: "/api/register",
    method: "POST",
    data,
  });
}
// 忘记密码
export const forgotPassword = (data) => {
  return requestApi({
    url: "/api/forgot",
    method: "POST",
    data,
  });
}

// 发送短信验证码
export const sendsms = (data) => {
  return requestApi({
    url: "/api/sendsms",
    method: "POST",
    data,
  });
}
// 用户协议/隐私政策
export const getDanye = (data) => {
  return requestApi({
    url: "/api/danye",
    method: "POST",
    data,
  });
}
// 积分商品列表
export const getJifenList = (data) => {
  return requestApi({
    url: "/api/Jifen",
    method: "POST",
    data,
  });
}
// 积分兑换现金
export const jifenexchange = (data) => {
  return requestApi({
    url: "/api/jifenexchange",
    method: "POST",
    data,
  });
}

// 积分兑换盲盒抽奖
export const jifenexchangeLottery = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/exchangeFreeBoxLottery",
    method: "POST",
    data,
  });
}

// 积分兑换配置
export const getMyjifen = (data) => {
  return requestApi({
    url: "/api/myjifen",
    method: "POST",
    data,
  });
}
// 积分兑换
export const exchangeStore = (data) => {
  return requestApi({
    url: "/api/exchange",
    method: "POST",
    data,
  });
}
// 积分兑换记录
export const getExchangelog = (data) => {
  return requestApi({
    url: "/api/exchangelog",
    method: "POST",
    data,
  });
}

// 修改兑换地址
export const updateExchangeAddress = (data) => {
  return requestApi({
    url: "/api/v2/market/updateAddress",
    method: "POST",
    data,
  });
}

export const islogo = () => {
  return requestApi({
    url: "/api/islogo",
    method: "get",
  });
}
// 获取板块详情
export const getCategory = (data) => {
  return requestApi({
    url: "/api/category",
    method: "post",
    data
  });
}
// 获取验证码坐标
export const getCaptchaConfig = () => {
  return requestApi({
    url: "/api/v2/login/getCaptchaConfig",
    method: "get",
  });
}
// 校验验证码
export const checkCaptcha = (data) => {
  return requestApi({
    url: "/api/v2/login/checkCaptcha",
    method: "post",
    data
  });
}

// 获取签到列表
export const getCheckInList = (data) => {
  return requestApi({
    url: "/api/user/qiandaolist",
    method: "POST",
    data
  });
}

// 签到
export const checkIn = (data) => {
  return requestApi({
    url: "/api/user/qiandao",
    method: "POST",
    data
  });
}

// 获取抽奖配置
export const getLotteryConfig = (data) => {
  return requestApi({
    url: "/api/wheel/LotteryPeizhi",
    method: "POST",
    data
  });
}

// 获取中奖名单
export const getLotteryWinList = (data) => {
  return requestApi({
    url: "/api/wheel/winlist",
    method: "POST",
    data
  });
}


// 抽奖
export const startLottery = (data) => {
  return requestApi({
    url: "/api/wheel/click",
    method: "POST",
    data
  });
}

//获取抽奖记录
export const getLotteryLogList = (data) => {
  return requestApi({
    url: "/api/wheel/cjwinlist",
    method: "POST",
    data
  });
}

// 获取学堂列表
export const getGuideList = (data) => {
  return requestApi({
    url: "/api/adlist",
    method: "POST",
    data
  });
}

// 获取页面详情
export const getPageDetails = (data) => {
  return requestApi({
    url: "/api/singlepage",
    method: "POST",
    data
  });
}


// 获取内容详情
export const getNewsDetails = (data) => {
  return requestApi({
    url: "/api/newdetails",
    method: "POST",
    data
  });
}

// 获取资讯列表
export const getNewsList = (data) => {
  return requestApi({
    url: "/api/newlist",
    method: "POST",
    data
  });
}

// 获取资讯列表
export const getAdList = (data) => {
  return requestApi({
    url: "/api/v2/cms/adv/getList",
    method: "GET",
    data
  });
}

// 获取版本更新数据
export const getUpapp = (data) => {
  return requestApi({
    url: "/api/upapp",
    method: "POST",
    data
  });
}

// 获取权限
export const getConfig = () => {
  return requestApi({
    url: "/api/v2/common/getConfig",
    method: "get",
  });
}
// 获取客服地址
export const getIssms = () => {
  return requestApi({
    url: "/api/issms",
    method: "post",
  });
}

// 获取产品严选
export const getProductList = (data) => {
  return requestApi({
    url: "/api/productlist",
    method: "POST",
    data
  });
}

// 获取抽奖记录类型
export const getLotteryRecordTypeList = () => {
  return requestApi({
    url: "/api/wheel/getLotteryRecordTypeList",
    method: "get",
  });
}

// 获取股权说明
export const getDescription = () => {
  return requestApi({
    url: "/api/energy/description",
    method: "get",
  });
}

// 获取积分商品详情
export const getJfproductApi = (data) => {
  return requestApi({
    url: "/api/jfproduct",
    method: "POST",
    data
  });
}


// 获取每日答题配置信息
export const getQuizConfig = () => {
  return requestApi({
    url: "/api/v2/questions/config",
    method: "GET",
  });
}

// 获取每日答题题目列表
export const getQuizQuestions = () => {
  return requestApi({
    url: "/api/v2/questions/list",
    method: "GET",
  });
}

// 提交每日答题答案
export const submitQuizAnswers = (data) => {
  return requestApi({
    url: "/api/v2/questions/submit",
    method: "POST",
    data
  });
}

// 获取奖励记录
export const getRewardRecords = (params) => {
  return requestApi({
    url: "/api/v2/questions/quiz",
    method: "GET",
    params
  });
}