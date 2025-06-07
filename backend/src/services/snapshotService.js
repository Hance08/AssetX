const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../models/User');
const Account = require('../models/Account');
const MonthlyNetWorth = require('../models/MonthlyNetWorth');

// 核心計算邏輯
const calculateAndSaveNetWorth = async (user) => {
  try {
    const accounts = await Account.find({ userId: user._id });
    
    let totalAssets = 0;
    let totalLiabilities = 0;

    accounts.forEach(account => {
      if (account.type === 'asset') {
        totalAssets += account.balance;
      } else if (account.type === 'liability') {
        totalLiabilities += account.balance;
      }
    });

    const netWorth = totalAssets - totalLiabilities;
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 使用 findOneAndUpdate + upsert 來新增或更新快照
    await MonthlyNetWorth.findOneAndUpdate(
      { userId: user._id, date: lastDayOfMonth },
      { netWorth: netWorth },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`已成功為使用者 ${user.username} 儲存 ${lastDayOfMonth.toLocaleDateString()} 的月度淨值快照。`);
  } catch (error) {
    console.error(`為使用者 ${user.username} 計算淨值快照時發生錯誤:`, error);
  }
};

// 遍歷所有使用者並執行計算
const runForAllUsers = async () => {
  const users = await User.find({});
  for (const user of users) {
    await calculateAndSaveNetWorth(user);
  }
};

// 設定排程：在每個月的最後一天 23:59 執行
// cron 語法: '分鐘 小時 日 月 星期'
const scheduleMonthlySnapshot = () => {
  // node-cron 不支援 'L' (月底)。
  // 因此我們改為每天檢查，判斷今天是否為該月的最後一天。
  cron.schedule('59 23 * * *', () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // 如果明天的月份與今天的月份不同，表示今天是月底
    if (today.getMonth() !== tomorrow.getMonth()) {
      console.log('偵測到今天是月底，開始執行月度淨值快照排程...');
      runForAllUsers();
    } else {
      console.log('今天不是月底，跳過快照排程。');
    }
  }, {
    scheduled: true,
    timezone: "Asia/Taipei"
  });
};

module.exports = { scheduleMonthlySnapshot, calculateAndSaveNetWorth, runForAllUsers }; 