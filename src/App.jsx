import React, { useState, useEffect } from "react";
import { X, Receipt, Wallet, Plus, ArrowLeft } from "lucide-react";

// Components
import WelcomeScreen from "./components/WelcomeScreen";
import Navigation from "./components/Navigation";
import DashboardOverview from "./components/DashboardOverview";
import BudgetCard from "./components/BudgetCard";
import ExpenseTable from "./components/ExpenseTable";
import AnalyticsView from "./components/AnalyticsView";
import CreateExpenseForm from "./components/CreateExpenseForm";

// Helpers
import { 
  fetchData, 
  saveData, 
  createBudget, 
  createExpense, 
  deleteItem, 
  calculateSpentByBudget 
} from "./utils/helpers";

function App() {
  const [userName, setUserName] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedBudgetDetail, setSelectedBudgetDetail] = useState(null);

  // Load initial data on mount
  useEffect(() => {
    const user = fetchData("userName");
    const storedBudgets = fetchData("budgets") || [];
    const storedExpenses = fetchData("expenses") || [];

    if (user) {
      setUserName(user);
    }
    setBudgets(storedBudgets);
    setExpenses(storedExpenses);
  }, []);

  // Onboarding username submit handler
  const handleUserSubmit = (name) => {
    saveData("userName", name);
    setUserName(name);
  };

  // Add a budget handler
  const handleAddBudget = ({ name, amount, color, icon }) => {
    const newBudget = createBudget({ name, amount, color, icon });
    setBudgets((prev) => [...prev, newBudget]);
  };

  // Add an expense handler
  const handleAddExpense = ({ name, amount, budgetId, date }) => {
    const newExpense = createExpense({ name, amount, budgetId, date });
    setExpenses((prev) => [...prev, newExpense]);
  };

  // Delete a budget handler
  const handleDeleteBudget = (id) => {
    deleteItem({ key: "budgets", id });
    // Update local state
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    setExpenses((prev) => prev.filter((e) => e.budgetId !== id));
    
    // Close detail modal if the deleted budget was open
    if (selectedBudgetDetail && selectedBudgetDetail.id === id) {
      setSelectedBudgetDetail(null);
    }
  };

  // Delete an expense handler
  const handleDeleteExpense = (id) => {
    deleteItem({ key: "expenses", id });
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Reset all dashboard data (Logout)
  const handleLogout = () => {
    if (
      window.confirm(
        "Warning: This will permanently delete ALL your budgets and expense records. This action cannot be undone. Are you sure you want to proceed?"
      )
    ) {
      localStorage.clear();
      setUserName(null);
      setBudgets([]);
      setExpenses([]);
      setActiveTab("dashboard");
      setSelectedBudgetDetail(null);
    }
  };

  // Helper calculation to pass down
  const calculateSpent = (budgetId) => {
    return expenses
      .filter((expense) => expense.budgetId === budgetId)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  // ESC key listener to close details modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedBudgetDetail(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Render Onboarding if username is missing
  if (!userName) {
    return <WelcomeScreen onSubmit={handleUserSubmit} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Navigation 
        userName={userName} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedBudgetDetail(null); // Close modal on tab change
        }}
        onLogout={handleLogout} 
      />

      {/* Main Panel Content */}
      <main className="main-content">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <DashboardOverview
            userName={userName}
            budgets={budgets}
            expenses={expenses}
            onAddBudget={handleAddBudget}
            onAddExpense={handleAddExpense}
            onDeleteBudget={handleDeleteBudget}
            onViewDetails={(budget) => setSelectedBudgetDetail(budget)}
            calculateSpent={calculateSpent}
          />
        )}

        {/* Budgets Grid Tab */}
        {activeTab === "budgets" && (
          <div className="fade-in">
            <div className="header-title-section">
              <div>
                <h1 className="greeting-text">Allocated Budgets</h1>
                <p className="subtitle-text">Monitor individual budget performance and limit margins.</p>
              </div>
            </div>
            
            {budgets.length === 0 ? (
              <div className="empty-state" style={{ marginTop: "40px" }}>
                <Wallet size={48} className="empty-state-icon" />
                <h3>No Budgets Created</h3>
                <p>Head to the Overview tab to create your first budget category.</p>
              </div>
            ) : (
              <div className="budgets-grid" style={{ marginTop: "24px" }}>
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    spent={calculateSpent(budget.id)}
                    onDeleteBudget={handleDeleteBudget}
                    onViewDetails={(b) => setSelectedBudgetDetail(b)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expenses Table Tab */}
        {activeTab === "expenses" && (
          <div className="fade-in">
            <div className="header-title-section">
              <div>
                <h1 className="greeting-text">All Expenses</h1>
                <p className="subtitle-text">Log, search, sort, and export your itemized expenditures.</p>
              </div>
            </div>
            
            {expenses.length === 0 ? (
              <div className="empty-state" style={{ marginTop: "40px" }}>
                <Receipt size={48} className="empty-state-icon" />
                <h3>No Expenses Logged</h3>
                <p>Create a budget and add expenses to populate this journal.</p>
              </div>
            ) : (
              <div style={{ marginTop: "12px" }}>
                <ExpenseTable
                  expenses={expenses}
                  budgets={budgets}
                  onDeleteExpense={handleDeleteExpense}
                />
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="fade-in">
            <div className="header-title-section">
              <div>
                <h1 className="greeting-text">Financial Analytics</h1>
                <p className="subtitle-text">Explore expenditures statistics and budget utilization metrics.</p>
              </div>
            </div>
            
            <div style={{ marginTop: "24px" }}>
              <AnalyticsView budgets={budgets} expenses={expenses} />
            </div>
          </div>
        )}
      </main>

      {/* Budget Details Modal Dialog */}
      {selectedBudgetDetail && (
        <div className="modal-overlay" onClick={() => setSelectedBudgetDetail(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Wallet size={20} className={`bg-${selectedBudgetDetail.color}-light`} style={{ color: `var(--color-${selectedBudgetDetail.color})`, padding: 4, borderRadius: 6 }} />
                <h2 style={{ fontSize: "1.25rem" }}>
                  Budget Category: {selectedBudgetDetail.name}
                </h2>
              </div>
              <button 
                type="button" 
                className="btn-close-modal" 
                onClick={() => setSelectedBudgetDetail(null)}
                title="Close modal (Esc)"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="dashboard-split-layout">
                {/* Left side details and quick add expense */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <BudgetCard
                    budget={selectedBudgetDetail}
                    spent={calculateSpent(selectedBudgetDetail.id)}
                    showActions={false}
                  />
                  
                  <CreateExpenseForm
                    budgets={[selectedBudgetDetail]}
                    onAddExpense={handleAddExpense}
                  />
                </div>

                {/* Right side expenses specifically for this category */}
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <Receipt size={16} />
                    Category Log ({expenses.filter(e => e.budgetId === selectedBudgetDetail.id).length})
                  </h3>
                  
                  <ExpenseTable
                    expenses={expenses.filter((e) => e.budgetId === selectedBudgetDetail.id)}
                    budgets={[selectedBudgetDetail]}
                    onDeleteExpense={handleDeleteExpense}
                    itemsPerPage={5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
