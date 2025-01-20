import React, { useState } from 'react';
import { Search, TrendingUp, RefreshCcw, AlertCircle, Mail, Linkedin, Twitter } from 'lucide-react';
import StockDashboard from './components/StockDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/api/stock/${stockSymbol}`);
      if (!response.ok) throw new Error('Failed to fetch stock data');

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h1 className="text-xl font-semibold text-gray-900">Stock Analysis Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center max-w-md mx-auto bg-white rounded-lg shadow-sm">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                className="block w-full pl-10 pr-3 py-2 border-0 rounded-l-md leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Enter stock symbol (e.g., AAPL)"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : 'Analyze'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Stock Dashboard */}
        {stockData && !loading && (
          <div className="max-w-4xl mx-auto">
            <StockDashboard data={stockData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            {/* Copyright Text */}
            <p className="text-sm text-gray-500">
              © 2023 Stock Analysis Dashboard. All rights reserved.
            </p>

            {/* Your Info */}
            <div className="flex items-center space-x-4">
              {/* Name */}
              <p className="text-sm text-gray-500">Vedant Acharya</p>

              {/* Email */}
              <a
                href="mailto:vedant.acharya98@gmail.com"
                className="text-gray-500 hover:text-indigo-600 transition-all duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/vedantacharya45/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              {/* Twitter (X) */}
              <a
                href="https://x.com/acha223344"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;