// rename-icons.js
const fs = require('fs');
const path = require('path');

// 定义源目录和目标目录
const sourceDir = './static/icon'; // 存放原始图标的目录
const targetDir = './src/static/images/profile/icon_v2'; // 常用功能图标目标目录
const securityTargetDir = './src/static/images/profile/icon_v2'; // 安全中心图标目标目录

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

if (!fs.existsSync(securityTargetDir)) {
  fs.mkdirSync(securityTargetDir, { recursive: true });
}

// 常用功能图标映射
const commonMenuIcons = [
  { title: "账户详情", icon: "account_icon.svg", sourcePattern: "账户详情" },
  { title: "交易明细", icon: "zijing_icon.svg", sourcePattern: "交易明细" },
  { title: "投资制度", icon: "touzizhidu_icon.svg", sourcePattern: "投资制度" },
  { title: "计算器", icon: "calc_icon.svg", sourcePattern: "计算器" },
  { title: "邀请好友", icon: "invite_icon.svg", sourcePattern: "邀请好友" },
  { title: "拼团记录", icon: "group_icon.svg", sourcePattern: "拼团记录" },
  { title: "无忧易贷", icon: "daikuan_icon.svg", sourcePattern: "无忧易贷" },
  { title: "积分商城", icon: "market_icon.svg", sourcePattern: "积分商城" },
  { title: "加息券", icon: "rate_coupon_icon.svg", sourcePattern: "加息券" },
  { title: "代金券", icon: "cash_coupon_icon.svg", sourcePattern: "代金券" },
  { title: "幸运转盘", icon: "lucky_turn_icon.svg", sourcePattern: "幸运转盘" },
  { title: "每日签到", icon: "daily_sign_icon.svg", sourcePattern: "每日签到" },
  { title: "知识学堂", icon: "xuetan_icon.svg", sourcePattern: "知识学堂" },
];

// 安全中心图标映射
const securityMenuIcons = [
  { title: "登录密码", icon: "mima_icon.svg", sourcePattern: "登录密码" },
  { title: "支付密码", icon: "zhifu_icon.svg", sourcePattern: "支付密码" },
  { title: "实名认证", icon: "shiming_icon.svg", sourcePattern: "实名认证" },
  { title: "提现管理", icon: "tixian_icon.svg", sourcePattern: "提现管理" },
  { title: "收货地址", icon: "address_icon.svg", sourcePattern: "收货地址" },
  { title: "查看密钥", icon: "miyao_icon.svg", sourcePattern: "查看密钥" },
  { title: "版本更新", icon: "upgrade_icon.svg", sourcePattern: "版本升级" },
  { title: "退出登录", icon: "logout_icon.svg", sourcePattern: "退出登录" }
];

// 读取源目录中的所有文件
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('读取源目录失败:', err);
    return;
  }

  // 处理常用功能图标
  console.log('开始处理常用功能图标...');
  commonMenuIcons.forEach(item => {
    // 查找匹配的源文件
    const matchingFile = files.find(file => 
      file.includes(item.sourcePattern) || 
      file.includes(`Property 1=${item.sourcePattern}`)
    );
    
    if (matchingFile) {
      const sourceFile = path.join(sourceDir, matchingFile);
      const targetFile = path.join(targetDir, item.icon);
      
      fs.copyFile(sourceFile, targetFile, (err) => {
        if (err) {
          console.error(`复制文件 ${item.title} 失败:`, err);
        } else {
          console.log(`成功将 ${matchingFile} 复制并重命名为 ${item.icon} (${item.title})`);
        }
      });
    } else {
      console.warn(`未找到匹配 ${item.title} 的源文件`);
    }
  });

  // 处理安全中心图标
  console.log('开始处理安全中心图标...');
  securityMenuIcons.forEach(item => {
    // 查找匹配的源文件
    const matchingFile = files.find(file => 
      file.includes(item.sourcePattern) || 
      file.includes(`Property 1=${item.sourcePattern}`)
    );
    
    if (matchingFile) {
      const sourceFile = path.join(sourceDir, matchingFile);
      const targetFile = path.join(securityTargetDir, item.icon);
      
      fs.copyFile(sourceFile, targetFile, (err) => {
        if (err) {
          console.error(`复制文件 ${item.title} 失败:`, err);
        } else {
          console.log(`成功将 ${matchingFile} 复制并重命名为 ${item.icon} (${item.title})`);
        }
      });
    } else {
      console.warn(`未找到匹配 ${item.title} 的源文件`);
    }
  });
});

console.log('图标重命名脚本执行完毕。请检查目标目录中的文件。');