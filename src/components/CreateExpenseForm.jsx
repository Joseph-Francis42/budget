import React, { useState } from "react";
import { PlusCircle, Receipt } from "lucide-react";

const CreateExpenseForm = ({ budgets, onAddExpense }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState(
    budgets.length > 0 ? budgets[0].id : ""
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep dropdown selection synchronized when budgets change
  React.useEffect(() => {
    if (budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].id);
    }
  }, [budgets, selectedBudgetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || !selectedBudgetId) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    onAddExpense({
      name: name.trim(),
      amount: parseFloat(amount),
      budgetId: selectedBudgetId,
      date,
    });

    // Reset Form
    setName("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsSubmitting(false);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">
        <Receipt size={20} style={{ color: "var(--color-teal)" }} />
        Add Expense
      </h2>

      {budgets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px 0", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>No active budgets found.</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Please create a budget first to start adding expenses.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="expenseName" className="form-label">
              Expense Name
            </label>
            <input
              type="text"
              id="expenseName"
              required
              placeholder="e.g. Starbucks, Groceries"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expenseAmount" className="form-label">
              Amount Spent ($)
            </label>
            <input
              type="number"
              id="expenseAmount"
              required
              min="0.01"
              step="0.01"
              placeholder="e.g. 15.50"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expenseBudget" className="form-label">
              Budget Category
            </label>
            <select
              id="expenseBudget"
              required
              className="form-select"
              value={selectedBudgetId}
              onChange={(e) => setSelectedBudgetId(e.target.value)}
              disabled={isSubmitting}
            >
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name} (${budget.amount})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label htmlFor="expenseDate" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="expenseDate"
              required
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isSubmitting}
            style={{ background: "linear-gradient(135deg, var(--color-teal), #0f766e)" }}
          >
            <PlusCircle size={18} />
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateExpenseForm;
