export function navigateTo(url, params = {}) {
  uni.navigateTo({
      url: buildUrl(url, params)
  });
}

export function redirectTo(url, params = {}) {
  uni.redirectTo({
      url: buildUrl(url, params)
  });
}

export function switchTab(url) {
  uni.switchTab({
      url: url
  });
}

export function reLaunch(url, params = {}) {
  uni.reLaunch({
      url: buildUrl(url, params)
  });
}

export function navigateBack(delta = 1) {
  uni.navigateBack({
      delta: delta
  });
}

// 构建带参数的 URL
function buildUrl(url, params) {
  if (Object.keys(params).length > 0) {
      url += '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
  }
  return url;
}
