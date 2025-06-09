const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Dividend = require('../models/Dividend');
const Investment = require('../models/Investment');

// @route   POST api/dividends
// @desc    新增一筆配息紀錄
// @access  Private
router.post('/', auth, async (req, res) => {
  const { investmentId, date, amount } = req.body;

  try {
    // 檢查 investmentId 是否存在且屬於該使用者
    const investment = await Investment.findById(investmentId);
    if (!investment || investment.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: '找不到該投資標的或無權限' });
    }

    const newDividend = new Dividend({
      investmentId,
      date: date || new Date(),
      amount,
    });

    const dividend = await newDividend.save();
    res.json(dividend);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   GET api/dividends/:investmentId
// @desc    取得某投資標的的所有配息紀錄
// @access  Private
router.get('/:investmentId', auth, async (req, res) => {
  try {
    // 再次檢查 investmentId 是否存在且屬於該使用者
    const investment = await Investment.findById(req.params.investmentId);
    if (!investment || investment.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: '找不到該投資標的或無權限' });
    }

    const dividends = await Dividend.find({ investmentId: req.params.investmentId }).sort({ date: -1 });
    res.json(dividends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   PUT api/dividends/:id
// @desc    更新一筆配息紀錄
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { date, amount } = req.body;
    try {
        let dividend = await Dividend.findById(req.params.id);
        if (!dividend) {
            return res.status(404).json({ msg: '找不到該配息紀錄' });
        }

        // 權限驗證可在此加入
        
        const updateFields = {};
        if (date) updateFields.date = date;
        if (amount) updateFields.amount = amount;
        
        dividend = await Dividend.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );
        res.json(dividend);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// @route   DELETE api/dividends/:id
// @desc    刪除一筆配息紀錄
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const dividend = await Dividend.findById(req.params.id);
        if (!dividend) {
            return res.status(404).json({ msg: '找不到該配息紀錄' });
        }

        // 權限驗證可在此加入
        
        await Dividend.findByIdAndDelete(req.params.id);
        res.json({ msg: '配息紀錄已刪除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

module.exports = router; 