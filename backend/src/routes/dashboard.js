const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const MonthlyNetWorth = require('../models/MonthlyNetWorth');
const { calculateAndSaveNetWorth, runForAllUsers } = require('../services/snapshotService');

// @route   GET api/dashboard/summary
// @desc    取得儀表板的摘要資訊 (總資產、總負債、淨值)
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    // 使用 MongoDB Aggregation Pipeline 計算
    const summary = await Account.aggregate([
      // 步驟 1: 只篩選出屬於當前使用者的帳戶
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      
      // 步驟 2: 根據帳戶類型 (asset/liability) 進行分組，並加總餘額
      {
        $group: {
          _id: '$type', // 分組的依據
          total: { $sum: '$balance' }, // 將同組的 balance 加總
        },
      },
    ]);

    // 整理計算結果
    let totalAssets = 0;
    let totalLiabilities = 0;

    summary.forEach(group => {
      if (group._id === 'asset') {
        totalAssets = group.total;
      } else if (group._id === 'liability') {
        totalLiabilities = group.total;
      }
    });

    const netWorth = totalAssets - totalLiabilities;

    res.json({
      totalAssets,
      totalLiabilities,
      netWorth,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   GET api/dashboard/monthly-summary
// @desc    取得指定月份的總收入與總支出
// @access  Private
router.get('/monthly-summary', auth, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const results = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: startDate, $lte: endDate },
                    category: { $ne: '帳戶轉帳' }
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [{ $gt: ['$amount', 0] }, '$amount', 0]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $lt: ['$amount', 0] }, '$amount', 0]
                        }
                    }
                }
            }
        ]);
        
        const summary = results[0] || { totalIncome: 0, totalExpense: 0 };

        res.json({
            totalIncome: summary.totalIncome,
            totalExpense: Math.abs(summary.totalExpense)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// @route   GET api/dashboard/monthly-category-summary
// @desc    取得指定月份的支出分類摘要
// @access  Private
router.get('/monthly-category-summary', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const summary = await Transaction.aggregate([
      // 步驟 1: 篩選條件
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          amount: { $lt: 0 }, // 只看支出 (金額 < 0)
          date: { $gte: startDate, $lte: endDate },
        },
      },
      // 步驟 2: 按分類分組並加總
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      // 步驟 3: 格式化輸出
      {
        $project: {
          _id: 0, // 不顯示 _id
          name: '$_id', // 將 _id 重新命名為 name
          value: { $abs: '$total' }, // 將加總後的負數轉為正數
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   GET api/dashboard/asset-distribution
// @desc    取得資產分佈資料 (用於圓餅圖)
// @access  Private
router.get('/asset-distribution', auth, async (req, res) => {
  try {
    const assetDistribution = await Account.aggregate([
      // 步驟 1: 篩選出屬於當前使用者且類型為 'asset' 的帳戶
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          type: 'asset',
          balance: { $gt: 0 } // 只顯示有餘額的資產
        }
      },
      // 步驟 2: 格式化輸出
      {
        $project: {
          _id: 0,
          name: '$name',
          value: '$balance'
        }
      }
    ]);

    res.json(assetDistribution);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route    GET api/dashboard/test-snapshot
// @desc     (For Development) 手動觸發為當前登入使用者建立快照
// @access   Private
router.get('/test-snapshot', auth, async (req, res) => {
    try {
        await calculateAndSaveNetWorth(req.user);
        res.status(200).send('已成功為您手動觸發一次月度快照計算。');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/dashboard/net-worth-growth
// @desc     Get user's net worth growth over the last 12 months
// @access   Private
router.get('/net-worth-growth', auth, async (req, res) => {
    try {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 11);
        twelveMonthsAgo.setDate(1); 
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        // 1. 取得歷史快照
        const netWorthData = await MonthlyNetWorth.find({
            userId: req.user.id,
            date: { $gte: twelveMonthsAgo }
        }).sort({ date: 'asc' }).lean(); // .lean() for plain JS objects

        // 2. 計算當前即時淨值
        const summary = await Account.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$balance' },
                },
            },
        ]);

        let totalAssets = 0;
        let totalLiabilities = 0;
        summary.forEach(group => {
            if (group._id === 'asset') totalAssets = group.total;
            else if (group._id === 'liability') totalLiabilities = group.total;
        });
        const currentNetWorth = totalAssets - totalLiabilities;
        
        // 3. 組合數據
        const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

        const currentMonthSnapshotIndex = netWorthData.findIndex(
            item => 
                item.date.getFullYear() === currentMonthDate.getFullYear() &&
                item.date.getMonth() === currentMonthDate.getMonth()
        );

        if (currentMonthSnapshotIndex !== -1) {
            // 如果當月快照已存在，用即時數據更新它
            netWorthData[currentMonthSnapshotIndex].netWorth = currentNetWorth;
            // 更新日期為當下，讓前端能辨識
            netWorthData[currentMonthSnapshotIndex].date = today; 
        } else {
            // 如果當月快照不存在，新增一個即時數據點
            netWorthData.push({
                userId: req.user.id,
                netWorth: currentNetWorth,
                date: today
            });
        }
        
        // 確保數據點不超過12個，並按日期排序
        const finalData = netWorthData.slice(-12).sort((a,b) => a.date - b.date);

        res.json(finalData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/dashboard/daily-flow
// @desc     取得指定月份的每日收支
// @access   Private
router.get('/daily-flow', auth, async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;

        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));

        const transactions = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),
                    date: { $gte: startDate, $lt: endDate },
                    category: { $ne: '帳戶轉帳' }
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: '$date' },
                    totalIncome: {
                        $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] }
                    },
                    totalExpense: {
                        $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    day: '$_id',
                    income: '$totalIncome',
                    expense: { $abs: '$totalExpense' }
                }
            },
            { $sort: { day: 1 } }
        ]);

        // 建立一個包含該月所有日期的基礎陣列
        const daysInMonth = new Date(year, month, 0).getDate();
        const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            income: 0,
            expense: 0
        }));

        // 將有交易的資料填入
        transactions.forEach(t => {
            const index = dailyData.findIndex(d => d.day === t.day);
            if (index !== -1) {
                dailyData[index] = t;
            }
        });

        res.json(dailyData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 