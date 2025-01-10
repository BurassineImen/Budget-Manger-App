import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

// Components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";

// Helper functions
import { fetchData } from "../helpers";

// Loader for Blanco
export function blancoLoader() {
  const userData = localStorage.getItem("userData");

  if (!userData) {
    console.error("No userData found in localStorage.");
    throw new Error("You are in Blanco but User is not authenticated.");
  }

  try {
    const parsedData = JSON.parse(userData);

    if (!parsedData.name || !parsedData.email) {
      console.error("Parsed userData is incomplete:", parsedData);
      throw new Error("You are in Blanco but User is not authenticated.");
    }

    const budgets = fetchData("budgets") || [];
    return { ...parsedData, budgets };
  } catch (err) {
    console.error("Error parsing userData:", err);
    throw new Error("User data is invalid.");
  }
}

const Blanco = () => {
  const { name, email, budgets } = useLoaderData();
  const [selectedBudget, setSelectedBudget] = useState(null);

  return (
    <div className="dashboard">
      {name && email ? (
        <>
          <h1>
            Welcome back, <span className="accent">{name}</span>!
          </h1>
          <div className="grid-sm">
            {budgets?.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  {/* Adding budget and expense forms */}
                  <AddBudgetForm onBudgetCreated={(newBudget) => setSelectedBudget(newBudget)} />
                  {selectedBudget && (
                    <AddExpenseForm budgets={[selectedBudget]} />
                  )}
                </div>

                <h2>Your Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem
                      key={budget.id}
                      budget={budget}
                      onSelect={() => setSelectedBudget(budget)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid-sm">
                <p>Start your journey by creating your first budget.</p>
                <AddBudgetForm onBudgetCreated={(newBudget) => setSelectedBudget(newBudget)} />
              </div>
            )}
          </div>
        </>
      ) : (
        <Intro />
      )}
    </div>
  );
};

export default Blanco;
