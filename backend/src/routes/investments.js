const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const InvestmentTrade = require('../models/InvestmentTrade');
const Dividend = require('../models/Dividend');
const mongoose = require('mongoose');
const yahooFinance = require('yahoo-finance2').default;

// @route   POST api/investments
// @desc    新增一個投資標的
// @access  Private
router.post('/', auth, async (req, res) => {
  const { symbol, name } = req.body;

  try {
    // 檢查同一個使用者是否已新增過相同的標的
    let investment = await Investment.findOne({ userId: req.user.id, symbol });
    if (investment) {
      return res.status(400).json({ msg: '此投資標的已存在' });
    }

    const newInvestment = new Investment({
      userId: req.user.id,
      symbol,
      name,
    });

    investment = await newInvestment.save();
    res.json(investment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   GET api/investments/price/:symbol
// @desc    取得指定股票代號的即時股價
// @access  Private
router.get('/price/:symbol', auth, async (req, res) => {
  try {
    let symbol = req.params.symbol.toUpperCase();

    // 判斷是否為台股（4～5位數字），才加上 .TW
    if (/^[0-9]{4,5}$/.test(symbol)) {
      symbol += '.TW';
    }
    
    const result = await yahooFinance.quote(symbol);

    if (!result || !result.regularMarketPrice) {
      // If no result or no price, return a default or an error
      // For now, let's return a default price of 0 to avoid breaking frontend logic
      return res.json({ price: 0 });
    }
    
    res.json({ price: result.regularMarketPrice });
  } catch (err) {
    console.error(`Error fetching price for ${req.params.symbol}:`, err.message);
    // Even if there's an error, return a default price to prevent frontend from breaking
    res.json({ price: 0 });
  }
});

// @route   GET api/investments
// @desc    取得該使用者的所有投資標的，並計算總成本和股數
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.aggregate([
      // 1. 找到該使用者的所有投資標的
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      // 2. 從 InvestmentTrade collection 中查找相關交易
      {
        $lookup: {
          from: 'investmenttrades', // The name of the collection in the DB
          localField: '_id',
          foreignField: 'investmentId',
          as: 'trades'
        }
      },
      // 3. 計算每個投資標的的總成本和總股數
      {
        $addFields: {
          totalCost: {
            $sum: {
              $map: {
                input: '$trades',
                as: 'trade',
                in: {
                  $cond: [
                    { $eq: ['$$trade.type', 'buy'] },
                    { $add: [{ $multiply: ['$$trade.shares', '$$trade.price'] }, '$$trade.fee'] },
                    { $subtract: [0, { $subtract: [{ $multiply: ['$$trade.shares', '$$trade.price'] }, '$$trade.fee'] }] }
                  ]
                }
              }
            }
          },
          totalShares: {
            $sum: {
              $map: {
                input: '$trades',
                as: 'trade',
                in: {
                  $cond: [
                    { $eq: ['$$trade.type', 'buy'] },
                    '$$trade.shares',
                    { $subtract: [0, '$$trade.shares'] }
                  ]
                }
              }
            }
          }
        }
      },
      // 4. 移除 trades 陣列，精簡回傳的資料
      {
        $project: {
          trades: 0
        }
      },
      // 5. 排序
      { $sort: { symbol: 1 } }
    ]);
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   GET api/investments/:id
// @desc    取得單一投資標的，並計算總成本和股數
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const investmentId = new mongoose.Types.ObjectId(req.params.id);
    const result = await Investment.aggregate([
      // 1. 根據 ID 找到特定的投資標的
      { $match: { _id: investmentId, userId: new mongoose.Types.ObjectId(req.user.id) } },
      // 2. 從 InvestmentTrade collection 中查找相關交易
      {
        $lookup: {
          from: 'investmenttrades',
          localField: '_id',
          foreignField: 'investmentId',
          as: 'trades'
        }
      },
      // 3. 計算總成本和總股數
      {
        $addFields: {
          totalCost: {
            $sum: {
              $map: {
                input: '$trades',
                as: 'trade',
                in: {
                  $cond: [
                    { $eq: ['$$trade.type', 'buy'] },
                    { $add: [{ $multiply: ['$$trade.shares', '$$trade.price'] }, '$$trade.fee'] },
                    { $subtract: [0, { $subtract: [{ $multiply: ['$$trade.shares', '$$trade.price'] }, '$$trade.fee'] }] }
                  ]
                }
              }
            }
          },
          totalShares: {
            $sum: {
              $map: {
                input: '$trades',
                as: 'trade',
                in: {
                  $cond: [
                    { $eq: ['$$trade.type', 'buy'] },
                    '$$trade.shares',
                    { $subtract: [0, '$$trade.shares'] }
                  ]
                }
              }
            }
          }
        }
      },
      // 4. 移除 trades 陣列
      { $project: { trades: 0 } }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ msg: '找不到該投資標的' });
    }

    res.json(result[0]); // 回傳單一物件
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   PUT api/investments/:id
// @desc    更新一個投資標的
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, symbol } = req.body;

  try {
    let investment = await Investment.findById(req.params.id);
    if (!investment) {
      return res.status(404).json({ msg: '找不到該投資標的' });
    }
    if (investment.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: '沒有權限' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (symbol) updateFields.symbol = symbol;

    investment = await Investment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(investment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   DELETE api/investments/:id
// @desc    刪除一個投資標的及其所有相關紀錄
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) {
      return res.status(404).json({ msg: '找不到該投資標的' });
    }
    if (investment.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: '沒有權限' });
    }

    // 刪除與此投資標的關聯的 Trades 和 Dividends
    await InvestmentTrade.deleteMany({ investmentId: req.params.id });
    await Dividend.deleteMany({ investmentId: req.params.id });

    // 刪除投資標的本身
    await Investment.findByIdAndDelete(req.params.id);

    res.json({ msg: '投資標的及其相關紀錄已刪除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router; 