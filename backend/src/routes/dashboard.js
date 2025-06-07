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
        twelveMonthsAgo.setDate(1); // 設定為 11 個月前那個月的第一天

        const netWorthData = await MonthlyNetWorth.find({
            userId: req.user.id,
            date: { $gte: twelveMonthsAgo }
        }).sort({ date: 'asc' });

        res.json(netWorthData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 