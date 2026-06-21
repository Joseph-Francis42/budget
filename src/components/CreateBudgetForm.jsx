import React, { useState } from "react";
import { 
  Wallet, ShoppingCart, Home, Car, Utensils, Tv, Gift, Briefcase, PlusCircle 
} from "lucide-react";

// List of available icons and their Lucide components
const ICON_LIST = [
  { name: "Wallet", component: Wallet },
  { name: "ShoppingCart", component: ShoppingCart },
  { name: "Home", component: Home },
  { name: "Car", component: Car },
  { name: "Utensils", component: Utensils },
  { name: "Tv", component: Tv },
  { name: "Gift", component: Gift },
  { name: "Briefcase", component: Briefcase },
];

const COLORS = [
  "indigo", "teal", "emerald", "amber", "rose", 
  "purple", "blue", "slate", "sky", "pink"
];

const CreateBudgetForm = ({ onAddBudget }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState("indigo");
  const [selectedIcon, setSelectedIcon] = useState("Wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    setIsSubmitting(true);
    // Simulate slight network delay for smooth experience
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    onAddBudget({
      name: name.trim(),
      amount: parseFloat(amount),
      color: selectedColor,
      icon: selectedIcon,
    });

    // Reset Form
    setName("");
    setAmount("");
    setSelectedColor("indigo");
    setSelectedIcon("Wallet");
    setIsSubmitting(false);
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">
        <PlusCircle size={20} className="bg-indigo-light" style={{ color: "var(--color-indigo)" }} />
        Create Budget
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="budgetName" className="form-label">
            Budget Name
          </label>
          <input
            type="text"
            id="budgetName"
            required
            placeholder="e.g. Groceries, Utilities, Rent"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="budgetAmount" className="form-label">
            Amount Limit ($)
          </label>
          <input
            type="number"
            id="budgetAmount"
            required
            min="0"
            step="0.01"
            placeholder="e.g. 350.00"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Color Theme Selector */}
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label className="form-label">Color Theme</label>
          <div className="color-selector-grid">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option bg-${color} ${selectedColor === color ? "selected" : ""}`}
                onClick={() => setSelectedColor(color)}
                disabled={isSubmitting}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Icon Selector */}
        <div className="form-group" style={{ marginBottom: "24px" }}>
          <label className="form-label">Category Icon</label>
          <div className="icon-selector-grid">
            {ICON_LIST.map(({ name: iconName, component: IconComponent }) => (
              <button
                key={iconName}
                type="button"
                className={`icon-option ${selectedIcon === iconName ? "selected" : ""}`}
                onClick={() => setSelectedIcon(iconName)}
                disabled={isSubmitting}
                title={iconName}
              >
                <IconComponent size={20} />
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          <PlusCircle size={18} />
          {isSubmitting ? "Creating..." : "Create Budget"}
        </button>
      </form>
    </div>
  );
};

export default CreateBudgetForm;
