import { useState, useEffect } from 'react';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
  const [searchTerm, setSearchTerm] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<number | null>(null);
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  useEffect(() => {
    if (token) {
      fetchStockBalance();
    } else {
      console.error('No token found');
    }
  }, [token]);

  const fetchStockBalance = async () => {
    const response = await fetch(`${SERVER_URL}/api/stock/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 403) {
      console.error('Access forbidden: Invalid token');
      return;
    }
    if (response.ok) {
      const data = await response.json();
      setItems(data);
    } else {
      console.error('Failed to fetch stock balance');
    }
  };

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (balanceFilter === null || item.balance_qty >= balanceFilter)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stock Balance</h2>
      
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search Item Name" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="border p-2 rounded"
        />
        <input 
          type="number" 
          placeholder="Filter by Balance" 
          value={balanceFilter !== null ? balanceFilter : ''} 
          onChange={(e) => setBalanceFilter(e.target.value ? parseInt(e.target.value) : null)} 
          className="border p-2 rounded ml-2"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Item Name</th>
              <th className="table-header">Received</th>
              <th className="table-header">Issued</th>
              <th className="table-header">Balance</th>
              <th className="table-header">Unit Price</th>
              <th className="table-header">Total Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="table-cell">{item.itemName}</td>
                <td className="table-cell">{item.received_qty}</td>
                <td className="table-cell">{item.issued_qty}</td>
                <td className="table-cell">{item.balance_qty}</td>
                <td className="table-cell">Rs. {item.price.toFixed(2)}</td>
                <td className="table-cell">
                  Rs. {(item.balance_qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}