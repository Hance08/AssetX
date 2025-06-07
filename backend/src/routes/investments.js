const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const InvestmentTrade = require('../models/InvestmentTrade');
const Dividend = require('../models/Dividend');

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

// @route   GET api/investments
// @desc    取得該使用者的所有投資標的
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id }).sort({ symbol: 1 });
    res.json(investments);
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