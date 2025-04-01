import React from 'react';
import { MoreHorizontal, ChevronDown, Check, Clock, AlertCircle } from 'lucide-react';

type Transaction = {
  id: number;
  type: 'House Sales' | 'House Rent';
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'On Hold';
  image: string;
};

export default function TransactionHistory() {
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'House Sales',
      date: 'Jun 29, 2022',
      amount: '$11,700.00',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      type: 'House Rent',
      date: 'Jun 17, 2022',
      amount: '$650.00',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      type: 'House Sales',
      date: 'Jun 09, 2022',
      amount: '$12,500.00',
      status: 'On Hold',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      type: 'House Sales',
      date: 'Jun 01, 2022',
      amount: '$13,100.00',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    }
  ];

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>;
      case 'Pending':
        return <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>;
      case 'On Hold':
        return <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>1 Jan - 30 Jun 2022</span>
          <MoreHorizontal size={18} />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">Transactions</th>
              <th className="pb-3 font-medium">
                <div className="flex items-center gap-1">
                  Date <ChevronDown size={16} />
                </div>
              </th>
              <th className="pb-3 font-medium">
                <div className="flex items-center gap-1">
                  Amount <ChevronDown size={16} />
                </div>
              </th>
              <th className="pb-3 font-medium">
                <div className="flex items-center gap-1">
                  Status <ChevronDown size={16} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b last:border-b-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={transaction.image} 
                        alt={transaction.type} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{transaction.type}</span>
                  </div>
                </td>
                <td className="py-4">{transaction.date}</td>
                <td className="py-4">{transaction.amount}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    {getStatusIcon(transaction.status)}
                    <span>{transaction.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
