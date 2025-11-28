import {requestApi} from "@/utils/request";

// 用户个人中心资料
export const getUserInfoIndex = (data) => {
  return requestApi({
    url: "/api/user/index",
    method: "GET",
    data,
  });
}

// 获取购卡记录
export const getVipCardOrderList = (data) => {
  return requestApi({
    url: "/api/v2/cards/getOrderList",
    method: "get",
    data,
  });
}
// 投资合同
export const getContractInfo = (id) => {
  return requestApi({
    url: `/api/v2/product/getContractInfo?contract_no=${id}`,
    method: "GET",
  });
}
// 下载合同
export const downloadContract = (id) => {
  return requestApi({
    url: `/api/v2/product/downloadContract?contract_no=${id}`,
    method: "GET",
    responseType: "arraybuffer",
  });
}

// 用户个人中心资料
export const getUserInfo = (data) => {
  return requestApi({
    url: "/api/user/info",
    method: "POST",
    data,
  });
}

// 获取账户详情
export const getMyAccountInfo = (data) => {
  return requestApi({
    url: "/api/user/my",
    method: "POST",
    data,
  });
}
// 解除投资合同
export const jiechuinvest = (data) => {
  return requestApi({
    url: "/api/user/jiechuinvest",
    method: "POST",
    data,
  });
}

// 用户等级
export const getUserLevel = (data) => {
  return requestApi({
    url: "/api/memberlevel",
    method: "POST",
    data,
  });
}

// 获取充值方式
export const getRecharge = (data) => {
  return requestApi({
    url: "/api/user/recharge",
    method: "POST",
    data,
  });
}

// 获取充值列表
export const getRechargeLog = (data) => {
  return requestApi({
    url: "/api/user/recharges",
    method: "POST",
    data,
  });
}

// 获取usdt钱包信息
export const getUsdtInfo = (data) => {
  return requestApi({
    url: "/api/user/getusdtinfo",
    method: "POST",
    data,
  });
}

//提交充值
export const submitRecharge = (data) => {
  return requestApi({
    url: "/api/user/rechargesave",
    method: "POST",
    data,
  });
}

// 转账
export const transfer = (data) => {
  return requestApi({
    url: "/api/user/zhuan",
    method: "POST",
    data,
  });
}

// 转账记录
export const getTransferList = (data) => {
  return requestApi({
    url: "/api/user/withdraws",
    method: "POST",
    data,
  });
}

// 获取提现方式数据
export const getWithdraw = (data) => {
  return requestApi({
    url: "/api/user/withdrawshow",
    method: "POST",
    data,
  });
}

// 申请提现
export const submitWithdraw = (data) => {
  return requestApi({
    url: "/api/user/withdraw",
    method: "POST",
    data,
  });
}

// 更新支付宝账号
export const updateAlipay = (data) => {
  return requestApi({
    url: "/api/user/alipay",
    method: "POST",
    data,
  });
}

// 更新银行账号
export const updateBank = (data) => {
  return requestApi({
    url: "/api/user/bank",
    method: "POST",
    data,
  });
}

// 更新usdt账号
export const updateUsdt = (data) => {
  return requestApi({
    url: "/api/user/usdtsave",
    method: "POST",
    data,
  });
}

// 获取余额宝信息
export const getYuebaoInfo = (data) => {
  return requestApi({
    url: "/api/user/duodeli",
    method: "POST",
    data,
  });
}

// 获取余额宝日志
export const getYuebaoLog = (data) => {
  return requestApi({
    url: "/api/user/shouyi",
    method: "POST",
    data,
  });
}

// 获取明细
export const getLogList = (data) => {
  return requestApi({
    url: "/api/user/shouyi",
    method: "POST",
    data,
  });
}

// 余额宝转出
export const transferYuebaoOut = (data) => {
  return requestApi({
    url: "/api/user/duodeli_chu",
    method: "POST",
    data,
  });
}

// 余额宝转入
export const transferYuebaoIn = (data) => {
  return requestApi({
    url: "/api/user/duodeli_ri",
    method: "POST",
    data,
  });
}

// 获取推广信息
export const getPromotionInfo = (data) => {
  return requestApi({
    url: "/api/user/tuijian",
    method: "POST",
    data,
  });
}

// 获取推广列表
export const getPromotionList = (data) => {
  return requestApi({
    url: "/api/user/nextshow",
    method: "POST",
    data,
  });
}

// 获取代金券列表
export const getCouponList = (data) => {
  return requestApi({
    url: "/api/user/couponlogs",
    method: "POST",
    data,
  });
}

// 获取地址列表
export const getAddressList = (data) => {
  return requestApi({
    url: "/api/address/getList",
    method: "POST",
    data,
  });
}

