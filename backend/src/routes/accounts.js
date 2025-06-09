const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');

// @route   GET api/accounts
// @desc    取得該使用者的所有帳戶
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   POST api/accounts
// @desc    新增一個帳戶
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, type, initialBalance } = req.body;

  try {
    const newAccount = new Account({
      userId: req.user.id,
      name,
      type,
      initialBalance,
      balance: initialBalance, // 初始餘額等於初始金額
    });

    const account = await newAccount.save();
    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   PUT api/accounts/:id
// @desc    更新一個帳戶
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, type, initialBalance } = req.body;

  // 建立更新物件
  const accountFields = {};
  if (name) accountFields.name = name;
  if (type) accountFields.type = type;
  if (initialBalance !== undefined) {
      accountFields.initialBalance = initialBalance;
      // 注意：這裡我們假設更新初始金額時，也應該調整當前餘額。
      // 在有交易紀錄後，這裡的邏輯會需要更複雜的計算。
      accountFields.balance = initialBalance; 
  }

  try {
    let account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ msg: '找不到該帳戶' });
    }

    // 確保使用者擁有該帳戶
    if (account.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: '沒有權限' });
    }

    account = await Account.findByIdAndUpdate(
      req.params.id,
      { $set: accountFields },
      { new: true } // 回傳更新後的物件
    );

    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   DELETE api/accounts/:id
// @desc    刪除一個帳戶
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ msg: '找不到該帳戶' });
    }

    // 確保使用者擁有該帳戶
    if (account.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: '沒有權限' });
    }
    
    // TODO: 在刪除帳戶前，應先處理與該帳戶關聯的交易紀錄。
    // 目前我們先直接刪除帳戶。
    await Account.findByIdAndDelete(req.params.id);

    res.json({ msg: '帳戶已刪除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router; 