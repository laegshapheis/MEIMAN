// 正则表达式集合
export const regexPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobileInternational: /^\+\d{1,4}\d{6,14}$/,
  mobileChinese: /^(\+?86)?1[3-9]\d{9}$/,
  chinese: /^[\u4e00-\u9fa5]+$/,
  password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{}|;':",./<>?…]{8,16}$/,
  miyao: /^[0-9]{12}$/,
  walletAddressTRC20: /^T[a-zA-Z0-9]{33}$/,
  walletAddressBSC_ETH_OKE: /^0x[a-fA-F0-9]{40}$/,
  txHash: /^[a-fA-F0-9]{64}$|^[a-fA-F0-9]{66}$/,
  alipayPhone: /^1[3456789]\d{9}$/,
  alipayEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  bankCard: /^\d{16,19}$/,
  noSpecialCharacters: /[^a-zA-Z\d]/g,
  noWhitespace: /[\s]/g,
  passwordFilter: /[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g
};

const ValidateUtils = {
  // 验证邮箱格式
  isEmail(email) {
    return regexPatterns.email.test(email);
  },

  isMobile(mobile) {
    if (!mobile) return false;
    
    // 移除所有空格
    const cleanedNumber = mobile.replace(/\s+/g, '');
    
    return regexPatterns.mobileInternational.test(cleanedNumber) || regexPatterns.mobileChinese.test(cleanedNumber);
  },
  // 验证是否为汉字
  isChinese(str) {
    return regexPatterns.chinese.test(str);
  },
  // 验证密码
  isPasswordValid(password) {
    return regexPatterns.password.test(password) && !/\s/.test(password);
  },
  // 验证密钥规则
  isMiyaoValid(password) {
    return regexPatterns.miyao.test(password);
  },

  // 数字货币地址验证
  isValidWalletAddress(address, type) {
    switch (type) {
      case "TRC20 波场链（Tron）":
        return regexPatterns.walletAddressTRC20.test(address);
      case "BSC 币安链（Binance）":
      case "ERC20 以太仿（ETH）":
      case "OKEx 欧易链（OKE）":
        return regexPatterns.walletAddressBSC_ETH_OKE.test(address);
      default:
        return false;
    }
  },

  // 哈希判断
  isValidTxHash(txHash) {
    return regexPatterns.txHash.test(txHash);
  },

  isAlipayAccount(str) {
    return regexPatterns.alipayPhone.test(str) || regexPatterns.alipayEmail.test(str);
  },

  isValidBankCardFormat(cardNumber) {
    return regexPatterns.bankCard.test(cardNumber);
  },

};

export default ValidateUtils;
