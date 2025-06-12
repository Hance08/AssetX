# AssetX 專案

## 簡介

- ### 開發本系統的契機
  原本用來管理財務的工具為 Excel，發覺 Excel 並不能有效的快速的一眼看出自己的財務狀況，紀錄財務資訊也較為繁瑣。
  於是決定開發 AssetX 系統來有效的管理財務狀況，並且把數字圖像化，能夠更有效的理解數字表達的狀態。
- ### 範例圖片

## 技術棧
- **前端**: <img src="https://img.shields.io/badge/javascript-grey?style=for-the-badge&logo=javascript" alt="tag" height="20"/> <img src="https://img.shields.io/badge/mui-grey?style=for-the-badge&logo=mui" alt="tag" height="20"/> <img src="https://img.shields.io/badge/vite-grey?style=for-the-badge&logo=vite" alt="tag" height="20"/> <img src="https://img.shields.io/badge/npm-v11.4.0-blue" alt="tag" height="20"/> <img src="https://img.shields.io/badge/node-v22.14.0-blue" alt="tag" height="20"/>
- **後端**: <img src="https://img.shields.io/badge/node.js-grey?style=for-the-badge&logo=node.js" alt="tag" height="20"/> <img src="https://img.shields.io/badge/mongodb-grey?style=for-the-badge&logo=mongodb" alt="tag" height="20"/> <img src="https://img.shields.io/badge/npm-v11.4.0-blue" alt="tag" height="20"/> <img src="https://img.shields.io/badge/node-v22.14.0-blue" alt="tag" height="20"/>
- **容器化**: <img src="https://img.shields.io/badge/docker-grey?style=for-the-badge&logo=docker" alt="tag" height="20"/>
- **編排**: <img src="https://img.shields.io/badge/k8s-grey?style=for-the-badge&logo=kubernetes" alt="tag" height="20"/> <img src="https://img.shields.io/badge/skaffold-grey?style=for-the-badge&logo=skaffold" alt="tag" height="20"/>
- **自動化工具**: <img src="https://img.shields.io/badge/github action-grey?style=for-the-badge&logo=githubactions" alt="tag" height="20"/>

## 開發

若要在本機執行此專案，請確定您已安裝 Docker 和 Docker Compose。

1.  **Clone 專案**

    ```bash
    git clone https://github.com/your-username/AssetX.git
    cd AssetX
    ```

2.  **啟動服務**

    使用 Docker Compose 啟動所有服務：

    ```bash
    docker-compose up --build
    ```

3.  **存取應用程式**
    - **前端**: `http://localhost:9300`
    - **後端**: `http://localhost:5000`

## 部署

此專案已設定為使用 Skaffold 進行 Kubernetes 部署。有關詳細資訊，請參閱 `skaffold.yaml` 和 `k8s/` 目錄中的設定檔。
