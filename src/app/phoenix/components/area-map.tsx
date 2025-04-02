import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function AreaMap() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Area Map</h2>
        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="relative h-64 bg-blue-50 rounded-lg overflow-hidden">
        {/* マップの表現 */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 水色のエリア */}
            <path d="M0 0 L400 0 L400 100 C350 120 300 90 250 110 C200 130 150 100 100 120 C50 140 0 110 0 130 Z" fill="#e0f2fe" />
            
            {/* 道路 */}
            <path d="M50 50 L350 50" stroke="#94a3b8" strokeWidth="4" />
            <path d="M50 50 L50 250" stroke="#94a3b8" strokeWidth="4" />
            <path d="M200 50 L200 250" stroke="#94a3b8" strokeWidth="4" />
            <path d="M50 150 L350 150" stroke="#94a3b8" strokeWidth="4" />
            <path d="M50 250 L350 250" stroke="#94a3b8" strokeWidth="4" />
            <path d="M350 50 L350 250" stroke="#94a3b8" strokeWidth="4" />
          </svg>
          
          {/* 物件マーカー */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* その他のマーカー */}
          <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
          </div>
          
          <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
          </div>
          
          <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
            <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
