import config from "@/config/index";
import { decrypt } from "@/utils/request";

export async function logger(msg = "", level = "info") {
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPageName = currentPage ? currentPage.route : "";
    let platform = "";
    // #ifdef APP-PLUS
    platform = uni.getSystemInfoSync().platform;
    // #endif
    // #ifdef H5
    platform = "h5";
    // #endif
    const data = {
      token: uni.getStorageSync("authorization"),
      route: currentPageName,
      msg: msg,
      level: level,
      time: JSON.stringify(new Date()),
      platform: platform,
    };
    // 使用oss上传
    handleOss(data);
    // 使用aws上传
    handleAws(data);
  } catch (e) {
    console.log("logger error", e);
  }
}

/**
 * 使用接口上传
 * @param {Object} data 日志数据
 */
async function handleApi(data) {
  const host = uni.getStorageSync("ip_host");
  uni.request({
    url: uni.getStorageSync("api_url") + "/api/v2/common/logger",
    data: {
      data: data,
    },
    method: "POST",
    header: {
      "Content-Type": "application/json",
      ...(host ? { host: host } : {}),
    },
    success: (res) => {
      console.log("接口日志上传成功", res);
    },
    fail: (e) => {
      console.log("接口日志上传失败", e);
    },
  });
}

async function handleTokenAndUpload(data, type) {
  const tokenKey = `${type}_token`;
  const configUrl =
    type === "oss" ? config.loggerJsonUrlOss : config.loggerJsonUrlAws;

  if (!configUrl) {
    console.log(`${type}日志上传配置地址不存在，无法上传`);
    return;
  }
  // 获取存储的token
  const tokenObj = uni.getStorageSync(tokenKey);
  // 检查token是否存在且未过期
  const isTokenValid =
    tokenObj && tokenObj.expires_at && tokenObj.expires_at > Date.now();

  // 如果token不存在或已过期，则获取新token
  if (!isTokenValid) {
    try {
      const res = await getToken(configUrl);
      if (res) {
        const token =
          typeof res.data === "string" ? decrypt(res.data) : res.data;
        // 将token与过期时间一起存储，延长到30秒更合理
        const tokenWithExpiry = {
          ...token,
          expires_at: Date.now() + 30000, // 当前时间 + 30秒
        };
        uni.setStorageSync(tokenKey, tokenWithExpiry);

        // 获取完token后处理上传
        if (
          (type === "oss" && token.switch == 1) ||
          (type === "aws" && !config.loggerJsonUrlOss && token.switch == 1)
        ) {
          handleApi(data);
        } else {
          // 使用批量收集的方式而不是立即上传
          collectAndUpload(JSON.stringify(data), type);
        }
      }
    } catch (error) {
      console.error(`获取${type.toUpperCase()}令牌失败:`, error);
      // 失败时将日志存储到本地队列，稍后重试
      addToLogQueue(data, type);
    }
  } else {
    // token有效，直接处理上传
    if (
      (type === "oss" && tokenObj.switch == 1) ||
      (type === "aws" && !config.loggerJsonUrlOss && tokenObj.switch == 1)
    ) {
      handleApi(data);
    } else {
      collectAndUpload(JSON.stringify(data), type);
    }
  }
}

async function handleOss(data) {
  await handleTokenAndUpload(data, "oss");
}

async function handleAws(data) {
  await handleTokenAndUpload(data, "aws");
}

// 优化日志批量处理
const logQueues = {
  oss: [],
  aws: [],
};
let uploadTimers = {
  oss: null,
  aws: null,
};
const MAX_QUEUE_SIZE = 20; // 最多收集20条日志再上传
const UPLOAD_INTERVAL = 5000; // 5秒没有新日志时执行上传

function collectAndUpload(content, type) {
  // 添加到队列
  logQueues[type].push(content);

  // 清除之前的计时器
  if (uploadTimers[type]) {
    clearTimeout(uploadTimers[type]);
  }

  // 如果队列已满，立即上传
  if (logQueues[type].length >= MAX_QUEUE_SIZE) {
    processLogQueue(type);
  } else {
    // 否则设置定时器，一段时间后上传
    uploadTimers[type] = setTimeout(() => {
      processLogQueue(type);
    }, UPLOAD_INTERVAL);
  }
}

// 处理日志队列上传
function processLogQueue(type) {
  if (logQueues[type].length === 0) return;

  // 将队列中的所有日志合并为一个文件
  const combinedContent = logQueues[type].join("\n");
  // 清空队列
  logQueues[type] = [];

  // 执行实际的保存和上传
  saveAndUpload(combinedContent, type);
}

