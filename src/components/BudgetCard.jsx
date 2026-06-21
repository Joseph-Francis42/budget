import React from "react";
import { 
  Wallet, ShoppingCart, Home, Car, Utensils, Tv, Gift, Briefcase, Trash2, Eye 
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/helpers";

const ICON_MAP = {
  Wallet,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Tv,
  Gift,
  Briefcase
};

const BudgetCard = ({ budget, spent, onDeleteBudget, onViewDetails, showActions = true }) => {
  const IconComponent = ICON_MAP[budget.icon] || Wallet;
  
  const total = budget.amount;
  const remaining = total - spent;
  const ratio = total > 0 ? spent / total : 0;
  
  // Decide progress bar status class
  let statusClass = "status-normal";
  if (ratio >= 1) {
    statusClass = "status-danger";
  } else if (ratio >= 0.75) {
    statusClass = "status-warning";
  }

  // Format percentage display (clamp between 0% and 100% or show actual if over)
  const percentageVal = Math.min(ratio, 1);
  const formattedPercent = formatPercentage(ratio);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the "${budget.name}" budget? This will delete all its expenses permanently.`)) {
      onDeleteBudget(budget.id);
    }
  };

  return (
    <div className={`budget-card theme-${budget.color || "indigo"}`}>
      <div className="budget-header">
        <div className="budget-info-title">
          <div className="budget-icon-circle">
            <IconComponent size={20} />
          </div>
          <div>
            <h3 className="budget-name">{budget.name}</h3>
            <span className="budget-limit-subtitle">Limit: {formatCurrency(total)}</span>
          </div>
        </div>

        <div className="budget-amounts">
          <span className="budget-spent">{formatCurrency(spent)}</span>
          <span className="budget-total">spent</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-track">
          <div 
            className={`progress-bar ${statusClass}`}
            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
          />
        </div>
        
        <div className={`progress-labels ${ratio >= 1 ? "danger" : ""}`}>
          <span>{formattedPercent} Spent</span>
          {remaining >= 0 ? (
            <span>{formatCurrency(remaining)} remaining</span>
          ) : (
            <span>{formatCurrency(Math.abs(remaining))} over limit</span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="budget-card-footer">
          <button 
            type="button" 
            className="btn-card-action"
            onClick={() => onViewDetails(budget)}
          >
            <Eye size={14} />
            View Details
          </button>
          
          <button 
            type="button" 
            className="btn-card-action danger"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
