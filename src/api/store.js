import {requestApi} from "@/utils/request";

// 获取商城列表
export const getShopListApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/shoplist",
    method: "POST",
    data
  });
};

// 获取商城分类
export const getShopCategoryApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/shopcategory",
    method: "POST",
    data
  });
};

// 获取商城详情
export const getShopDetailApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/shopdetail",
    method: "POST",
    data
  });
};

// 获取收藏列表
export const getCollectListApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/collectlist",
    method: "POST",
    data
  });
};
// 添加收藏
export const addCollectApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/addcollect",
    method: "POST",
    data
  });
};

// 删除收藏
export const deleteCollectApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/deletecollect",
    method: "POST",
    data
  });
};

// 添加购物车
export const addCartApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/addcart",
    method: "POST",
    data
  });
};

// 删除购物车
export const deleteCartApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/deletecart",
    method: "POST",
    data
  });
};

// 创建订单
export const createOrderApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/createorder",
    method: "POST",
    data
  });
};

// 获取购物车列表
export const getCartListApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/cartlist",
    method: "POST",
    data
  });
};

// 获取订单列表
export const getOrderListApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/orderlist",
    method: "POST",
    data
  });
};

// 获取会员卡
export const getCardsApi = (data) => {
  return requestApi({
    url: "/api/v2/cards/getcards",
    method: "POST",
    data
  });
};


// 更新订单地址
export const updateOrderAddressApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/updateorderaddress",
    method: "POST",
    data
  });
};


// 确认收货
export const confirmOrderApi = (data) => {
  return requestApi({
    url: "/api/v2/jfshop/confirmorder",
    method: "POST",
    data
  });
};