// 添加日志到重试队列
function addToLogQueue(data, type) {
  try {
    // 获取现有队列
    const queueKey = `log_retry_queue_${type}`;
    let queue = uni.getStorageSync(queueKey) || [];
    // 添加新日志和时间戳
    queue.push({
      data: data,
      timestamp: Date.now(),
      retryCount: 0,
    });
    // 最多保存50条待上传日志
    if (queue.length > 50) {
      queue = queue.slice(-50);
    }
    // 保存队列
    uni.setStorageSync(queueKey, queue);
  } catch (e) {
    console.error("保存日志队列失败:", e);
  }
}

// 添加网络检查函数
function isNetworkAvailable() {
  const networkType = uni.getNetworkType().type;
  return networkType !== "none";
}

// 修改saveAndUpload函数，使用并发队列
function saveAndUpload(content, type) {
  // 网络检查保持不变
  if (!isNetworkAvailable()) {
    console.log("网络不可用，将日志保存到队列中稍后上传");
    addToLogQueue({ content: content }, type);
    return;
  }

  try {
    const timestamp = new Date().getTime();
    const fileName = `log_${timestamp}.txt`;
    const path = `/${fileName}`;

    const compressedContent = compressContent(content);

    // app端将数据保存到本地file才可以上传
    // #ifdef APP-PLUS
    const filePath = `_doc/${Date.now()}.txt`;
    plus.io.requestFileSystem(
      plus.io.PRIVATE_DOC,
      (fs) => {
        fs.root.getFile(
          filePath,
          { create: true },
          function (fileEntry) {
            fileEntry.createWriter(
              (writer) => {
                writer.onwrite = function () {
                  console.log("文件已保存:", fileEntry.fullPath);
                  // 使用并发队列替代直接上传
                  enqueueUpload(type, fileEntry.fullPath, path, 0);
                };
                writer.onerror = function (e) {
                  console.error("文件写入失败:", e);
                };
                writer.write(compressedContent);
              },
              function (e) {
                console.error("创建文件写入器失败:", e);
              }
            );
          },
          function (e) {
            console.error("创建文件失败:", e);
          }
        );
      },
      function (e) {
        console.error("获取文件系统失败:", e);
      }
    );
    // #endif

    // #ifdef H5
    const blob = new Blob([compressedContent], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });
    // 使用并发队列替代直接上传
    enqueueUpload(type, file, path, 0);
    // #endif
  } catch (e) {
    console.log("saveAndUpload error", e);
  }
}

// 简单的内容压缩函数
function compressContent(content) {
  return content.replace(/\s+/g, " ");
}

function handleUploadError(service, file, path, retryCount, error) {
  console.error(`${service} 日志上传失败:`, error);

  const MAX_RETRIES = 3;
  if (retryCount < MAX_RETRIES) {
    const delay = Math.pow(2, retryCount) * 1000;
    console.log(
      `将在 ${delay}ms 后重试上传 ${service} 日志, 重试次数: ${retryCount + 1}`
    );

    setTimeout(() => {
      if (service === "OSS") {
        uploadToOSS(file, path, retryCount + 1);
      } else if (service === "AWS") {
        uploadToAws(file, path, retryCount + 1);
      }
    }, delay);
  } else {
    console.error(`${service} 日志上传失败，已达最大重试次数`);
    saveFailedUpload(service, file, path);
  }
}

// 优化上传函数，添加重试机制
function uploadToOSS(file, ossPath, retryCount) {
  const MAX_RETRIES = 3;
  const ossToken = uni.getStorageSync("oss_token");

  if (!ossToken) {
    console.log("OSS Token不存在，无法上传");
    return;
  }

  if (ossToken.switch != 2) {
    console.log("OSS 日志上传已关闭");
    return;
  }

  // #ifdef H5
  uploadOSSWithToken(file, ossPath, ossToken, retryCount);
  // #endif

  // #ifdef APP-PLUS
  uni.uploadFile({
    url: ossToken.host,
    filePath: file,
    name: "file",
    formData: {
      success_action_status: "200",
      policy: ossToken.policy,
      "x-oss-signature": ossToken.signature,
      "x-oss-signature-version": "OSS4-HMAC-SHA256",
      "x-oss-credential": ossToken.x_oss_credential,
      "x-oss-date": ossToken.x_oss_date,
      "x-oss-security-token": ossToken.security_token,
      key: ossToken.dir + ossPath,
    },
    success: (uploadRes) => {
      if (uploadRes.statusCode === 200 || uploadRes.statusCode === 204) {
        console.log("OSS 日志上传成功:", uploadRes);
        // 上传成功后删除本地文件
        deleteLocalFile(file);
      } else {
        handleUploadError("OSS", file, ossPath, retryCount, uploadRes);
      }
    },
    fail: (err) => {
      handleUploadError("OSS", file, ossPath, retryCount, err);
    },
  });
  // #endif
}

