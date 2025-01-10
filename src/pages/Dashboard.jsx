import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";

// Components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";

// Helper functions
import { createBudget, createExpense, fetchData, waait } from "../helpers";

// Loader
export function dashboardLoader() {


  const name = fetchData("name");
  const userEmail = fetchData("userEmail");
  const budgets = fetchData("budgets");
  return { name, userEmail, budgets };
}

// Action
export async function dashboardAction({ request }) {
  await waait();

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  try {
    if (_action === "registerUser") {
      localStorage.setItem("name", JSON.stringify(values.name));
      localStorage.setItem("userEmail", JSON.stringify(values.email));
      localStorage.setItem("userPassword", JSON.stringify(values.password));
      return toast.success(`Account created for ${values.userName}!`);
    }

    if (_action === "createBudget") {
      createBudget({
        name: values.newBudget,
        amount: parseFloat(values.newBudgetAmount),
      });
      return toast.success("Budget created successfully!");
    }

    if (_action === "createExpense") {
      createExpense({
        name: values.newExpense,
        amount: parseFloat(values.newExpenseAmount),
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense "${values.newExpense}" created successfully!`);
    }
  } catch (error) {
    console.error("Error during action processing:", error);
    throw new Error("An unexpected error occurred.");
  }
}

// Dashboard Component
const Dashboard = () => {
  
  const { name, userEmail, budgets } = useLoaderData();

  return (
    <>
      {name && userEmail ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{name}</span>!
          </h1>
          <div className="grid-sm">
            {budgets?.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Your Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid-sm">
                <p>Start your journey by creating your first budget.</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};

export default Dashboard;
