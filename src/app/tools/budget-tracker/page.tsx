'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
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
import { Pie } from 'react-chartjs-2';


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

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  isCustomCategory?: boolean;
  reason?: string;
}

const DEFAULT_INCOME_CATEGORIES = [
  'Allowance',
  'Part-time Job',
  'Scholarships',
  'Gifts',
  'Other Income'
];

const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'School Supplies',
  'Entertainment',
  'Shopping',
  'Other Expenses'
];

const BudgetTracker = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('budget-transactions', []);
  const [customCategories, setCustomCategories] = useLocalStorage<{
    income: string[];
    expense: string[];
  }>('budget-custom-categories', {
    income: [],
    expense: [],
  });
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
  });
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'semester'>('month');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const addTransaction = () => {
    if (newTransaction.description && newTransaction.amount > 0) {
      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString(),
      };
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        id: '',
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
    }
  };

  const getTimeframeTransactions = () => {
    const now = new Date();
    const cutoff = new Date();

    switch (timeframe) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'semester':
        cutoff.setMonth(now.getMonth() - 4);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= cutoff);
  };

  const calculateTotals = () => {
    const timeframeTransactions = getTimeframeTransactions();
    const income = timeframeTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = timeframeTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const calculateExpenseBreakdown = () => {
    const timeframeTransactions = getTimeframeTransactions();
    const expensesByCategory = timeframeTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      labels: Object.keys(expensesByCategory),
      datasets: [
        {
          data: Object.values(expensesByCategory),
          backgroundColor: [
            'rgba(52, 211, 153, 0.8)', // emerald
            'rgba(59, 130, 246, 0.8)', // blue
            'rgba(139, 92, 246, 0.8)', // purple
            'rgba(251, 146, 60, 0.8)', // orange
            'rgba(236, 72, 153, 0.8)', // pink
            'rgba(248, 113, 113, 0.8)', // red
          ],
          borderColor: [
            'rgba(52, 211, 153, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(248, 113, 113, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const { income, expenses, balance } = calculateTotals();

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const startEditing = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      ...transaction,
    });
  };

  const updateTransaction = () => {
    if (!editingTransaction || !newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedTransaction: Transaction = {
      ...editingTransaction,
      description: newTransaction.description,
      amount: Number(newTransaction.amount),
      type: newTransaction.type || 'expense',
      category: newTransaction.category,
      reason: newTransaction.reason || undefined,
    };

    setTransactions(transactions.map(t => 
      t.id === editingTransaction.id ? updatedTransaction : t
    ));

    setEditingTransaction(null);
    setNewTransaction({
      id: '',
      description: '',
      amount: 0,
      category: DEFAULT_EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    });
  };

  const cancelEditing = () => {
    setEditingTransaction(null);
    setNewTransaction({
      id: '',
      description: '',
      amount: 0,
      category: DEFAULT_EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Budget Tracker
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track your income and expenses to stay on top of your finances
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Income</h3>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ${income.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Expenses</h3>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              ${expenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Balance</h3>
            <p className={`mt-2 text-3xl font-bold ${
              balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              ${balance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Transaction Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value, isCustomCategory: false })}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {newTransaction.type === 'income' ? (
                      <>
                        {DEFAULT_INCOME_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                        {customCategories.income.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </>
                    ) : (
                      <>
                        {DEFAULT_EXPENSE_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                        {customCategories.expense.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </>
                    )}
                  </select>
                  <input
                    type="text"
                    value={newTransaction.isCustomCategory ? newTransaction.category : ''}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value, isCustomCategory: true })}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Custom category"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={editingTransaction ? updateTransaction : addTransaction}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
                {editingTransaction && (
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Expense Breakdown</h2>
            <div className="h-80">
              <Pie
                data={calculateExpenseBreakdown()}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: {
                        color: 'rgb(107, 114, 128)',
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'week' | 'month' | 'semester')}
              className="rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">Last Semester</option>
            </select>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {getTimeframeTransactions().map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEditing(transaction)}
                          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetTracker;