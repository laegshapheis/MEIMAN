const ValidateUtils = {
  // 验证邮箱格式
  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // 验证手机号格式
  isMobile(mobile) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(mobile);
  },

  // 验证是否为汉字
  isChinese(str) {
    const regex = /^[\u4e00-\u9fa5]+$/;
    return regex.test(str);
  },
  // 验证密码
  isPasswordValid(password) {
       // 8-16位，支持字母数字混合或字母数字+符号
      var regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{}|;':",./<>?…]{8,16}$/;
      return regex.test(password) && !/\s/.test(password);
  },
  // 验证密钥规则
  isMiyaoValid(password) {
    const regex = /^[0-9]{12}$/;
    return regex.test(password);
  },

  // 数字货币地址验证
  isValidWalletAddress(address, type) {
    switch (type) {
      case "TRC20 波场链（Tron）":
        console.log(
          "address",
          address,
          type,
          /^T[a-zA-Z0-9]{33}$/.test(address)
        );
        return /^T[a-zA-Z0-9]{33}$/.test(address);
      case "BSC 币安链（Binance）":
      case "ERC20 以太仿（ETH）":
      case "OKEx 欧易链（OKE）":
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      default:
        return false;
    }
  },

  // 哈希判断
  isValidTxHash(txHash) {
    const regex = /^[a-fA-F0-9]{64}$|^[a-fA-F0-9]{66}$/;
    return regex.test(txHash);
  },

  isAlipayAccount(str) {
    // 验证是否为手机号
    let phoneRegex = /^1[3456789]\d{9}$/;
    // 验证是否为邮箱
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    return phoneRegex.test(str) || emailRegex.test(str);
  },

  isValidBankCardFormat(cardNumber) {
    return /^\d{16,19}$/.test(cardNumber);
  },

};

export default ValidateUtils;
