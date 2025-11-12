import {requestApi} from "@/utils/request";

// 获取产品列表
export const getProductlistv2 = (data) => {
  return requestApi({
    url: "/api/v2/product/getList",
    method: "get",
    data,
  });
}

// 购买产品前预检查参数
export const checkCanBuy = (data) => {
  return requestApi({
    url: "/api/v2/product/checkCanBuy",
    method: "POST",
    data,
  });
}
// 获取产品详情
export const getDetails = (data) => {
  return requestApi({
    url: "/api/details",
    method: "POST",
    data,
  });
}
// 获取产品详情V2
export const getDetailsV2 = (data) => {
  return requestApi({
    url: "/api/v2/product/getInfo",
    method: "get",
    data,
  });
}

// 获取产品列表分类
export const getProducts = (data) => {
  return requestApi({
    url: "/api/products",
    method: "POST",
    data,
  });
}

// 认购
export const buyProduct = (data) => {
  return requestApi({
    url: "/api/user/nowToEquity",
    method: "POST",
    data,
  });
}

// 签署合同
export const signContract = (data) => {
  return requestApi({
    url: "/api/v2/product/signContract",
    method: "POST",
    data,
  });
}

// 预览合同
export const previewContract = (data) => {
  return requestApi({
    url: "/api/v2/product/previewContract",
    method: "POST",
    data,
  });
}
