import CryptoJS from 'crypto-js';
import { getUUID } from '@/utils/uuid';
import { getDeviceType } from '@/utils/utils';
import {routes} from '@/config/routes';
import { logger } from "@/utils/logger";
// import useNetwork from "@/hooks/useNetwork";
// 密钥和偏移量
const key = CryptoJS.enc.Utf8.parse('xPxo2S5uGPhKHx5g');
const iv = CryptoJS.enc.Utf8.parse('0a1b2c3d4e5f6789');

/**
 * 加密函数
 * @param {string} data 要加密的数据
 * @returns {string} 加密后的数据（Base64格式）
 */
function encrypt(data) {
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 * 解密函数
 * @param {string} ciphertext 要解密的数据（Base64格式）
 * @returns {string} 解密后的原始数据
 */
export function decrypt(ciphertext) {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  return data;
}
const whiteAPI = ['/api/login', '/api/register', '/api/islogo', '/api/danye', '/api/issms', '/api/sendsms', '/api/captcha','/api/forgot','/api/ipconfig', '/api/v2/login/getCaptchaConfig', '/api/v2/login/checkCaptcha']
export const requestApi = (options) => {
  return new Promise((resolve, reject) => {
    getUUID();
    const appToken = uni.getStorageSync("app_token");
    const deviceUUID = uni.getStorageSync("clientid");
    // if (!appToken && !whiteAPI.includes(options.url)) {
    //   uni.redirectTo({
    //     url: "/pages/base/login", // 登录页面路径
    //   });
    //   reject("没有令牌，请先登录！" + options.url);
    //   return;
    // }
    const deviceType = getDeviceType();
    // 默认参数
    const defaultParams = {
      lange: uni.getLocale(), // 每个请求都需要带上 lange语言 参数
      uuid: deviceUUID, // 每个请求都需要带上 设备唯一识别码：UUID 参数
      deviceType: deviceType, // 每个请求都需要带上 设备类型 参数
    };

    // 将默认参数与传入的参数合并
    const finalData = {
      ...defaultParams,
      ...(options.data || {}),
    };
    let host = "";
    // #ifdef APP-PLUS
    host = uni.getStorageSync("ip_host");
    // #endif
    const header = {  // 默认请求头
      accept: "application/json",
      authorization: "Bearer " + appToken, // 将 app_token 添加到请求头中
      ...(host ? { host } : {}),
    }
    const baseApiUrl = uni.getStorageSync("api_url")
    if (!baseApiUrl && options.url !== "/api/issms") {
      uni.reLaunch({
        url: routes.launch,
      });
      return;
    }
    logger(`请求地址：${baseApiUrl + options.url}开始，请求参数：${JSON.stringify(finalData)}`, "info");
    uni.request({
      url: baseApiUrl + options.url,
      method: options.method || "GET",
      data: finalData,
      responseType: options.responseType,
      header,
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
        if (response.data.t && typeof response.data.t === "string") {
          resolve(decrypt(response.data.t))
        } else {
          resolve(response.data);
        }
        logger(`请求地址：${baseApiUrl + options.url}成功，请求参数：${JSON.stringify(finalData)}，响应数据：${JSON.stringify(response.data)}`, "info");
      },
      fail: (error) => {
        reject(error);
        logger(`请求地址：${baseApiUrl + options.url}失败，请求参数：${JSON.stringify(finalData)}，错误信息：${JSON.stringify(error)}`, "error");
      },
    });
  });
};


