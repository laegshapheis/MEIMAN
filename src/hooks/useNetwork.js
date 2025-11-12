/**
 * 网络检查模块 - 适配H5和App
 */
import config from "@/config/index";
import { decrypt } from "@/utils/request";


export default function useNetworkCheck(options) {
  let { onSuccess, onFailure, timeout = 5000 } = options;
  let appUrl = "";
  let logs = [];
  
  /**
   * 添加日志到收集数组
   */
  const addLog = (message, error = null) => {
    const logEntry = error ? `${message}: ${error}` : message;
    logs.push(`${logEntry}`);
  };

  /**
   * 输出所有收集的日志
   */
  const printLogs = (status) => {
    console.log(`网络检查${status === 'success' ? '成功' : '失败'}日志记录`);
    logs.forEach(log => console.log(log));
  };

  /**
   * 检查网络连接状态
   */
  const checkNetwork = () => {
    uni.getNetworkType({
      success: (res) => {
        if (res.networkType === "none") {
          addLog("网络连接不可用");
          onFailure(0);
        } else {
          addLog("网络连接正常，开始检查接口");
          uni.removeStorageSync("jk_url_list");
          checkLocalUrlList();
        }
      },
    });
  };

  /**
   * 检查本地存储的URL列表
   */
  const checkLocalUrlList = () => {
    uni.getStorage({
      key: "jk_url_list",
      success: (res) => {
        try {
          const data = res.data ? JSON.parse(res.data) : [];
          if (data.length < 1) {
            addLog("本地存储接口列表为空，开始检查固定配置接口");
            checkApiUrlList();
            return;
          }
          checkUrlAvailability(data)
            .then((availableUrl) => {
              addLog(`找到可用的本地存储接口: ${availableUrl}`);
              setAppUrl(availableUrl);
            })
            .catch(() => {
              addLog("本地存储接口都不可用，开始检查固定配置接口");
              checkApiUrlList();
            });
        } catch (error) {
          addLog("从本地存储获取接口列表失败", error);
          checkApiUrlList();
        }
      },
      fail: () => {
        addLog("本地没有存储接口列表，开始检查固定配置接口");
        checkApiUrlList();
      },
    });
  };

  /**
   * 检查固定配置接口
   */
  const checkApiUrlList = () => {
    if (config.apiUrlList.length === 0) {
      addLog("没有配置固定接口，开始检查 JSON URL");
      checkJsonUrlList(0);
      return;
    }
    checkUrlAvailability(config.apiUrlList)
      .then((availableUrl) => {
        addLog(`找到可用的本地固定接口: ${availableUrl}`);
        setAppUrl(availableUrl);
      })
      .catch(() => {
        addLog("本地固定接口都不可用，开始检查 JSON URL");
        checkJsonUrlList(0);
      });
  };

  /**
   * 检查JSON URL列表
   * @param {number} index 当前检查的索引
   * @param {Array} cachedJsonUrlList 缓存的URL列表，避免重复获取
   */
  const checkJsonUrlList = async (index, cachedJsonUrlList = null) => {
    let jsonUrlList;

    // 如果已经有缓存的URL列表，直接使用
    if (cachedJsonUrlList) {
      jsonUrlList = cachedJsonUrlList;
    } else {
      // 首次调用，根据平台获取URL列表

      // #ifdef H5
      addLog("H5端使用外部配置的jsonUrlList");
      addLog("jsonUrlList", config.jsonUrlList);
      jsonUrlList = config.jsonUrlList;
      // #endif

      // #ifdef APP-PLUS
      addLog("App端动态获取CDN服务器IP");
      try {
        const res = await getCDNServerIps();
        jsonUrlList = res;
      } catch (error) {
        addLog("获取CDN服务器IP失败，使用默认jsonUrlList", error);
        jsonUrlList = config.jsonUrlList; // 失败时使用默认配置
      }
      // #endif
    }

    if (!jsonUrlList || jsonUrlList.length === 0) {
      addLog("jsonUrlList为空");
      onFailure(null, logs);
      printLogs('failure');
      uni.removeStorageSync("jk_url_list");
      return;
    }

    if (index >= jsonUrlList.length) {
      addLog("所有 JSON URL 都不可用");
      onFailure(null, logs);
      printLogs('failure');
      uni.removeStorageSync("jk_url_list");
      return;
    }

    const jsonUrl = jsonUrlList[index];
    addLog("检查jsonUrl", jsonUrl);
    uni.request({
      url: jsonUrl,
      method: "GET",
      timeout,
      success: (response) => {
        console.log("response", response);
        if (response.statusCode === 200) {
          let arr = [];
          if (response.data.host) {
            arr = response.data.ips.map((item) => `http://${item}`);
            uni.setStorageSync("ip_host", response.data.host);
          } else {
            uni.removeStorageSync("ip_host");
            arr = response.data;
          }
          if (!Array.isArray(arr)) {
            arr = decrypt(arr);
          }
          checkUrlAvailability(arr)
            .then((availableUrl) => {
              addLog(`找到可用的动态接口: ${availableUrl}`);
              // 存储获取到的接口列表
              uni.setStorage({
                key: "jk_url_list",
                data: JSON.stringify(response.data),
                success: () => addLog("成功将接口列表存储到本地"),
              });
              setAppUrl(availableUrl);
            })
            .catch(() => {
              addLog(
                `从 ${jsonUrl} 获取的接口列表中没有可用接口，继续检查下一个 JSON URL`
              );
              // 递归调用时传递已缓存的URL列表，避免重复获取
              checkJsonUrlList(index + 1, jsonUrlList);
            });
        } else {
          addLog(`${jsonUrl} 返回的数据无效，继续检查下一个 JSON URL`);
          checkJsonUrlList(index + 1, jsonUrlList);
        }
      },
      fail: (e) => {
        console.log("e", e);
        addLog(`请求失败: ${jsonUrl} ，继续检查下一个 JSON URL`);
        checkJsonUrlList(index + 1, jsonUrlList);
      },
    });
  };

  /**
   * Promise.any 的兼容实现
   * 返回第一个成功的 Promise 结果，如果所有 Promise 都失败则拒绝
   * @param {Array<Promise>} promises Promise数组
   * @returns {Promise} 第一个成功的Promise结果
   */
  const promiseAny = (promises) => {
    // 检查原生支持
    if (typeof Promise.any === 'function') {
      return Promise.any(promises);
    }

    // 自定义实现
    return new Promise((resolve, reject) => {
      if (promises.length === 0) {
        reject(new Error('所有请求都失败'));
        return;
      }

      let rejectedCount = 0;
      const errors = [];

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          // 一旦有成功的结果，立即解决
          (value) => {
            resolve(value);
          },
          // 记录错误，如果全部失败则拒绝
          (error) => {
            errors[index] = error;
            rejectedCount++;
            if (rejectedCount === promises.length) {
              reject(new Error('所有URL请求都失败'));
            }
          }
        );
      });
    });
  };

  /**
   * 检查URL可用性，实现并发控制和取最快响应
   * @param {Array} urls URL列表
   * @returns {Promise<string>} 可用的URL
   */
  const checkUrlAvailability = (urls) => {
    addLog(`检查URL可用性: ${urls.join(', ')}`);
    const host = uni.getStorageSync("ip_host");

    return new Promise((resolve, reject) => {
      // 控制最大并发数
      const maxConcurrent = 3;
      // 存储所有请求任务，用于后续取消
      const requestTasks = [];
      let isResolved = false;

      // 创建URL检查的Promise
      const createUrlCheckPromise = (apiUrl, batchIndex) => {
        return new Promise((resolve, reject) => {
          const url = apiUrl + "/api/v2/common/checkApiStatus";
          const header = {
            accept: "application/json",
          };
          if (host) {
            header.Host = host;
          }
          // 发起请求并保存requestTask对象
          const requestTask = uni.request({
            url,
            method: "GET",
            timeout,
            header,
            success: (res) => {
              if (res.statusCode == 200 && res.data.status == 0) {
                resolve(apiUrl);
              } else {
                reject(new Error(`${apiUrl} 检查失败`));
              }
            },
            fail: (err) => {
              reject(new Error(`${apiUrl} 请求失败`))
            },
          });

          // 存储请求任务
          requestTasks.push({
            task: requestTask,
            batchIndex,
            url: apiUrl,
          });
        });
      };

      // 取消所有其它请求
      const cancelOtherRequests = (successUrl) => {
        requestTasks.forEach((item) => {
          try {
            if (
              item.url !== successUrl &&
              item.task &&
              typeof item.task.abort === "function"
            ) {
              addLog(`取消请求: ${item.url}`);
              item.task.abort();
            }
          } catch (error) {
            addLog(`取消请求失败: ${item.url}`, error);
          }
        });
      };

      // 分批处理URLs
      const processBatch = async (urlsToProcess, batchIndex = 0) => {
        if (urlsToProcess.length === 0 || isResolved) {
          if (!isResolved) {
            reject(new Error("所有URL都不可用"));
          }
          return;
        }

        // 获取当前批次的URLs
        const currentBatch = urlsToProcess.slice(0, maxConcurrent);
        const remainingUrls = urlsToProcess.slice(maxConcurrent);
        addLog("currentBatch", currentBatch);
        try {
          // 使用兼容的Promise.any获取第一个成功的结果
          const promises = currentBatch.map((url) =>
            createUrlCheckPromise(url, batchIndex)
          );
          const successUrl = await promiseAny(promises);
          // 标记已经解决
          isResolved = true;

          // 取消所有其它请求
          cancelOtherRequests(successUrl);

          // 返回可用URL
          resolve(successUrl);
        } catch (error) {
          addLog("当前批次所有URL都不可用:", error);
          // 当前批次所有URL都失败，继续处理下一批
          if (!isResolved) {
            processBatch(remainingUrls, batchIndex + 1);
          }
        }
      };

      // 开始处理第一批
      processBatch(urls);
    });
  };

  /**
   * 获取CDN服务器IP JSON列表 (仅App端使用)
   * @returns {Promise<Array>} IP列表
   */
  const getCDNServerIps = async () => {
    try {
      if (config.ipJsonUrlList && config.ipJsonUrlList.length === 0) {
        return config.jsonUrlList;
      }
      // 并行请求所有IP JSON URL
      const promises = config.ipJsonUrlList.map((url) => {
        return new Promise((resolve, reject) => {
          uni.request({
            url: url,
            method: "GET",
            timeout,
            success: (res) => {
              if (res.statusCode === 200 && res.data) {
                addLog(`获取CDN服务器IP成功: ${url}`);
                if (Array.isArray(res.data)) {
                  resolve(res.data);
                } else {
                  resolve(decrypt(res.data));
                }
              } else {
                reject(new Error(`响应状态码无效: ${res.statusCode}`));
              }
            },
            fail: (err) => {
              addLog(`获取CDN服务器IP失败: ${url}`);
              reject(err);
            },
          });
        });
      });

      // 使用 Promise.allSettled 的兼容实现
      const promiseAllSettled = (promises) => {
        return Promise.all(
          promises.map((promise) => 
            Promise.resolve(promise)
              .then(value => ({ status: 'fulfilled', value }))
              .catch(reason => ({ status: 'rejected', reason }))
          )
        );
      };

      // 等待所有请求完成，收集所有结果的状态
      const results = await promiseAllSettled(promises);
      
      // 筛选出成功的请求结果
      const successResults = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

      if (successResults.length === 0) {
        addLog("没有获取到任何CDN服务器IP");
        return config.jsonUrlList;
      }

      // 合并所有成功的数据
      let combinedData = [];
      successResults.forEach((result) => {
        try {
          if (Array.isArray(result)) {
            // 如果结果是数组，直接合并
            combinedData = combinedData.concat(result);
          } else if (result && result.ips && Array.isArray(result.ips)) {
            // 如果结果包含ips数组，处理后合并
            if (result.host) {
              uni.setStorageSync('ip_host', result.host);
            }
            const formattedIps = result.ips.map(ip => `http://${ip}`);
            combinedData = combinedData.concat(formattedIps);
          }
        } catch (error) {
          addLog('处理CDN服务器IP数据失败:', error);
          // 出错时跳过该结果继续处理
        }
      });

      // 去重
      combinedData = [...new Set(combinedData.filter(Boolean))];
      addLog(`共有${combinedData.length}个CDN服务器IP JSON地址`, combinedData);

      return combinedData.length > 0 ? combinedData : config.jsonUrlList;
    } catch (error) {
      addLog("获取CDN服务器IP过程中出错", error);
      return config.jsonUrlList;
    }
  };

  /**
   * 设置应用API URL
   * @param {string} url 可用的API URL
   */
  const setAppUrl = (url) => {
    appUrl = url;
    addLog(`设置API URL: ${url}`);
    uni.setStorageSync("tu_url", url);
    uni.setStorage({
      key: "api_url",
      data: url,
      success: () => {
        printLogs('success');
        onSuccess(appUrl, logs);
      },
    });
  };

  return {
    appUrl,
    checkNetwork,
  };
}
