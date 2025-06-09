const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 從 header 中取得 token
  const token = req.header('x-auth-token');

  // 檢查 token 是否存在
  if (!token) {
    return res.status(401).json({ msg: '沒有 token，授權被拒絕' });
  }

  // 驗證 token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 將解碼後的使用者資訊附加到 request 物件上
    req.user = decoded.user;
    next(); // 呼叫 next() 讓請求繼續往下走
  } catch (err) {
    res.status(401).json({ msg: 'Token 無效' });
  }
}; 