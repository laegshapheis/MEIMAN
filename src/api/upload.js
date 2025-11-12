import { decrypt } from "@/utils/request";
import {routes} from "@/config/routes";
export const uploadFile = (path) => {

  return new Promise((resolve, reject) => {

    const appToken = uni.getStorageSync("app_token");
    const deviceUUID = uni.getStorageSync("clientid");

    if (!appToken) {
      uni.redirectTo({
        url: routes.login, // 登录页面路径
      });

      reject("没有令牌，请先登录！" + options.url);
      return;
    }


    // 默认参数
    const defaultParams = {
      lange: uni.getLocale(), // 每个请求都需要带上 lange语言 参数
      uuid: deviceUUID, // 每个请求都需要带上 设备唯一识别码：UUID 参数
    };
    let host = "";
    // #ifdef APP-PLUS
    host = uni.getStorageSync("ip_host");
    // #endif

    uni.uploadFile({
      url: uni.getStorageSync("api_url") + "/api/user/uplodeimg",
      filePath: path,
      name: "files",
      header: {
        accept: "application/json",
        authorization: "Bearer " + appToken,
        ...(host ? { host } : {}),
      },

      success: (response) => {
        if (response.statusCode == 401) {
          uni.removeStorageSync("app_token");
          console.log("令牌失效！");
          uni.hideLoading();
          uni.$showModal({
            title: "温馨提示",
            content: "登录已过期，请重新登录！",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                uni.redirectTo({
                  url: routes.login, // 登录页面路径
                });
                console.log("回到了登录界面");
              }
            },
          });
          return;
        }

        const data = JSON.parse(response.data);

        if (data.t && typeof data.t === "string") {
          resolve(decrypt(data.t))
        } else {
          resolve(data);
        }
      },
    });
  });
}