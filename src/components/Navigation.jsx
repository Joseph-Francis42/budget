import React from "react";
import { LayoutDashboard, Wallet, Receipt, PieChart, LogOut } from "lucide-react";

const Navigation = ({ userName, activeTab, setActiveTab, onLogout }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "budgets", label: "Budgets", icon: <Wallet size={18} /> },
    { id: "expenses", label: "Expenses", icon: <Receipt size={18} /> },
    { id: "analytics", label: "Analytics", icon: <PieChart size={18} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <Wallet size={20} />
          </div>
          <span className="logo-text">LedgerFlow</span>
        </div>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
                style={{ width: "100%", background: "none", border: "none", textAlign: "left" }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="user-profile-badge">
          <div className="user-avatar">{getInitials(userName)}</div>
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-label">Personal Account</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={onLogout}
            title="Reset Ledger & Exit"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div className="logo-container" style={{ marginBottom: 0 }}>
          <div className="logo-icon" style={{ width: 32, height: 32 }}>
            <Wallet size={16} />
          </div>
          <span className="logo-text" style={{ fontSize: "1.1rem" }}>LedgerFlow</span>
        </div>
        
        <button 
          className="logout-btn" 
          onClick={onLogout}
          title="Reset Ledger & Exit"
          style={{ padding: "8px" }}
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`mobile-nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Navigation;