function uploadToAws(file, awsPath, retryCount) {
  const MAX_RETRIES = 3;
  const awsToken = uni.getStorageSync("aws_token");

  if (!awsToken) {
    console.log("AWS Token不存在，无法上传");
    return;
  }

  if (awsToken.switch != 3) {
    console.log("AWS 日志上传已关闭");
    return;
  }

  // #ifdef H5
  uploadAwsWithToken(file, awsPath, awsToken, retryCount);
  // #endif

  // #ifdef APP-PLUS
  uni.uploadFile({
    url: awsToken.host,
    filePath: file,
    name: "file",
    formData: {
      "Content-Type": awsToken["Content-Type"],
      acl: awsToken.acl,
      policy: awsToken.Policy,
      "X-Amz-Algorithm": awsToken["X-Amz-Algorithm"],
      "X-Amz-Credential": awsToken["X-Amz-Credential"],
      "X-Amz-Date": awsToken["X-Amz-Date"],
      "X-Amz-Signature": awsToken["X-Amz-Signature"],
      key: awsToken.key + awsPath,
    },
    success: (uploadRes) => {
      if (uploadRes.statusCode === 200 || uploadRes.statusCode === 204) {
        console.log("AWS 日志上传成功:", uploadRes);
        // 上传成功后删除本地文件
        deleteLocalFile(file);
      } else {
        handleUploadError("AWS", file, awsPath, retryCount, uploadRes);
      }
    },
    fail: (err) => {
      handleUploadError("AWS", file, awsPath, retryCount, err);
    },
  });
  // #endif
}

// 删除本地文件
function deleteLocalFile(filePath) {
  // #ifdef APP-PLUS
  plus.io.resolveLocalFileSystemURL(
    filePath,
    function (entry) {
      entry.remove(
        function () {
          console.log("临时文件已删除");
        },
        function (e) {
          console.error("删除文件失败:", e);
        }
      );
    },
    function (e) {
      console.log("解析文件URL失败:", e);
    }
  );
  // #endif
}

// 保存失败的上传信息
function saveFailedUpload(service, file, path) {
  try {
    const failedUploadsKey = `failed_uploads_${service.toLowerCase()}`;
    let failedUploads = uni.getStorageSync(failedUploadsKey) || [];

    // #ifdef APP-PLUS
    failedUploads.push({
      filePath: file,
      destPath: path,
      timestamp: Date.now(),
    });
    uni.setStorageSync(failedUploadsKey, failedUploads);
    // #endif

    // #ifdef H5
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = function () {
        let updatedUploads = uni.getStorageSync(failedUploadsKey) || [];
        updatedUploads.push({
          content: reader.result,
          destPath: path,
          timestamp: Date.now(),
        });
        // 限制数量
        if (updatedUploads.length > 20) {
          updatedUploads = updatedUploads.slice(-20);
        }
        uni.setStorageSync(failedUploadsKey, updatedUploads);
      };
      reader.readAsText(file);
    } else {
      // 非File对象的处理
      failedUploads.push({
        content: typeof file === "string" ? file : JSON.stringify(file),
        destPath: path,
        timestamp: Date.now(),
      });
      uni.setStorageSync(failedUploadsKey, failedUploads);
    }
    // #endif
  } catch (e) {
    console.error("保存失败上传信息出错:", e);
  }
}

function uploadOSSWithToken(file, ossPath, token, retryCount) {
  uni.uploadFile({
    url: token.host,
    file: file,
    formData: {
      success_action_status: "200",
      policy: token.policy,
      "x-oss-signature": token.signature,
      "x-oss-signature-version": "OSS4-HMAC-SHA256",
      "x-oss-credential": token.x_oss_credential,
      "x-oss-date": token.x_oss_date,
      "x-oss-security-token": token.security_token,
      key: token.dir + ossPath,
    },
    success: (res) => {
      if (res.statusCode === 200) {
        console.log("OSS 日志上传成功", res);
      } else {
        handleUploadError("OSS", file, ossPath, retryCount, res);
      }
    },
    fail: (err) => {
      handleUploadError("OSS", file, ossPath, retryCount, err);
    },
  });
}

