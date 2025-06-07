import React, { useContext, useEffect } from 'react';
import DashboardContext from '../context/dashboard/dashboardContext';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import AssetPieChart from '../components/dashboard/AssetPieChart';
import NetWorthTrendChart from '../components/dashboard/NetWorthTrendChart';

const Dashboard = () => {
  const dashboardContext = useContext(DashboardContext);
  const { 
    summary, 
    monthlyCategorySummary, 
    assetDistribution, 
    netWorthGrowth,
    loading, 
    getDashboardSummary,
    getMonthlyCategorySummary,
    getAssetDistribution,
    getNetWorthGrowth
  } = dashboardContext;

  useEffect(() => {
    getDashboardSummary();
    // 預設取得本月的分類支出
    const now = new Date();
    getMonthlyCategorySummary(now.getFullYear(), now.getMonth() + 1);
    getAssetDistribution();
    getNetWorthGrowth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !summary) {
      return <h2>讀取中...</h2>;
  }

  const pageStyle = {
    display: 'flex',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem'
  };

  return (
    <div style={pageStyle}>
      <h1>儀表板</h1>

      {/* 摘要資訊 */}
      {summary && (
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '2rem 0' }}>
            <div><h2>總資產</h2><p style={{color: 'green', fontSize: '1.5rem'}}>{summary.totalAssets.toLocaleString()}</p></div>
            <div><h2>總負債</h2><p style={{color: 'red', fontSize: '1.5rem'}}>{summary.totalLiabilities.toLocaleString()}</p></div>
            <div><h2>淨值</h2><p style={{color: 'blue', fontSize: '1.5rem'}}>{summary.netWorth.toLocaleString()}</p></div>
        </div>
      )}

      {/* TODO: 圖表區塊 */}
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '2rem 0' }}>
          <div>
            <h3>本月支出分佈</h3>
            <CategoryPieChart data={monthlyCategorySummary} />
          </div>
          <div>
            <h3>資產分佈</h3>
            <AssetPieChart data={assetDistribution} />
          </div>
      </div>
       <div>
            <h3>淨值成長趨勢</h3>
            <NetWorthTrendChart data={netWorthGrowth} />
        </div>
    </div>
  );
};

export default Dashboard; 