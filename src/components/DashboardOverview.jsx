import React from "react";
import { DollarSign, Wallet, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import BudgetCard from "./BudgetCard";
import CreateBudgetForm from "./CreateBudgetForm";
import CreateExpenseForm from "./CreateExpenseForm";
import { formatCurrency } from "../utils/helpers";

const DashboardOverview = ({ 
  userName, 
  budgets, 
  expenses, 
  onAddBudget, 
  onAddExpense, 
  onDeleteBudget,
  onViewDetails,
  calculateSpent
}) => {

  // Calculate high level summaries
  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  
  // Decide whether overbudget
  const isOverBudget = totalSpent > totalBudget;

  return (
    <div className="dashboard-view fade-in">
      <div className="header-title-section">
        <div>
          <h1 className="greeting-text">Welcome back, {userName}</h1>
          <p className="subtitle-text">Here is a visual summary of your financial status.</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card budget">
          <div className="metric-icon-wrapper">
            <Wallet size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Budget</span>
            <span className="metric-value">{formatCurrency(totalBudget)}</span>
          </div>
        </div>

        <div className="metric-card spent">
          <div className="metric-icon-wrapper">
            <TrendingUp size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Expenses</span>
            <span className="metric-value">{formatCurrency(totalSpent)}</span>
          </div>
        </div>

        <div className={`metric-card ${isOverBudget ? "overbudget" : "remaining"}`}>
          <div className="metric-icon-wrapper">
            {isOverBudget ? <TrendingDown size={22} /> : <DollarSign size={22} />}
          </div>
          <div className="metric-info">
            <span className="metric-label">
              {isOverBudget ? "Over Budget" : "Remaining Allowance"}
            </span>
            <span className="metric-value">
              {isOverBudget 
                ? formatCurrency(totalSpent - totalBudget) 
                : formatCurrency(remainingBudget)
              }
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="dashboard-split-layout">
        <div className="forms-stack">
          <CreateBudgetForm onAddBudget={onAddBudget} />
          <CreateExpenseForm budgets={budgets} onAddExpense={onAddExpense} />
        </div>

        <div className="budgets-column">
          <div className="section-header">
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Active Budgets</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {budgets.length} categories configured
            </span>
          </div>

          {budgets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Wallet size={48} strokeWidth={1.5} />
              </div>
              <h3>No Budgets Set</h3>
              <p>Create a budget using the form to start mapping your expenses.</p>
            </div>
          ) : (
            <div className="budgets-grid">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  spent={calculateSpent(budget.id)}
                  onDeleteBudget={onDeleteBudget}
                  onViewDetails={onViewDetails}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
