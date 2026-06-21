# LedgerFlow — Premium Personal Budget Manager

LedgerFlow is a sleek, responsive, and private web application designed to help you organize your personal budgets and track expenditures. Built using React.js and styled with a professional, light-neutral gray palette, it keeps all your financial data secure and stored locally on your device.

## Live Demo
Check out the live deployment here: [https://joseph-francis42.github.io/budget/](https://joseph-francis42.github.io/budget/)

## Key Features
- **Personalized Onboarding:** Welcoming user onboarding flow to personalize your dashboard.
- **Custom Budget Allocations:** Create individual budgets with customizable currency limits, visual category color swatches, and representative category icons.
- **Itemized Expense Tracking:** Log expenditures against specific budgets with automatic progress visualizers that shift colors as you approach your spending limits (indigo to amber to crimson).
- **Interactive SVG Data Visualizations:**
  - **Doughnut Distribution Chart:** Hover over categories to inspect relative spending percentages and active totals in the center of the ring.
  - **Budget vs. Spent Comparison Bars:** Vertical side-by-side bar chart showing limit margins next to actual expenditure totals.
- **Detailed Category Modals:** Drill down into specific budgets to log category-locked expenses and review category-specific transaction tables.
- **CSV Data Export:** Export your filtered and sorted transaction list directly into a downloadable spreadsheet file for auditing.
- **Responsive Layout:** Fully optimized for desktop, tablet, and mobile browsers (featuring a mobile bottom navigation bar).
- **Private & Local:** No external databases or cloud tracking. All records are persisted strictly in your browser's `localStorage`.

## Tech Stack
- **Framework:** React 18+ (scaffolded via Vite)
- **Styling:** Vanilla CSS (cohesive design tokens, glassmorphism, responsive grids, CSS animations)
- **Icons:** Lucide React
- **Zero-Dependency Graphics:** Customized responsive inline SVG charts

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Joseph-Francis42/budget.git
   cd budget
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
Build the optimized production assets:
```bash
npm run build
```
The compiled build output will be stored in the `/dist` directory.

## License
Distributed under the MIT License. See `LICENSE` for more information.
