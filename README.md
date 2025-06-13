# AssetX 專案

## 簡介

- ### 開發本系統的契機
  原本用來管理財務的工具為 Excel，發覺 Excel 並不能有效的快速的一眼看出自己的財務狀況，紀錄財務資訊也較為繁瑣。
  於是決定開發 AssetX 系統來有效的管理財務狀況，並且把數字圖像化，能夠更有效的理解數字表達的狀態。

## 技術棧
- **前端**: <img src="https://img.shields.io/badge/javascript-grey?style=for-the-badge&logo=javascript" alt="tag" height="20"/> <img src="https://img.shields.io/badge/mui-grey?style=for-the-badge&logo=mui" alt="tag" height="20"/> <img src="https://img.shields.io/badge/vite-grey?style=for-the-badge&logo=vite" alt="tag" height="20"/> <img src="https://img.shields.io/badge/npm-v11.4.0-blue" alt="tag" height="20"/> <img src="https://img.shields.io/badge/node-v22.14.0-blue" alt="tag" height="20"/>
- **後端**: <img src="https://img.shields.io/badge/node.js-grey?style=for-the-badge&logo=node.js" alt="tag" height="20"/> <img src="https://img.shields.io/badge/mongodb-grey?style=for-the-badge&logo=mongodb" alt="tag" height="20"/> <img src="https://img.shields.io/badge/npm-v11.4.0-blue" alt="tag" height="20"/> <img src="https://img.shields.io/badge/node-v22.14.0-blue" alt="tag" height="20"/>
- **容器化**: <img src="https://img.shields.io/badge/docker-grey?style=for-the-badge&logo=docker" alt="tag" height="20"/>
- **編排**: <img src="https://img.shields.io/badge/k8s-grey?style=for-the-badge&logo=kubernetes" alt="tag" height="20"/> <img src="https://img.shields.io/badge/skaffold-grey?style=for-the-badge&logo=skaffold" alt="tag" height="20"/>
- **自動化工具**: <img src="https://img.shields.io/badge/github action-grey?style=for-the-badge&logo=githubactions" alt="tag" height="20"/>

## 開發

若要在本機執行此專案，請確定您已安裝 Docker、Docker Compose 和 MongoDB。

1.  **Clone 專案**
   
     ```bash
      git clone https://github.com/your-username/AssetX.git
      ```
     
2.  **在後端跟目錄下新增.env檔案**
   
     ```bash
      MONGO_URI=<你自己的MongoDB_URI>
      JWT_SECRET=<你自己的JWT密鑰>
      PORT=5000
      ``` 

3.  **啟動服務**

    回到AssetX跟目錄，使用 Docker Compose 啟動所有服務：

    ```bash
    docker-compose up --build
    ```

4.  **存取應用程式**

    瀏覽器輸入： `http://localhost:9300`

## 範例圖片

<img width="1566" alt="截圖 2025-06-13 下午4 13 32" src="https://github.com/user-attachments/assets/1e9921ff-aa49-40c8-8934-26813b05736c" />
<img width="1566" alt="截圖 2025-06-13 下午4 13 35" src="https://github.com/user-attachments/assets/1f2874b9-4302-4050-8525-4016d1345ebb" />
<img width="1566" alt="截圖 2025-06-13 下午4 13 45" src="https://github.com/user-attachments/assets/3f926fee-1752-4b0a-89c6-14b1151396e9" />
<img width="1566" alt="截圖 2025-06-13 下午4 13 50" src="https://github.com/user-attachments/assets/983f5c9f-e161-487e-adc0-38401eff6f15" />
<img width="1566" alt="截圖 2025-06-13 下午4 13 59" src="https://github.com/user-attachments/assets/69400e47-815b-4ed7-809e-8c152314fbc1" />
<img width="1566" alt="截圖 2025-06-13 下午4 14 54" src="https://github.com/user-attachments/assets/1bae515b-2e40-4449-9dd3-2924501d1019" />
