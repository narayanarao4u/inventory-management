import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface StockIssuedItem {
  id: number;
  stockReceived_id: number;
  qty: number;
  user: string;
  created_at: string;
}

interface StockReceivedItem {
  id: number;
  itemName: string;
  balance_qty: number;
}

export function StockIssued() {
  const [items, setItems] = useState<StockIssuedItem[]>([]);
  const [stockItems, setStockItems] = useState<StockReceivedItem[]>([]);
  const [formData, setFormData] = useState({
    stockReceived_id: '',
    qty: '',
    user: ''
  });

  useEffect(() => {
    fetchStockIssued();
    fetchStockBalance();
  }, []);

  const fetchStockIssued = async () => {
    const response = await fetch('http://localhost:3000/api/stock/issued');
    const data = await response.json();
    setItems(data);
  };

  const fetchStockBalance = async () => {
    const response = await fetch('http://localhost:3000/api/stock/balance');
    const data = await response.json();
    setStockItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/api/stock/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        stockReceived_id: Number(formData.stockReceived_id),
        qty: Number(formData.qty),
      }),
    });

    if (response.ok) {
      setFormData({ stockReceived_id: '', qty: '', user: '' });
      fetchStockIssued();
      fetchStockBalance();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stock Issued</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <select
              value={formData.stockReceived_id}
              onChange={(e) => setFormData({ ...formData, stockReceived_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an item</option>
              {stockItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName} (Available: {item.balance_qty})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <input
              type="text"
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Issue Stock
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stockReceived_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}