import React, { useState, useEffect } from 'react';

interface StockBalanceItem {
  id: number;
  itemName: string;
  received_qty: number;
  issued_qty: number;
  balance_qty: number;
  price: number;
  amt: number;
}

export function StockBalance() {
  const [items, setItems] = useState<StockBalanceItem[]>([]);

  useEffect(() => {
    fetchStockBalance();
  }, []);

  const fetchStockBalance = async () => {
    const response = await fetch('http://localhost:3000/api/stock/balance');
    const data = await response.json();
    setItems(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stock Balance</h2>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.received_qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.issued_qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.balance_qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(item.balance_qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}