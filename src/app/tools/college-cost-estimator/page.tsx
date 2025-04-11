'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CostCategory {
  id: string;
  name: string;
  amount: number;
  isCustom: boolean;
}

const DEFAULT_CATEGORIES = [
  { name: 'Tuition', amount: 0 },
  { name: 'Room & Board', amount: 0 },
  { name: 'Books & Supplies', amount: 0 },
  { name: 'Transportation', amount: 0 },
  { name: 'Personal Expenses', amount: 0 },
  { name: 'Health Insurance', amount: 0 },
];

export default function CollegeCostEstimator() {
  const [categories, setCategories] = useState<CostCategory[]>(
    DEFAULT_CATEGORIES.map(cat => ({
      id: Date.now().toString() + Math.random(),
      name: cat.name,
      amount: cat.amount,
      isCustom: false,
    }))
  );
  const [newCategory, setNewCategory] = useState<Partial<CostCategory>>({
    name: '',
    amount: 0,
    isCustom: true,
  });

  const addCategory = () => {
    if (!newCategory.name) {
      alert('Please enter a category name');
      return;
    }

    const validAmount = Math.max(0, Number(newCategory.amount) || 0);

    const category: CostCategory = {
      id: Date.now().toString() + Math.random(),
      name: newCategory.name,
      amount: validAmount,
      isCustom: true,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', amount: 0, isCustom: true });
  };

  const updateCategory = (id: string, amount: number) => {
    const validAmount = Math.max(0, amount);
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, amount: validAmount } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category?.isCustom) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const totalCost = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Cost by Category',
        data: categories.map(cat => cat.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              College Cost Estimator
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Estimate and visualize your college expenses across different categories
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Cost Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Total Estimated Cost</h2>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">${totalCost.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cost Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Cost Categories</h2>
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category.name}
                      </label>
                      {category.isCustom && (
                        <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      min="0"
                      value={category.amount === 0 ? '' : category.amount}
                      onChange={(e) => updateCategory(category.id, parseFloat(e.target.value) || 0)}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {category.isCustom && (
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Delete custom category"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Category */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add Custom Category</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Category name"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    min="0"
                    value={newCategory.amount === 0 ? '' : newCategory.amount}
                    onChange={(e) => setNewCategory({ ...newCategory, amount: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Amount"
                  />
                </div>
                <button
                  onClick={addCategory}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Cost Breakdown</h2>
            <div className="h-80">
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 