import { requestApi } from "@/utils/request";

/**
 * 获取砸金蛋页面信息
 * @returns {Promise} 返回用户砸金蛋信息（剩余次数、免费次数等）
 */
export const getGoldenEggInfo = () => {
  return requestApi({
    url: "/api/eggGame/index",
    method: "GET",
  });
};

/**
 * 砸金蛋
 * @param {Object} data - 请求参数
 * @param {number} data.hammer_id - 锤子ID
 * @returns {Promise} 返回中奖信息
 */
export const smashGoldenEgg = (data) => {
  return requestApi({
    url: "/api/eggGame/draw",
    method: "POST",
    data,
  });
};

/**
 * 获取砸金蛋记录
 * @param {Object} data - 请求参数
 * @param {number} data.page - 页码
 * @param {number} data.pagesize - 每页数量
 * @param {string} data.reward_type - 奖品类型（可选）
 * @returns {Promise} 返回中奖记录列表
 */
export const getGoldenEggRecords = (data = {}) => {
  return requestApi({
    url: "/api/eggGame/rewardList",
    method: "GET",
    data,
  });
};

/**
 * 获取砸金蛋奖品类型列表
 * @returns {Promise} 返回奖品类型列表
 */
export const getGoldenEggRewardTypes = () => {
  return requestApi({
    url: "/api/eggGame/getRewardType",
    method: "GET",
  });
};

/**
 * 购买锤子
 * @param {Object} data - 请求参数
 * @param {number} data.hammer_id - 锤子ID
 * @param {number} data.buy_num - 购买数量
 * @param {string} data.pwdPay - 支付密码
 * @returns {Promise} 返回购买结果
 */
export const buyHammerApi = (data) => {
  return requestApi({
    url: "/api/eggGame/buyHammer",
    method: "POST",
    data,
  });
};

/**
 * 获取奖品配置列表
 * @returns {Promise} 返回所有可能的奖品列表
 */
export const getGoldenEggPrizes = (data = {}) => {
  return requestApi({
    url: "/api/golden_egg/prizes",
    method: "POST",
    data,
  });
};

/**
 * 领取奖品
 * @param {Object} data - 请求参数
 * @param {string} data.prizeId - 奖品ID
 * @returns {Promise} 返回领取结果
 */
export const claimGoldenEggPrize = (data) => {
  return requestApi({
    url: "/api/golden_egg/claim",
    method: "POST",
    data,
  });
};

/**
 * 获取今日砸金蛋统计
 * @returns {Promise} 返回今日统计信息（已砸次数、中奖次数等）
 */
export const getGoldenEggTodayStats = (data = {}) => {
  return requestApi({
    url: "/api/golden_egg/today_stats",
    method: "POST",
    data,
  });
};

/**
 * 获取砸金蛋排行榜
 * @param {Object} data - 请求参数
 * @param {string} data.type - 排行榜类型（daily/weekly/monthly）
 * @param {number} data.limit - 获取数量
 * @returns {Promise} 返回排行榜数据
 */
export const getGoldenEggRanking = (data = {}) => {
  return requestApi({
    url: "/api/golden_egg/ranking",
    method: "POST",
    data: {
      type: data.type || 'daily',
      limit: data.limit || 10,
      ...data,
    },
  });
};

/**
 * 分享砸金蛋活动
 * @param {Object} data - 请求参数
 * @returns {Promise} 返回分享奖励信息
 */
export const shareGoldenEgg = (data = {}) => {
  return requestApi({
    url: "/api/golden_egg/share",
    method: "POST",
    data,
  });
};