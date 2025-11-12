import {requestApi} from "@/utils/request";

// 获取投资列表
export const getList = (data) => {
  return requestApi({
    url: "/api/user/tender",
    method: "POST",
    data,
  });
}

//解除投资合同
export const cancel = (data) => {
  return requestApi({
    url: "/api/user/jiechuinvest",
    method: "POST",
    data,
  });
}

// 下载合同
export const download = (data) => {
  return requestApi({
    url: "/api/v2/product/downloadContract",
    method: "GET",
    responseType : 'arraybuffer',
    data,
  });
}