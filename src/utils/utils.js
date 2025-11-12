// 常用工具类函数

export function formatPrice(price) {
  // 将价格转换为字符串并找到小数点的位置
  const priceStr = price.toString();
  const decimalIndex = priceStr.indexOf('.');

  // 如果没有小数点，直接返回两位小数点的格式化价格
  if (decimalIndex === -1) {
      return priceStr + '.00';
  }
  // 获取小数部分
  const integerPart = priceStr.substring(0, decimalIndex);
  const decimalPart = priceStr.substring(decimalIndex + 1, decimalIndex + 3);

  // 如果小数部分少于两位，用 '0' 补齐
  if (decimalPart.length === 1) {
      return integerPart + '.' + decimalPart + '0';
  } else if (decimalPart.length === 0) {
      return integerPart + '.00';
  }

  // 返回保留两位小数的价格
  return integerPart + '.' + decimalPart;
}

// 获取设备类型
export const getDeviceType = () => {
    let deviceType = '';
    let platform = uni.getSystemInfoSync().platform; //设备类型
    // #ifdef APP-PLUS
    if (platform === "android") {
      deviceType = 'android';
    } else if (platform === "ios") {
      deviceType = 'ios';
    }
    // #endif

    // #ifdef H5
    deviceType = 'h5';
    // #endif
    return deviceType;
}

// width=uni.upx2px(650) 
export const setImageWidth = (content, width='100%') => {
  // 正则表达式匹配所有img标签
  const imgReg = /<img[^>]*>/gi;
  
  // 替换所有img标签，添加width属性
  return content.replace(imgReg, (match) => {
    // 如果已经有width属性，直接返回
    if (match.includes('width=')) {
      return match;
    }

    console.log('debug', match.replace('<img', `<img width="${width}"`));

    // 没有width属性则添加
    return match.replace('<img', `<img width="${width}"`);
  });
}

export const truncateDecimal = (value, decimalPlaces) => {
  const stringValue = value.toString();
  const decimalIndex = stringValue.indexOf(".");
  if (decimalIndex === -1) {
    return stringValue; // 没有小数点，直接返回原始值
  }
  return stringValue.slice(0, decimalIndex + decimalPlaces + 1);
};

