const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 載入環境變數
dotenv.config();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// 連接至 MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB 已成功連接...');
  } catch (err) {
    console.error(err.message);
    // 讓應用程式在連線失敗時直接退出
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('後端伺服器已成功啟動！');
});

// 定義路由
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/accounts', require('./src/routes/accounts'));
app.use('/api/transactions', require('./src/routes/transactions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`伺服器正在 port ${PORT} 上運行`);
}); 