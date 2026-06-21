import React, { useState, useMemo } from "react";
import { PieChart, BarChart2, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/helpers";

const COLOR_HEX = {
  indigo: "#6366f1",
  teal: "#0d9488",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  slate: "#64748b",
  sky: "#0ea5e9",
  pink: "#ec4899"
};

const AnalyticsView = ({ budgets, expenses }) => {
  const [activeDonutSlice, setActiveDonutSlice] = useState(null);

  // 1. Calculate expenditures by budget category
  const categoryStats = useMemo(() => {
    const stats = budgets.map((budget) => {
      const spent = expenses
        .filter((exp) => exp.budgetId === budget.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return {
        id: budget.id,
        name: budget.name,
        limit: budget.amount,
        spent,
        color: budget.color,
        colorHex: COLOR_HEX[budget.color] || "#6366f1"
      };
    });

    const totalSpent = stats.reduce((sum, item) => sum + item.spent, 0);
    const totalLimit = stats.reduce((sum, item) => sum + item.limit, 0);

    return {
      stats: stats.filter(item => item.spent > 0 || item.limit > 0), // filter out unused elements for display
      totalSpent,
      totalLimit,
      allStats: stats // keep all for comparison charts
    };
  }, [budgets, expenses]);

  const { stats, totalSpent, totalLimit, allStats } = categoryStats;

  // --- DOUGHNUT CHART CALCULATIONS ---
  const doughnutCircumference = 439.8; // 2 * pi * r (r = 70)
  
  // Calculate cumulative slice details for doughnut chart
  const doughnutSlices = useMemo(() => {
    if (totalSpent === 0) return [];
    
    let currentOffset = 0;
    
    return stats
      .filter(item => item.spent > 0)
      .map((item) => {
        const percentage = item.spent / totalSpent;
        const length = percentage * doughnutCircumference;
        const offset = doughnutCircumference - length + currentOffset;
        
        // Accumulate offset for next slices (moving clockwise)
        currentOffset -= length;
        
        return {
          ...item,
          percentage,
          length,
          offset
        };
      });
  }, [stats, totalSpent]);

  // --- BAR CHART CALCULATIONS ---
  // dimensions for bar chart grid
  const chartHeight = 220;
  const chartWidth = 440;
  const paddingBottom = 30;
  const paddingLeft = 50;
  const paddingTop = 15;
  const paddingRight = 10;
  
  const barChartConfig = useMemo(() => {
    if (allStats.length === 0) return null;
    
    // Find maximum value to scale the Y axis
    const maxVal = Math.max(
      ...allStats.map(item => Math.max(item.limit, item.spent)),
      100 // baseline minimum height
    );
    
    // Give 15% padding at top
    const yMax = maxVal * 1.15;
    
    // X spacing per budget category group
    const groupWidth = (chartWidth - paddingLeft - paddingRight) / allStats.length;
    
    return {
      yMax,
      groupWidth
    };
  }, [allStats]);

  // Y-axis tick values helper
  const yTicks = useMemo(() => {
    if (!barChartConfig) return [];
    const { yMax } = barChartConfig;
    return [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];
  }, [barChartConfig]);

  return (
    <div className="analytics-tab fade-in">
      <div className="metrics-grid">
        <div className="metric-card income">
          <div className="metric-icon-wrapper">
            <DollarSign size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Allocated Budget</span>
            <span className="metric-value">{formatCurrency(totalLimit)}</span>
          </div>
        </div>

        <div className="metric-card spent">
          <div className="metric-icon-wrapper">
            <TrendingUp size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Cumulative Spent</span>
            <span className="metric-value">{formatCurrency(totalSpent)}</span>
          </div>
        </div>

        <div className={`metric-card ${totalSpent > totalLimit ? "overbudget" : "remaining"}`}>
          <div className="metric-icon-wrapper">
            <PieChart size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">
              {totalSpent > totalLimit ? "Over Allocated Budget" : "Remaining Allowance"}
            </span>
            <span className="metric-value">
              {totalSpent > totalLimit 
                ? formatCurrency(totalSpent - totalLimit) 
                : formatCurrency(totalLimit - totalSpent)
              }
            </span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Doughnut Chart Card */}
        <div className="glass-card chart-card">
          <h3 className="card-title">
            <PieChart size={18} style={{ color: "var(--color-indigo)" }} />
            Expense Distribution
          </h3>
          
          {totalSpent === 0 ? (
            <div className="empty-state" style={{ height: "300px", border: "none" }}>
              <p>Add some expenses to see category distribution.</p>
            </div>
          ) : (
            <>
              <div className="chart-container-svg">
                <svg className="chart-svg" viewBox="0 0 200 200">
                  {/* Background Track Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="transparent"
                    stroke="var(--bg-primary)"
                    strokeWidth="18"
                  />
                  
                  {/* Slices circle overlay */}
                  {doughnutSlices.map((slice) => (
                    <circle
                      key={slice.id}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="transparent"
                      stroke={slice.colorHex}
                      strokeWidth="18"
                      strokeDasharray={doughnutCircumference}
                      strokeDashoffset={slice.offset}
                      transform="rotate(-90 100 100)"
                      className="chart-slice"
                      style={{ strokeLinecap: "round" }}
                      onMouseEnter={() => setActiveDonutSlice(slice)}
                      onMouseLeave={() => setActiveDonutSlice(null)}
                    />
                  ))}

                  {/* Hole details text */}
                  <g className="chart-donut-text">
                    <text x="100" y="92" className="chart-donut-text-amount">
                      {activeDonutSlice 
                        ? formatCurrency(activeDonutSlice.spent) 
                        : formatCurrency(totalSpent)
                      }
                    </text>
                    <text x="100" y="114" className="chart-donut-text-label">
                      {activeDonutSlice 
                        ? `${activeDonutSlice.name} (${formatPercentage(activeDonutSlice.percentage)})` 
                        : "Total Spent"
                      }
                    </text>
                  </g>
                </svg>
              </div>

              {/* Legends list */}
              <div className="chart-legend">
                {doughnutSlices.map((slice) => (
                  <div 
                    key={slice.id} 
                    className="legend-item"
                    onMouseEnter={() => setActiveDonutSlice(slice)}
                    onMouseLeave={() => setActiveDonutSlice(null)}
                    style={{ 
                      opacity: activeDonutSlice && activeDonutSlice.id !== slice.id ? 0.4 : 1,
                      transition: "opacity var(--transition-fast)"
                    }}
                  >
                    <span className="legend-color" style={{ backgroundColor: slice.colorHex }} />
                    <span className="legend-label">{slice.name}</span>
                    <span className="legend-value">{formatPercentage(slice.percentage)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar Comparison Chart Card */}
        <div className="glass-card chart-card">
          <h3 className="card-title">
            <BarChart2 size={18} style={{ color: "var(--color-teal)" }} />
            Budget vs. Spent Comparison
          </h3>

          {allStats.length === 0 ? (
            <div className="empty-state" style={{ height: "300px", border: "none" }}>
              <p>Create a budget to compare limits and expenditures.</p>
            </div>
          ) : (
            <div className="chart-container-svg" style={{ minHeight: "300px" }}>
              <svg className="chart-bar-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* Grid Lines */}
                {barChartConfig && yTicks.map((tickValue, index) => {
                  const y = chartHeight - paddingBottom - (tickValue / barChartConfig.yMax) * (chartHeight - paddingBottom - paddingTop);
                  return (
                    <g key={index}>
                      {index > 0 && (
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={chartWidth - paddingRight}
                          y2={y}
                          className="chart-grid-line"
                        />
                      )}
                      {/* Y-Axis tick label */}
                      <text
                        x={paddingLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="chart-axis-text"
                      >
                        {formatCurrency(tickValue)}
                      </text>
                    </g>
                  );
                })}

                {/* Main Axes */}
                <line
                  x1={paddingLeft}
                  y1={chartHeight - paddingBottom}
                  x2={chartWidth - paddingRight}
                  y2={chartHeight - paddingBottom}
                  className="chart-axis-line"
                />
                <line
                  x1={paddingLeft}
                  y1={paddingTop}
                  x2={paddingLeft}
                  y2={chartHeight - paddingBottom}
                  className="chart-axis-line"
                />

                {/* Bars drawing */}
                {barChartConfig && allStats.map((item, index) => {
                  const { yMax, groupWidth } = barChartConfig;
                  
                  // Center of the current group category
                  const groupX = paddingLeft + index * groupWidth + groupWidth / 2;
                  
                  // Dimensions
                  const barWidth = 14;
                  const limitHeight = (item.limit / yMax) * (chartHeight - paddingBottom - paddingTop);
                  const spentHeight = (item.spent / yMax) * (chartHeight - paddingBottom - paddingTop);
                  
                  const limitX = groupX - barWidth - 2;
                  const spentX = groupX + 2;
                  
                  const limitY = chartHeight - paddingBottom - limitHeight;
                  const spentY = chartHeight - paddingBottom - spentHeight;
                  
                  return (
                    <g key={item.id}>
                      {/* Limit Bar (Grey/Stroked) */}
                      <rect
                        x={limitX}
                        y={limitY}
                        width={barWidth}
                        height={limitHeight}
                        fill="rgba(0, 0, 0, 0.04)"
                        stroke="var(--border-color-hover)"
                        strokeWidth="1"
                        rx="2"
                        className="chart-bar-rect"
                        title={`Limit: ${formatCurrency(item.limit)}`}
                      />
                      
                      {/* Spent Bar (Colored) */}
                      <rect
                        x={spentX}
                        y={spentY}
                        width={barWidth}
                        height={spentHeight}
                        fill={item.colorHex}
                        rx="2"
                        className="chart-bar-rect"
                        title={`Spent: ${formatCurrency(item.spent)}`}
                      />

                      {/* X Axis Label */}
                      <text
                        x={groupX}
                        y={chartHeight - paddingBottom + 18}
                        textAnchor="middle"
                        className="chart-axis-text"
                        style={{ fontWeight: 500 }}
                      >
                        {item.name.length > 8 ? `${item.name.substring(0, 7)}...` : item.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bar Legend */}
              <div 
                style={{ 
                  position: "absolute", 
                  top: "0px", 
                  right: "12px", 
                  display: "flex", 
                  gap: "16px",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)" 
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: 10, height: 10, display: "inline-block", backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid var(--border-color-hover)", borderRadius: 2 }} />
                  <span>Limit</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: 10, height: 10, display: "inline-block", backgroundColor: "var(--color-primary)", borderRadius: 2 }} />
                  <span>Spent</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
