// 获取设备uuid
// #ifdef APP-PLUS
import {obtainDeviceId} from '@/uni_modules/hl-deviceId-v2';
// #endif

export const getUUID = () => {
  let platform = uni.getSystemInfoSync().platform; //设备类型
  // #ifdef APP-PLUS
  try {
    if (platform === "android") {
      obtainDeviceId({
      success: function(res) {
        console.log(res, 'res')
        uni.setStorageSync("clientid", res.data.AndroidID);
      }
    })
    } else if (platform === "ios") {
      uni.setStorageSync("clientid", uni.getDeviceInfo().deviceId);
    }
  } catch (error) {
    uni.setStorageSync("clientid", uni.getDeviceInfo().deviceId);
    console.log(error, 'error')
  }
  // #endif

  // #ifdef H5
  uni.setStorageSync("clientid", uni.getDeviceInfo().deviceId);
  // #endif
};