function uploadAwsWithToken(file, awsPath, token, retryCount) {
  uni.uploadFile({
    url: token.host,
    file: file,
    formData: {
      "Content-Type": token["Content-Type"],
      acl: token.acl,
      policy: token.Policy,
      "X-Amz-Algorithm": token["X-Amz-Algorithm"],
      "X-Amz-Credential": token["X-Amz-Credential"],
      "X-Amz-Date": token["X-Amz-Date"],
      "X-Amz-Signature": token["X-Amz-Signature"],
      key: token.key + awsPath,
    },
    success: (res) => {
      if (res.statusCode === 200 || res.statusCode === 204) {
        console.log("AWS 日志上传成功", res);
      } else {
        handleUploadError("AWS", file, awsPath, retryCount, res);
      }
    },
    fail: (err) => {
      handleUploadError("AWS", file, awsPath, retryCount, err);
    },
  });
}

// 增加定期检查是否有失败的上传需要重试
function initRetryFailedUploads() {
  // 应用启动时检查一次
  retryFailedUploads();

  // 设置定期检查
  setInterval(retryFailedUploads, 30 * 60 * 1000); // 每30分钟检查一次
}

function retryFailedUploads() {
  const services = ["oss", "aws"];

  services.forEach((service) => {
    try {
      const failedUploadsKey = `failed_uploads_${service}`;
      const failedUploads = uni.getStorageSync(failedUploadsKey) || [];

      if (failedUploads.length === 0) return;

      console.log(
        `尝试重新上传 ${
          failedUploads.length
        } 个失败的 ${service.toUpperCase()} 日志`
      );

      // 上传后马上更新存储，清空失败列表
      uni.setStorageSync(failedUploadsKey, []);

      // 对每个失败项进行重试
      failedUploads.forEach((item) => {
        // 只重试24小时内的失败上传
        if (Date.now() - item.timestamp > 24 * 60 * 60 * 1000) {
          return;
        }

        // #ifdef APP-PLUS
        if (item.filePath) {
          if (service === "oss") {
            uploadToOSS(item.filePath, item.destPath, 0);
          } else {
            uploadToAws(item.filePath, item.destPath, 0);
          }
        }
        // #endif

        // #ifdef H5
        if (item.content) {
          const blob = new Blob([item.content], { type: "text/plain" });
          const file = new File([blob], `retry_${Date.now()}.txt`, {
            type: "text/plain",
          });

          if (service === "oss") {
            uploadToOSS(file, item.destPath, 0);
          } else {
            uploadToAws(file, item.destPath, 0);
          }
        }
        // #endif
      });
    } catch (e) {
      console.error(`重试 ${service} 失败上传出错:`, e);
    }
  });
}

// 在应用启动时初始化重试机制
// initRetryFailedUploads();

function getToken(url) {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: "GET",
      success: (res) => resolve(res),
      fail: () => reject(new Error("获取token失败")),
    });
  });
}

// 添加并发控制
const uploadQueue = {
  oss: [],
  aws: [],
};

// 添加并发控制
const activeUploads = {
  oss: 0,
  aws: 0,
};
const MAX_CONCURRENT_UPLOADS = 3;

function enqueueUpload(type, file, path, retryCount) {
  uploadQueue[type].push({ file, path, retryCount });
  processUploadQueue(type);
}

function processUploadQueue(type) {
  if (
    uploadQueue[type].length === 0 ||
    activeUploads[type] >= MAX_CONCURRENT_UPLOADS
  ) {
    return;
  }

  const { file, path, retryCount } = uploadQueue[type].shift();
  activeUploads[type]++;

  const uploadComplete = () => {
    activeUploads[type]--;
    processUploadQueue(type);
  };

  // 根据类型调用相应的上传函数
  if (type === "oss") {
    // 修改上传函数，添加回调
    uploadToOSSWithCallback(file, path, retryCount, uploadComplete);
  } else {
    uploadToAwsWithCallback(file, path, retryCount, uploadComplete);
  }
}

