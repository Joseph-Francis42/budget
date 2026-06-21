/**
 * Helper function to fetch data from localStorage
 * @param {string} key - The localStorage key
 * @returns {Array|Object|null} The parsed data or null
 */
export const fetchData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Helper function to save data to localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 */
export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Helper function to generate a random UUID-like string
 * @returns {string} A random string ID
 */
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Creates a new budget and stores it in localStorage
 * @param {Object} budget - The budget object { name, amount, icon, color }
 * @returns {Object} The created budget
 */
export const createBudget = ({ name, amount, icon, color }) => {
  const budgets = fetchData("budgets") || [];
  const newBudget = {
    id: generateId(),
    name,
    amount: parseFloat(amount),
    icon: icon || "Wallet",
    color: color || "indigo",
    createdAt: new Date().toISOString(),
  };
  
  saveData("budgets", [...budgets, newBudget]);
  return newBudget;
};

/**
 * Creates a new expense and stores it in localStorage
 * @param {Object} expense - The expense object { name, amount, budgetId, date }
 * @returns {Object} The created expense
 */
export const createExpense = ({ name, amount, budgetId, date }) => {
  const expenses = fetchData("expenses") || [];
  const newExpense = {
    id: generateId(),
    name,
    amount: parseFloat(amount),
    budgetId,
    date: date || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };
  
  saveData("expenses", [...expenses, newExpense]);
  return newExpense;
};

/**
 * Deletes an item from localStorage.
 * If deleting a budget, it also deletes all associated expenses.
 * @param {Object} param0 - { key, id }
 */
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key) || [];
  
  if (key === "budgets") {
    // Delete budget
    const filteredBudgets = existingData.filter((item) => item.id !== id);
    saveData("budgets", filteredBudgets);
    
    // Cascading delete: delete all expenses associated with this budget
    const expenses = fetchData("expenses") || [];
    const filteredExpenses = expenses.filter((expense) => expense.budgetId !== id);
    saveData("expenses", filteredExpenses);
  } else {
    // Delete generic item (e.g. expenses)
    const filteredData = existingData.filter((item) => item.id !== id);
    saveData(key, filteredData);
  }
};

/**
 * Calculates total amount spent for a given budget ID
 * @param {string} budgetId - The budget ID
 * @returns {number} The total spent amount
 */
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") || [];
  return expenses
    .filter((expense) => expense.budgetId === budgetId)
    .reduce((acc, curr) => acc + curr.amount, 0);
};

/**
 * Formats a number to USD currency format
 * @param {number} amount - The numeric amount
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

/**
 * Formats a decimal number as percentage (e.g. 0.75 -> 75%)
 * @param {number} value - The ratio value
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value || 0);
};

/**
 * Formats an ISO date string to a local readable date
 * @param {string} dateString - ISO date string or date format
 * @returns {string} Formatted date (e.g. "Jun 21, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC", // Use UTC to prevent local timezone offset shifts
  });
};
