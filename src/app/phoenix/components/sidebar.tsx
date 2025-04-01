import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Home, 
  BarChart2, 
  RefreshCw, 
  Inbox, 
  Calendar, 
  Settings, 
  HelpCircle, 
  Moon, 
  Sun, 
  LogOut 
} from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-white shadow-md flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Oemahin</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-400 font-medium mb-2 px-2">MAIN MENU</p>
          <nav className="space-y-1">
            <Link href="/phoenix" className="flex items-center gap-3 p-2 rounded-lg bg-blue-600 text-white">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link href="/phoenix/house" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Home size={20} />
              <span>House</span>
            </Link>
            <Link href="/phoenix/insight" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <BarChart2 size={20} />
              <span>Insight</span>
            </Link>
            <Link href="/phoenix/reimburse" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <RefreshCw size={20} />
              <span>Reimburse</span>
            </Link>
            <Link href="/phoenix/inbox" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Inbox size={20} />
              <span>Inbox</span>
            </Link>
            <Link href="/phoenix/calendar" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Calendar size={20} />
              <span>Calender</span>
            </Link>
          </nav>
        </div>

        <div className="px-4 py-2 mb-4">
          <p className="text-xs text-gray-400 font-medium mb-2 px-2">PREFERENCES</p>
          <nav className="space-y-1">
            <Link href="/phoenix/settings" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            <Link href="/phoenix/help" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <HelpCircle size={20} />
              <span>Help & Center</span>
            </Link>
            <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <Moon size={20} />
              <span>Dark Mode</span>
              <div className="ml-auto flex items-center">
                <div className="w-10 h-5 bg-blue-600 rounded-full p-1 flex items-center">
                  <div className="bg-white w-3 h-3 rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="mt-6">
            <Link href="/phoenix/logout" className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <LogOut size={20} />
              <span>Log Out</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
