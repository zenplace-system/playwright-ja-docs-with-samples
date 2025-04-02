import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function SalesCategory() {
  // 実際のアプリではChart.jsなどのライブラリを使用しますが、
  // ここではCSSで簡易的なドーナツチャートを作成します
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">House Sales Category</h2>
        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          {/* ドーナツチャートの表現 */}
          <div className="absolute inset-0 rounded-full border-[16px] border-blue-500"></div>
          <div className="absolute inset-0 rounded-full border-[16px] border-blue-300" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
          <div className="absolute inset-0 rounded-full border-[16px] border-blue-200" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }}></div>
          
          {/* 中央のテキスト */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-500">Total Home</span>
            <span className="text-3xl font-bold">75,350</span>
          </div>
        </div>
        
        {/* 凡例 */}
        <div className="mt-8 w-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>House Sales</span>
            </div>
            <span className="font-medium">30,893</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-300"></div>
              <span>House Rent</span>
            </div>
            <span className="font-medium">24,112</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-200"></div>
              <span>House Available</span>
            </div>
            <span className="font-medium">20,345</span>
          </div>
        </div>
      </div>
    </div>
  );
}