// 删除地址
export const deleteAddress = (data) => {
  return requestApi({
    url: "/api/address/delete",
    method: "POST",
    data,
  });
}

// 设置默认地址
export const setDefaultAddress = (data) => {
  return requestApi({
    url: "/api/address/setDefault",
    method: "POST",
    data,
  });
}

// 添加地址
export const createAddress = (data) => {
  return requestApi({
    url: "/api/address/create",
    method: "POST",
    data,
  });
}
// 编辑地址
export const updateAddress = (data) => {
  return requestApi({
    url: "/api/address/update",
    method: "POST",
    data,
  });
}
// 会员信息
export const getMemberlevel = (data) => {
  return requestApi({
    url: "/api/memberlevel",
    method: "POST",
    data,
  });
}

// 购买会员卡
export const purchaseVipCard = (data) => {
  return requestApi({
    url: "/api/v2/cards/buycards",
    method: "POST",
    data,
  });
}
// 获取会员卡列表
export const getVipCardList = (data) => {
  return requestApi({
    url: "/api/v2/cards/cardlist",
    method: "POST",
    data,
  });
}
// 团队会员信息
export const getMemberteams = (data) => {
  return requestApi({
    url: "/api/memberteams",
    method: "POST",
    data,
  });
}
// 获取默认地址
export const getDefaultAddress = (data) => {
  return requestApi({
    url: "/api/address/getDefault",
    method: "POST",
    data,
  });
}
// 获取用户认证信息
export const certification = (data) => {
  return requestApi({
    url: "/api/user/certification",
    method: "POST",
    data,
  });
}
// 实名认证
export const editCertification = (data) => {
  return requestApi({
    url: "/api/user/edit",
    method: "POST",
    data,
  });
}
// 实名认证修改
export const savepicCertification = (data) => {
  return requestApi({
    url: "/api/user/savepic",
    method: "POST",
    data,
  });
}
// 实名认证修改v2
export const savepicCertificationV2 = (data) => {
  return requestApi({
    url: "/api/user/savepicv2",
    method: "POST",
    data,
  });
}
// 更新密码
export const updatePassword = (data) => {
  return requestApi({
    url: "/api/user/password",
    method: "POST",
    data,
  });
}
// 获取密钥
export const getmiyao = (data) => {
  return requestApi({
    url: "/api/getmiyao",
    method: "POST",
    data,
  });
}
// 设置/修改支付密码
export const updatePaypwd = (data) => {
  return requestApi({
    url: "/api/user/paypwd",
    method: "POST",
    data,
  });
}
// 验证老密码
export const verifypws = (data) => {
  return requestApi({
    url: "/api/user/verifypws",
    method: "POST",
    data,
  });
}
// 设置密钥
export const setmiyao = (data) => {
  return requestApi({
    url: "/api/setmiyao",
    method: "POST",
    data,
  });
}
// 发起拼团
export const groupbuy = (data) => {
  return requestApi({
    url: "/api/user/groupbuy",
    method: "POST",
    data,
  });
}
// 参加拼团
export const joingroup = (data) => {
  return requestApi({
    url: "/api/user/joingroup",
    method: "POST",
    data,
  });
}

// 普通投资
export const nowToMoney = (data) => {
  return requestApi({
    url: "/api/user/nowToMoney",
    method: "POST",
    data,
  });
}

// 余额宝计算
export const yuebaoCalc = (data) => {
  return requestApi({
    url: `/api/v2/yuebao/calc?amount=${data.amount}&rate=${data.rate}&days=${data.days}`,
    method: "get",
  });
}

// 获取代款信息
export const getDaikuanInfo = (data) => {
  return requestApi({
    url: "/api/user/getdaikuan",
    method: "POST",
    data,
  });
}

// 获取代款合同信息
export const getDaikuanContractInfo = (data) => {
  return requestApi({
    url: `/api/v2/daikuan/getContractInfo?contract_no=${data.contract_no}`,
    method: "get",
  });
}
// 代款合同补签
export const signContract = (data) => {
  return requestApi({
    url: "/api/v2/daikuan/signContract",
    method: "POST",
    data,
  });
}

// 提前还款
export const forwarhuankuan = (data) => {
  return requestApi({
    url: "/api/user/forwarhuankuan",
    method: "POST",
    data,
  });
}
 
// 获取账户明细
export const getAccountDetailList = (data) => {
  return requestApi({
    url: "/api/v2/member/getAccountDetailList",
    method: "get",
    data,
  });
}

// 股权质押
export const nowToShiFang = (data) => {
  return requestApi({
    url: '/api/user/nowToShiFang',
    method: 'POST',
    data
  });
};

