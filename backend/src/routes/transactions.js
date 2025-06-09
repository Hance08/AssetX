const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// @route   GET api/transactions
// @desc    取得該使用者的所有交易紀錄
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;

    let query = Transaction.find({ userId: req.user.id })
      .populate('accountId', 'name')
      .sort({ date: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const transactions = await query;
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   POST api/transactions
// @desc    新增一筆交易紀錄
// @access  Private
router.post('/', auth, async (req, res) => {
  // 新的 API 接收 type 和一個正數的 amount
  const { date, amount, category, accountId, notes, type } = req.body;

  try {
    // 驗證 amount 必須是正數
    if (amount <= 0) {
        return res.status(400).json({ msg: '金額必須為正數' });
    }

    // 1. 檢查帳戶是否存在且屬於該使用者
    const account = await Account.findById(accountId);
    if (!account || account.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: '找不到該帳戶或無權限' });
    }

    // 根據 type 決定實際儲存的金額 (支出為負數)
    const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    // 2. 建立新的交易
    const newTransaction = new Transaction({
      userId: req.user.id,
      date: date || new Date(), // 如果前端沒提供 date，就使用當下時間
      amount: finalAmount,
      category,
      accountId,
      notes,
    });

    const transaction = await newTransaction.save();

    // 3. 更新帳戶餘額
    await Account.findByIdAndUpdate(accountId, { $inc: { balance: finalAmount } });

    // 4. 填充新交易的 accountId 以便返回給前端
    const populatedTransaction = await Transaction.findById(transaction._id).populate('accountId', 'name');

    res.json(populatedTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   PUT api/transactions/:id
// @desc    更新一筆交易紀錄
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { date, amount, category, accountId, notes, type } = req.body;

  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: '找不到該交易紀錄' });
    }

    // 確保使用者擁有該交易紀錄
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: '沒有權限' });
    }

    const oldAmount = transaction.amount;
    const newAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    // 更新帳戶餘額：先撤銷舊的金額，再加上新的金額
    const account = await Account.findById(transaction.accountId);
    if(account) {
        account.balance = account.balance - oldAmount + newAmount;
        await account.save();
    }
    
    // 建立更新物件
    const transactionFields = { date, amount: newAmount, category, accountId, notes };

    let updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );

    // 填充更新後的交易，以便返回給前端
    updatedTransaction = await updatedTransaction.populate('accountId', 'name');

    res.json(updatedTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   DELETE api/transactions/:id
// @desc    刪除一筆交易紀錄
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: '找不到該交易紀錄' });
    }

    // 確保使用者擁有該交易紀錄
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: '沒有權限' });
    }

    // 更新帳戶餘額：將刪除的金額加回去
    await Account.findByIdAndUpdate(transaction.accountId, { $inc: { balance: -transaction.amount } });

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ msg: '交易紀錄已刪除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router; 