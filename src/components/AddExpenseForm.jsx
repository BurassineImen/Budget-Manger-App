import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const AddExpenseForm = ({ budgets }) => {
  const formRef = useRef();
  const focusRef = useRef();
  const isSubmittingRef = useRef(false);
  const [expenses, setExpenses] = useState([]);

  // Récupérer les dépenses au montage du composant
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token d'authentification manquant.");

        const response = await axios.get("http://localhost:2093/api/Expense/GetExpenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des dépenses :", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const expenseData = {
      id: 0, // Laissez l'ID être généré par le backend
      name: formData.get("newExpense"),
      amount: parseFloat(formData.get("newExpenseAmount")),
      expensenDate: new Date().toISOString(),
      budgetId: parseInt(formData.get("newExpenseBudget"), 10),
    };

    isSubmittingRef.current = true;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token d'authentification manquant.");

      const response = await axios.post(
        "http://localhost:2093/api/Expense/AddExpense",
        expenseData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Dépense ajoutée avec succès :", response.data);

      // Ajouter la nouvelle dépense à la liste
      setExpenses((prevExpenses) => [...prevExpenses, response.data]);

      // Réinitialisez le formulaire
      formRef.current.reset();
      focusRef.current.focus();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense :", error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
   
    <div className="form-wrapper">
      <h2 className="h3">Add Expense</h2>
      <form className="grid-sm" ref={formRef} onSubmit={handleSubmit}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50"
              required
            />
          </div>
        </div>
        <div className="grid-xs" hidden={budgets.length === 1}>
          <label htmlFor="newExpenseBudget">Budget Category</label>
          <select name="newExpenseBudget" id="newExpenseBudget" required>
            {budgets
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
          </select>
        </div>
        <button type="submit" className="btn btn--dark" disabled={isSubmittingRef.current}>
          {isSubmittingRef.current ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Add Expense</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </form>

      {/* Liste des dépenses */}
      <div className="expense-list">
        <h2 className="h3">Existing Expenses</h2>
        {expenses.length > 0 ? (
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                <span>{expense.name}</span> - <span>${expense.amount.toFixed(2)}</span>{" "}
                (<span>{budgets.find((b) => b.id === expense.budgetId)?.name || "Unknown Budget"}</span>)
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddExpenseForm;
