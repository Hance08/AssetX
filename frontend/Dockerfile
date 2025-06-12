# --- STAGE 1: Build ---
# 使用官方輕量級的 Node.js 18 版本作為建置環境
FROM node:22-alpine AS builder

# 在容器中設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json (如果有的話)
COPY package*.json ./

# 安裝所有相依套件
RUN npm install

# 複製所有前端原始碼到工作目錄
COPY . .

# 執行 Vite 的建置命令，產生優化過的靜態檔案
RUN npm run build

# --- STAGE 2: Production ---
# 使用輕量級的 Nginx 伺服器作為正式環境的基礎映像
FROM nginx:stable-alpine

# 將前一個 "builder" 階段中 /app/dist 目錄下的所有建置成果，
# 複製到 Nginx 預設的網站內容目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自訂的 Nginx 設定檔，以支援 React Router 這類的 SPA 路由
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 向 Docker 宣告容器將會監聽 80 port
EXPOSE 80

# 啟動 Nginx 伺服器，並讓它保持在前景色執行
CMD ["nginx", "-g", "daemon off;"] 