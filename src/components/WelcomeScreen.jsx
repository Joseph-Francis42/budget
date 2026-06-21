import React, { useState } from "react";
import { Wallet, UserPlus } from "lucide-react";

const WelcomeScreen = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-card glass-card">
        <div className="welcome-logo-large">
          <Wallet size={32} />
        </div>
        
        <h1 className="welcome-title">Take Control of Your Money</h1>
        <p className="welcome-desc">
          A professional, private dashboard for organizing your personal budgets 
          and tracking your expenditures. All data is saved locally on your device.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              What should we call you?
            </label>
            <input
              type="text"
              id="username"
              required
              placeholder="Enter your name..."
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>

          <button type="submit" className="btn-submit" style={{ marginTop: "8px" }}>
            <UserPlus size={18} />
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