function uploadToOSSWithCallback(file, path, retryCount, callback) {
  const ossToken = uni.getStorageSync("oss_token");

  if (!ossToken) {
    console.log("OSS Token不存在，无法上传");
    callback(); // 调用回调函数，即使失败也需要继续处理队列
    return;
  }

  if (ossToken.switch != 2) {
    console.log("OSS 日志上传已关闭");
    callback();
    return;
  }

  // #ifdef H5
  uni.uploadFile({
    url: ossToken.host,
    file: file,
    formData: {
      success_action_status: "200",
      policy: ossToken.policy,
      "x-oss-signature": ossToken.signature,
      "x-oss-signature-version": "OSS4-HMAC-SHA256",
      "x-oss-credential": ossToken.x_oss_credential,
      "x-oss-date": ossToken.x_oss_date,
      "x-oss-security-token": ossToken.security_token,
      key: ossToken.dir + path,
    },
    success: (res) => {
      if (res.statusCode === 200) {
        console.log("OSS 日志上传成功", res);
      } else {
        handleUploadError("OSS", file, path, retryCount, res);
      }
      callback();
    },
    fail: (err) => {
      handleUploadError("OSS", file, path, retryCount, err);
      callback();
    },
    complete: () => {
      // 确保回调被调用
      // callback(); // 由于在success和fail中都已调用，此处可注释
    },
  });
  // #endif

  // #ifdef APP-PLUS
  uni.uploadFile({
    url: ossToken.host,
    filePath: file,
    name: "file",
    formData: {
      success_action_status: "200",
      policy: ossToken.policy,
      "x-oss-signature": ossToken.signature,
      "x-oss-signature-version": "OSS4-HMAC-SHA256",
      "x-oss-credential": ossToken.x_oss_credential,
      "x-oss-date": ossToken.x_oss_date,
      "x-oss-security-token": ossToken.security_token,
      key: ossToken.dir + path,
    },
    success: (uploadRes) => {
      if (uploadRes.statusCode === 200 || uploadRes.statusCode === 204) {
        console.log("OSS 日志上传成功:", uploadRes);
        deleteLocalFile(file);
      } else {
        handleUploadError("OSS", file, path, retryCount, uploadRes);
      }
      callback();
    },
    fail: (err) => {
      handleUploadError("OSS", file, path, retryCount, err);
      callback();
    },
    complete: () => {},
  });
  // #endif
}

function uploadToAwsWithCallback(file, path, retryCount, callback) {
  const awsToken = uni.getStorageSync("aws_token");

  if (!awsToken) {
    console.log("AWS Token不存在，无法上传");
    callback();
    return;
  }

  if (awsToken.switch != 3) {
    console.log("AWS 日志上传已关闭");
    callback();
    return;
  }

  // #ifdef H5
  uni.uploadFile({
    url: awsToken.host,
    file: file,
    formData: {
      "Content-Type": awsToken["Content-Type"],
      acl: awsToken.acl,
      policy: awsToken.Policy,
      "X-Amz-Algorithm": awsToken["X-Amz-Algorithm"],
      "X-Amz-Credential": awsToken["X-Amz-Credential"],
      "X-Amz-Date": awsToken["X-Amz-Date"],
      "X-Amz-Signature": awsToken["X-Amz-Signature"],
      key: awsToken.key + path,
    },
    success: (res) => {
      if (res.statusCode === 200 || res.statusCode === 204) {
        console.log("AWS 日志上传成功", res);
      } else {
        handleUploadError("AWS", file, path, retryCount, res);
      }
      callback();
    },
    fail: (err) => {
      handleUploadError("AWS", file, path, retryCount, err);
      callback();
    },
  });
  // #endif

  // #ifdef APP-PLUS
  uni.uploadFile({
    url: awsToken.host,
    filePath: file,
    name: "file",
    formData: {
      "Content-Type": awsToken["Content-Type"],
      acl: awsToken.acl,
      policy: awsToken.Policy,
      "X-Amz-Algorithm": awsToken["X-Amz-Algorithm"],
      "X-Amz-Credential": awsToken["X-Amz-Credential"],
      "X-Amz-Date": awsToken["X-Amz-Date"],
      "X-Amz-Signature": awsToken["X-Amz-Signature"],
      key: awsToken.key + path,
    },
    success: (uploadRes) => {
      if (uploadRes.statusCode === 200 || uploadRes.statusCode === 204) {
        console.log("AWS 日志上传成功:", uploadRes);
        deleteLocalFile(file);
      } else {
        handleUploadError("AWS", file, path, retryCount, uploadRes);
      }
      callback();
    },
    fail: (err) => {
      handleUploadError("AWS", file, path, retryCount, err);
      callback();
    },
  });
  // #endif
}
