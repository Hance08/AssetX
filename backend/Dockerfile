# 使用官方輕量級的 Node.js 18 LTS 版本作為基礎映像
FROM node:22-alpine

# 在容器中建立一個工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json (如果有的話)
# 利用 Docker 的快取機制，只有在這些文件變更時才會重新執行 npm install
COPY package*.json ./

# 安裝專案相依套件
RUN npm install

# 將後端專案的根目錄下的所有程式碼複製到工作目錄中
# 這包括 server.js, src/, config/ 等等
COPY . .

# 向 Docker 宣告容器在執行時會監聽的網路連接埠
# 根據我們之前的分析，後端服務會使用 5001 port
EXPOSE 5000

# 定義容器啟動時要執行的命令
# "npm", "start" 等同於在終端機執行 npm start，也就是 "node server.js"
CMD [ "npm", "start" ] 