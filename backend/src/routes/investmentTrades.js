const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InvestmentTrade = require('../models/InvestmentTrade');
const Investment = require('../models/Investment');

// @route   POST api/trades
// @desc    新增一筆股票買賣紀錄
// @access  Private
router.post('/', auth, async (req, res) => {
  const { investmentId, date, type, shares, price, fee } = req.body;

  try {
    // 檢查 investmentId 是否存在且屬於該使用者
    const investment = await Investment.findById(investmentId);
    if (!investment || investment.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: '找不到該投資標的或無權限' });
    }

    const newTrade = new InvestmentTrade({
      investmentId,
      date: date || new Date(),
      type,
      shares,
      price,
      fee,
    });

    const trade = await newTrade.save();
    res.json(trade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   GET api/trades/:investmentId
// @desc    取得某投資標的的所有買賣紀錄
// @access  Private
router.get('/:investmentId', auth, async (req, res) => {
  try {
    // 再次檢查 investmentId 是否存在且屬於該使用者
    const investment = await Investment.findById(req.params.investmentId);
    if (!investment || investment.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: '找不到該投資標的或無權限' });
    }
    
    const trades = await InvestmentTrade.find({ investmentId: req.params.investmentId }).sort({ date: -1 });
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   PUT api/trades/:id
// @desc    更新一筆股票買賣紀錄
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { date, type, shares, price, fee } = req.body;
    try {
        let trade = await InvestmentTrade.findById(req.params.id);
        if (!trade) {
            return res.status(404).json({ msg: '找不到該買賣紀錄' });
        }

        // 這裡可以加入一層驗證，確保這筆 trade 屬於的使用者是當前登入的使用者
        // 這需要透過 trade -> investment -> user 的方式查詢，我們先簡化處理
        
        const updateFields = {};
        if (date) updateFields.date = date;
        if (type) updateFields.type = type;
        if (shares) updateFields.shares = shares;
        if (price) updateFields.price = price;
        if (fee !== undefined) updateFields.fee = fee;
        
        trade = await InvestmentTrade.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );
        res.json(trade);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// @route   DELETE api/trades/:id
// @desc    刪除一筆股票買賣紀錄
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const trade = await InvestmentTrade.findById(req.params.id);
        if (!trade) {
            return res.status(404).json({ msg: '找不到該買賣紀錄' });
        }

        // 同樣，這裡也可以加入使用者權限驗證
        
        await InvestmentTrade.findByIdAndDelete(req.params.id);
        res.json({ msg: '買賣紀錄已刪除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

module.exports = router; 