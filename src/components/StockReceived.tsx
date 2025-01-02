import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

interface StockReceivedItem {
  id: number;
  bill_id: string;
  itemName: string;
  qty: number;
  price: number;
  amt: number;
  received_Date: string;
  created_at: string;
}

export function StockReceived() {
  const [items, setItems] = useState<StockReceivedItem[]>([]);
  const [formData, setFormData] = useState({
    bill_id: '',
    itemName: '',
    qty: '1',
    price: '',
    received_Date: new Date().toISOString().split('T')[0]
  });
  const [editId, setEditId] = useState<number | null>(null);
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  useEffect(() => {
    fetchStockReceived();
  }, []);

  const fetchStockReceived = async () => {
    const response = await fetch('http://localhost:3000/api/stock/received', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:3000/api/stock/receive/${editId}` : 'http://localhost:3000/api/stock/receive';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...formData,
        qty: Number(formData.qty),
        price: Number(formData.price),
      }),
    });

    if (response.ok) {
      setFormData({ bill_id: '', itemName: '', qty: '1', price: '', received_Date: new Date().toISOString().split('T')[0] });
      setEditId(null);
      fetchStockReceived();
    }
  };

  const handleEdit = (item: StockReceivedItem) => {
    const receivedDate = item.received_Date ? item.received_Date.split('T')[0] : '';
    
    setFormData({
      bill_id: item.bill_id,
      itemName: item.itemName,
      qty: item.qty.toString(),
      price: item.price.toString(),
      received_Date: receivedDate
    });
    setEditId(item.id);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`http://localhost:3000/api/stock/receive/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      fetchStockReceived();
    }
  };

  return (
    <>    
    <div>
      <h2 className="text-2xl font-bold mb-6">Stock Received</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bill ID</label>
            <input
              type="text"
              value={formData.bill_id}
              onChange={(e) => setFormData({ ...formData, bill_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
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
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Date</label>
            <input
              type="date"
              value={formData.received_Date}
              onChange={(e) => setFormData({ ...formData, received_Date: e.target.value })}
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
            <Plus className="h-4 w-4 mr-2" />
            {editId ? 'Update Stock' : 'Add Stock'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bill_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.amt.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.received_Date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-2">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <hr />
    <pre>
      {JSON.stringify(formData, null, 2)}
    </pre>
    </>
  );
}