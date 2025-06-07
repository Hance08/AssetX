const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // 引入 auth 中介軟體

// @route   GET api/auth
// @desc    透過 token 取得登入的使用者資訊
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // auth 中介軟體已經驗證了 token，並將 user id 附加到 req.user 上
    // 我們可以透過 req.user.id 來查詢使用者資料，-password 表示排除密碼欄位
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   POST api/auth/register
// @desc    註冊新使用者
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 檢查使用者是否已存在
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: '使用者已存在' });
    }

    // 建立新使用者實例
    user = new User({
      username,
      password,
    });

    // 加密密碼
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 儲存至資料庫
    await user.save();

    // 產生 JWT Token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' }, // Token 有效期限
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// @route   POST api/auth/login
// @desc    登入使用者並取得 token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 檢查使用者是否存在
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: '無效的帳號或密碼' });
    }

    // 比對密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '無效的帳號或密碼' });
    }

    // 回傳 JWT Token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router; 