import React, { useState, useEffect } from 'react';
import { Send, Edit, Trash } from 'lucide-react';
import moment from 'moment';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

interface StockIssuedItem {
  id: number;
  stockReceived_id: number;
  qty: number;
  user: string;
  issued_Date: string;
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
    qty: '1',
    user: '',
    issued_Date: new Date().toISOString().split('T')[0]
  });
  const [editId, setEditId] = useState<number | null>(null);
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStockIssued();
    fetchStockBalance();
  }, []);

  const fetchStockIssued = async () => {
    const response = await fetch(`${SERVER_URL}/api/stock/issued`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setItems(data);
  };

  const fetchStockBalance = async () => {
    const response = await fetch(`${SERVER_URL}/api/stock/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setStockItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${SERVER_URL}/api/stock/issue/${editId}` : `${SERVER_URL}/api/stock/issue`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...formData,
        stockReceived_id: Number(formData.stockReceived_id),
        qty: Number(formData.qty),
      }),
    });

    if (response.ok) {
      setFormData({ stockReceived_id: '', qty: '1', user: '', issued_Date: new Date().toISOString().split('T')[0] });
      setEditId(null);
      fetchStockIssued();
      fetchStockBalance();
    }
  };

  const handleEdit = (item: StockIssuedItem) => {
    const issuedDate = item.issued_Date ? item.issued_Date.split('T')[0] : '';
    
    setFormData({
      stockReceived_id: item.stockReceived_id.toString(),
      qty: item.qty.toString(),
      user: item.user,
      issued_Date: issuedDate
    });
    setEditId(item.id);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`${SERVER_URL}/api/stock/issue/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      fetchStockIssued();
      fetchStockBalance();
    }
  };

  const getItemName = (stockReceived_id: number) => {
    const item = stockItems.find(item => item.id === stockReceived_id);
    return item ? item.itemName : 'Unknown';
  };

  const filterData  = items.filter(item => item.user.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stock Issued</h2>
      
      <form onSubmit={handleSubmit} className="bg-green-100 p-3 rounded-lg shadow-md mb-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Issued Date</label>
            <input
              type="date"
              value={formData.issued_Date}
              onChange={(e) => setFormData({ ...formData, issued_Date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {editId ? 'Update Stock' : 'Issue Stock'}
          </button>
        </div>
        </div>

      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Item Name</th>
              <th className="table-header">Quantity</th>
              <th className="table-header">User
              <input 
                  type="text" 
                  placeholder="Search Item Name" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="border p-2 rounded mx-2 bg-violet-200 text-black"
                />
              </th>
              <th className="table-header">Issued Date</th>
              {/* <th className="table-header">Created At</th> */}
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterData.map((item) => (
              <tr key={item.id}>
                <td className="table-cell">{item.id}</td>
                <td className="table-cell">{getItemName(item.stockReceived_id)}</td>
                <td className="table-cell">{item.qty}</td>
                <td className="table-cell">{item.user}</td>
                <td className="table-cell">
                  {moment(item.issued_Date).format('DD-MM-YYYY')}
                </td>
                {/* <td className="table-cell">
                  {new Date(item.created_at).toLocaleDateString()}
                </td> */}
                <td className="table-cell">
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
  );
}