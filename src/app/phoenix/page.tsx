import React from 'react';
import Sidebar from './components/sidebar';
import Header from './components/header';
import HouseCategory from './components/house-category';
import SalesCategory from './components/sales-category';
import TransactionHistory from './components/transaction-history';
import AreaMap from './components/area-map';

export default function DashboardPage() {
  return (
    <>
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="grid grid-cols-12 gap-6">
            {/* 物件カテゴリー */}
            <div className="col-span-8">
              <HouseCategory />
            </div>
            
            {/* 売上カテゴリー */}
            <div className="col-span-4">
              <SalesCategory />
            </div>
            
            {/* 取引履歴 */}
            <div className="col-span-8">
              <TransactionHistory />
            </div>
            
            {/* エリアマップ */}
            <div className="col-span-4">
              <AreaMap />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
