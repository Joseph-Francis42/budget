import React, { useState, useMemo } from "react";
import { Search, Download, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/helpers";

const ExpenseTable = ({ expenses, budgets, onDeleteExpense, itemsPerPage = 8 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState("all");
  const [sortField, setSortField] = useState("date"); // "date" or "amount"
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to map budget details
  const budgetDetails = useMemo(() => {
    return budgets.reduce((acc, curr) => {
      acc[curr.id] = { name: curr.name, color: curr.color };
      return acc;
    }, {});
  }, [budgets]);

  // Handle Filtering & Searching
  const processedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by budget category
    if (selectedBudgetId !== "all") {
      result = result.filter((exp) => exp.budgetId === selectedBudgetId);
    }

    // Search by name
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((exp) => 
        exp.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = sortField === "amount" ? a.amount : new Date(a.date).getTime();
      let valB = sortField === "amount" ? b.amount : new Date(b.date).getTime();

      if (sortDirection === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return result;
  }, [expenses, selectedBudgetId, searchTerm, sortField, sortDirection]);

  // Reset pagination if filters/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBudgetId, sortField, sortDirection]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(processedExpenses.length / itemsPerPage));
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [processedExpenses, currentPage, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending
    }
  };

  const handleExportCSV = () => {
    if (processedExpenses.length === 0) return;
    
    const headers = "Name,Budget Category,Amount ($),Date\n";
    const csvContent = processedExpenses
      .map((exp) => {
        const budgetInfo = budgetDetails[exp.budgetId] || { name: "Deleted Budget" };
        const safeName = exp.name.replace(/"/g, '""');
        const safeCategory = budgetInfo.name.replace(/"/g, '""');
        return `"${safeName}","${safeCategory}",${exp.amount},"${exp.date}"`;
      })
      .join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ledgerflow_expenses_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the expense "${name}"?`)) {
      onDeleteExpense(id);
    }
  };

  return (
    <div className="glass-card table-card">
      <div className="table-toolbar">
        <div className="search-filter-group">
          {/* Search bar */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search expenses by name..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Budget filter */}
          <div style={{ position: "relative", minWidth: "150px" }}>
            <select
              className="form-select"
              value={selectedBudgetId}
              onChange={(e) => setSelectedBudgetId(e.target.value)}
              style={{ paddingLeft: "32px" }}
            >
              <option value="all">All Budgets</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <Filter 
              size={14} 
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} 
            />
          </div>
        </div>

        <div className="table-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleExportCSV}
            disabled={processedExpenses.length === 0}
            title="Export filtered items to CSV spreadsheet"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {paginatedExpenses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
            <p>No matching expenses found.</p>
          </div>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Category</th>
                <th 
                  onClick={() => handleSort("amount")} 
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by Amount"
                >
                  Amount {sortField === "amount" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th 
                  onClick={() => handleSort("date")} 
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="Click to sort by Date"
                >
                  Date {sortField === "date" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.map((exp) => {
                const budgetInfo = budgetDetails[exp.budgetId] || { name: "General / Deleted", color: "slate" };
                return (
                  <tr key={exp.id} className="fade-in">
                    <td style={{ fontWeight: 500 }}>{exp.name}</td>
                    <td>
                      <span className={`budget-badge bg-${budgetInfo.color}-light`} style={{ color: `var(--color-${budgetInfo.color})` }}>
                        <span className={`budget-badge-dot bg-${budgetInfo.color}`} />
                        {budgetInfo.name}
                      </span>
                    </td>
                    <td className="expense-amount" style={{ color: "var(--text-primary)" }}>
                      {formatCurrency(exp.amount)}
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      {formatDate(exp.date)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn-delete-row"
                        onClick={() => handleDelete(exp.id, exp.name)}
                        title="Delete expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {processedExpenses.length > itemsPerPage && (
        <div className="table-pagination">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, processedExpenses.length)} of{" "}
            {processedExpenses.length} entries
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ display: "flex", alignItems: "center", padding: "0 8px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
