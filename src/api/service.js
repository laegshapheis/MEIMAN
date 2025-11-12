import {requestApi} from "@/utils/request";
export function getAbroad() {
  uni.request({
    url: "https://pro.ip-api.com/json/",
    method: "GET",
    data: {
      lang: "zh-CN",
      key: uni.getStorageSync("ipkey"),
      fields: 122908,
    },
    success: (res) => {
      if (res.data.status == "success") {
        uni.setStorageSync("clientIP", res.data.query);
        uni.setStorageSync("appIpInfo", res.data);
        console.log("获取客户IP成功：" + uni.getStorageSync("clientIP"));
        console.log("IP信息：", uni.getStorageSync("appIpInfo"));
      } else {
        uni.setStorageSync("clientIP", "");
      }
    },
    fail: (err) => {
      uni.setStorageSync("clientIP", "");
    },
    complete: (com) => { },
  });
}
export function gteDomestic() {
  uni.request({
    url: "https://api.ip138.com/ip/",
    method: "GET",
    data: {
      ip: "",
      token: uni.getStorageSync("ipkey"),
      oid: 83479,
      mid: 138897,
    },
    success: (res) => {
      if (res.data.ret === "ok") {
        uni.setStorageSync("clientIP", res.data.ip);
        uni.setStorageSync("appIpInfo", res.data.data);
        console.log("获取客户IP成功：" + uni.getStorageSync("clientIP"));
        console.log("IP信息：", uni.getStorageSync("appIpInfo"));
      } else {
      }
    },
    fail: (err) => { },
    complete: (com) => { },
  });
}
export const getUserIP = () => {
  uni.getStorageSync("ipswitch") + "" === "1" ? gteDomestic() : getAbroad();
};
export function getIpconfig() {
  requestApi({
    url: "/api/ipconfig",
    method: "GET",
    data: {},
  }).then(res => {
    uni.setStorageSync("ipswitch", res.switch);
    uni.setStorageSync("ipkey", res.key);
  })
}