import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, PackagePlus, PackageMinus, LayoutDashboard, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate(); // Add this line

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
                <Package className="h-6 w-6 mr-2" />
                <span className="font-semibold">Inventory Manager</span>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LayoutDashboard className="h-5 w-5 mr-1" />
                Stock Balance
              </Link>
              <Link
                to="/received"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <PackagePlus className="h-5 w-5 mr-1" />
                Stock Received
              </Link>
              <Link
                to="/issued"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <PackageMinus className="h-5 w-5 mr-1" />
                Stock Issued
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}