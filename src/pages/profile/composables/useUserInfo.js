import { ref } from "vue";
import { getUserInfoIndex as getUserInfoIndexApi } from "@/api/user";
import { getConfig } from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";
import { requestApi } from "@/utils/request";

/**
 * 用户信息相关的组合式API
 * 处理用户信息获取、缓存和状态管理
 */
export const useUserInfo = () => {
  // 状态定义
  const userInfo = ref({});
  const showData = ref(false); // 显示数据开关
  const currentRate = ref(1); // 当前汇率
  const isequity = ref(0); // 是否股权
  const appNewVersion = ref(false); // app新版本状态
  const boxesSwitch = ref(0); // 盲盒功能开关
  const loading = ref(false);
  const loadingText = ref("");
  const fucardSwitch = ref(0); // 集卡功能开关

  /**
   * 获取盲盒信息
   * @returns {Promise}
   */
  const getBoxesInfo = async () => {
    try {
      const result = await requestApi({
        url: "/api/v2/boxes/boxeslist",
        method: "POST"
      });
      return result;
    } catch (e) {
      console.error("获取盲盒信息失败", e);
      return { boxes_switch: 0 };
    }
  };

  /**
   * 获取配置信息
   * @returns {Promise}
   */
  const getConfigInfo = async () => {
    try {
      const result = await getConfig();
      return result.data || {};
    } catch (e) {
      console.error("获取配置信息失败", e);
      return {};
    }
  };

  /**
   * 处理用户信息缓存
   * @param {Object} result - 用户信息数据
   */
  const handleCache = (result) => {
    if (result.status && result.status != 0) {
      loading.value = false;
      return;
    }
    
    userInfo.value = result;
    uni.setStorageSync("mobile", result.mobile);
    showData.value = result.show_amount_switch == 1 ? true : false;
    currentRate.value = result.CNYUSD;
    isequity.value = result.isequity;
    fucardSwitch.value = result.fucard_switch;
    // 新版本判断
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
      if (widgetInfo.version != result.app_new_version) {
        appNewVersion.value = true;
        if (result.forceUpdate) {
          // 强制更新处理
          uni.navigateTo({ url: routes.upApp });
        }
      } else {
        appNewVersion.value = false;
      }
    });
    // #endif

    loading.value = false;
    
    // 处理未签名合同提示
    if (result.buy_no_sign_count > 0) {
      uni.$showModal({
        content: "您有合同未签名！请及时处理",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            navigateTo(routes.invest);
          }
        },
      });
      return;
    }
    
    // 处理贷款未签名合同提示
    if (result.daikuan_no_sign_count > 0) {
      uni.$showModal({
        content: "您有合同未签名！请及时处理",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            navigateTo(routes.daiKuanJiLu);
          }
        },
      });
      return;
    }
  };

  /**
   * 获取用户信息
   * @param {Boolean} showLoading - 是否显示加载中
   * @returns {Promise}
   */
  const getUserInfoIndex = async (showLoading = true) => {
    if (showLoading) {
      loading.value = true;
      loadingText.value = "加载中...";
    }

    try {
      // 并行获取用户信息、盲盒信息和配置信息
      const [userResult, boxesResult, configResult] = await Promise.all([
        getUserInfoIndexApi(),
        getBoxesInfo(),
        getConfigInfo()
      ]);
      
      console.log("userResult", userResult);
      console.log("boxesResult", boxesResult);
      console.log("configResult", configResult);
      
      // 将盲盒开关状态添加到用户信息中
      userResult.boxes_switch = boxesResult.boxes_switch || 0;
      boxesSwitch.value = boxesResult.boxes_switch || 0;
      
      // 将配置信息中的开关字段添加到用户信息中
      if (configResult.lottery_switch !== undefined) {
        userResult.lottery_switch = configResult.lottery_switch;
      }
      if (configResult.task_module_switch !== undefined) {
        userResult.task_module_switch = configResult.task_module_switch;
      }
      
      cacheManager.setCache("userInfo", userResult);
      handleCache(userResult);
      return userResult;
    } catch (e) {
      loading.value = false;
      console.error("获取用户信息失败", e);
    }
  };

  return {
    userInfo,
    showData,
    currentRate,
    isequity,
    appNewVersion,
    boxesSwitch,
    fucardSwitch,
    loading,
    loadingText,
    getUserInfoIndex,
    handleCache
  };
}; 