// 获取股权信息
export const getEquityInfo = (data) => {
  return requestApi({
    url: '/api/user/equity',
    method: 'POST',
    data
  });
};

// 获取交易列表
export const getTradeList = (data) => {
  return requestApi({
    url: '/api/user/guquanlist',
    method: 'POST',
    data
  });
};

// 获取交易信息
export const getTradeInfo = (data) => {
  return requestApi({
    url: '/api/user/getequityinfo',
    method: 'POST',
    data
  });
};

// 提交交易
export const submitTrade = (data) => {
  return requestApi({
    url: '/api/user/equityjiaoyi',
    method: 'POST',
    data
  });
};

// 获取app下载列表
export const getAppDownloadList = (data) => {
  return requestApi({
    url: '/api/user/getAppDownloadList',
    method: 'POST',
    data
  });
};

// 获取团购列表
export const getGroupList = (data) => {
  return requestApi({
    url: '/api/user/grouplist',
    method: 'POST',
    data
  });
};

// 获取参与的团购列表
export const getJoinGroupList = (data) => {
  return requestApi({
    url: '/api/user/joingrouplist',
    method: 'POST',
    data
  });
};
// 更新微信支付
export const updateWechat = (data) => {
  return requestApi({
    url: '/api/user/weixin',
    method: 'POST',
    data
  });
};

// 获取合约列表
export const getContractListApi = (data) => {
  return requestApi({
    url: "/api/user/guquanlist",
    method: "POST",
    data,
  });
}

// 赎回合约
export const redeemContractApi = (data) => {
  return requestApi({
    url: "/api/user/jiechuEquity",
    method: "POST",
    data,
  });
}

// 检查合约赎回条件
export const checkContractRedeemApi = () => {
  return requestApi({
    url: "/api/user/contract/check",
    method: "POST"
  });
}

export const contractShowApi = (data) => {
  return requestApi({
    url: "/api/user/show",
    method: "POST",
    data
  });
}

// 获取交易信息
export const getTradeInfoApi = (data) => {
  return requestApi({
    url: '/api/user/jiaoyiinfo',
    method: 'POST',
    data
  });
};

// 提交交易
export const submitTradeApi = (data) => {
  return requestApi({
    url: '/api/user/submit_jiao_yi',
    method: 'POST',
    data
  });
};

// 取消交易
export const cancelTradeApi = (data) => {
  return requestApi({
    url: '/api/user/equitysave',
    method: 'POST',
    data
  });
};
// 获取我的推广链接
export const getMyLink = (data) => {
  console.log("data", data);
  return requestApi({
    url: '/api/user/mylink?type=' + data.type,
    method: 'get',
  });
};

// 股权
export const equitySaveApi = (data) => {
  return requestApi({
    url: '/api/user/equitysave',
    method: 'POST',
    data
  });
};

// 预览合约
export const previewContractApi = (data) => {
  return requestApi({
    url: '/api/v2/equity/previewContract?number=' + data.number,
    method: 'get',
  });
};

// 获取合约信息
export const getContractInfoApi = (id) => {
  return requestApi({
    url: `/api/v2/equity/getContractInfo?contract_no=${id}`,
    method: 'GET',
  });
};

// 下载合约
export const downloadContractApi = (data) => {
  return requestApi({
    url: '/api/v2/equity/downloadContract?contract_no=' + data.contract_no,
    method: 'get',
    responseType : 'arraybuffer',
  });
};

// 获取代款合同信息
export const getDaikuanContractInfoApi = (data) => {
  return requestApi({
    url: '/api/v2/daikuan/getContractInfo?contract_no=' + data.contract_no,
    method: 'get',
  });
};

// 预览代款合同
export const previewDaikuanContractApi = (data) => {
  return requestApi({
    url: '/api/v2/daikuan/previewContract',
    method: 'POST',
    data
  });
};

// 预览代款合同
export const transferCoupon = (data) => {
  return requestApi({
    url: '/api/v2/coupon/transfer',
    method: 'POST',
    data
  });
};

// 下载合约 url
export const downloadContractApi2 = (data) => {
  return requestApi({
    url: '/api/v2/equity/downloadContract?contract_no=' + data.contract_no,
    method: 'get',
  });
};

// 获取任务奖励数据
export const getSpecializedTask = (data) => {
  return requestApi({
    url: '/api/v2/specializedTask/index',
    method: 'GET',
    data
  });
};

// 获取推广等级数据
export const getPromotionLevel = (data) => {
  return requestApi({
    url: '/api/v2/promotionLevel/index',
    method: 'GET',
    data
  });
};

// 下载合约 url
export const downloadContractProductApi = (data) => {
  return requestApi({
    url: '/api/v2/product/downloadContract?contract_no=' + data.contract_no,
    method: 'get',
  });
};