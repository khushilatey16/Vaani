import { useContext } from 'react';
import { ExpenseTrackerContext } from './context/context';
import { incomeCategories, expenseCategories, resetCategories } from './constants/categories';

const useTransactions = (title) => {
  resetCategories();
  
  // Get transactions from context
  const { transactions = [] } = useContext(ExpenseTrackerContext);
  
  // Filter transactions by type
  const transactionsPerType = transactions.filter((t) => t.type === title);
  
  // Calculate total
  const total = transactionsPerType.reduce((acc, currVal) => (acc += currVal.amount), 0);
  
  // Determine categories
  const categories = title === 'Income' ? incomeCategories : expenseCategories;

  // Add amounts to the respective categories
  transactionsPerType.forEach((t) => {
    const category = categories.find((c) => c.type === t.category);
    if (category) category.amount += t.amount;
  });

  // Filter categories with a non-zero amount
  const filteredCategories = categories.filter((c) => c.amount > 0);

  // Prepare chart data
  const chartData = filteredCategories.length > 0 ? {
    datasets: [{
      data: filteredCategories.map((c) => c.amount),
      backgroundColor: filteredCategories.map((c) => c.color),
    }],
    labels: filteredCategories.map((c) => c.type),
  } : null; // Return null if no valid data is found

  return { total, chartData };
};

export default useTransactions;