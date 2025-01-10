import { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import AddExpenseForm from "./AddExpenseForm"; // Import your AddExpenseForm component

const AddBudgetForm = () => {
  const formRef = useRef();
  const focusRef = useRef();
  const isSubmittingRef = useRef(false);

  // État pour stocker les données du budget et des dépenses
  const [budget, setBudget] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Préparer les données à envoyer
    const formData = new FormData(formRef.current);
    const budgetData = {
      id: 0, // Auto-généré par le backend
      limitAmount: parseFloat(formData.get("newBudgetAmount")),
      depenseActuel: 0, // Initialisé à zéro
      soldeRestant: parseFloat(formData.get("newBudgetAmount")),
      dateCreated: new Date().toISOString(),
      userId: 1, // Remplacez par l'ID utilisateur réel si applicable
      expenses: [],
    };

    isSubmittingRef.current = true;

    try {
      // Récupérez le token depuis localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Token non disponible. Veuillez vous reconnecter.");
      }

      // Envoyer les données via Axios avec le token d'authentification
      const response = await axios.post(
        "http://localhost:2093/api/Budget/AddBudget",
        budgetData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
          },
        }
      );
      console.log("Budget créé avec succès :", response.data);

      // Réinitialiser le formulaire
      formRef.current.reset();
      focusRef.current.focus();

      // Recharger les données après ajout
      loadBudgetData();
    } catch (error) {
      console.error("Erreur lors de la création du budget :", error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Fonction pour charger les données du budget
  const loadBudgetData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Token non disponible. Veuillez vous reconnecter.");
      }

      const response = await axios.get("http://localhost:2093/api/Budget/GetBudget", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBudget(response.data); // Stocker les données du budget dans l'état
    } catch (error) {
      console.error("Erreur lors de la récupération des données du budget :", error);
    }
  };

  // Charger les données du budget lors du chargement du composant
  useEffect(() => {
    loadBudgetData();
  }, []);

  useEffect(() => {
    if (!isSubmittingRef.current) {
      focusRef.current.focus();
    }
  }, [isSubmittingRef.current]);

  return (
    <div className="form-wrapper">
      <h2 className="h3">Create budget</h2>
      <form className="grid-sm" ref={formRef} onSubmit={handleSubmit}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g., Groceries"
            required
            ref={focusRef}
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="e.g., 350dt"
            required
            inputMode="decimal"
          />
        </div>
        <button type="submit" className="btn btn--dark" disabled={isSubmittingRef.current}>
          {isSubmittingRef.current ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Create budget</span>
              <CurrencyDollarIcon width={20} />
            </>
          )}
        </button>
      </form>

      {/* Affichage des données du budget */}
      {budget && (
        <div className="budget-display">
          <h3>Budget Details</h3>
          <p><strong>Budget Name:</strong> {budget.id}</p>
          <p><strong>Amount:</strong> {budget.limitAmount} dt</p>
          <p><strong>Remaining Balance:</strong> {budget.soldeRestant} dt</p>
          <p><strong>Current Expenses:</strong> {budget.depenseActuel} dt</p>
          <p><strong>Created On:</strong> {new Date(budget.dateCreated).toLocaleString()}</p>
          <h4>Expenses</h4>
          <ul>
            {budget.expenses.length > 0 ? (
              budget.expenses.map((expense) => (
                <li key={expense.id}>
                  <p>{expense.name} - {expense.amount} dt</p>
                  <p>{new Date(expense.expensenDate).toLocaleString()}</p>
                </li>
              ))
            ) : (
              <p>No expenses added yet.</p>
            )}
          </ul> 
        </div>
      )}

      {/* Form to add expenses only appears after creating a budget */}
      {budget && (
        <AddExpenseForm budgets={[budget]} />
      )}
    </div>
  );
};

export default AddBudgetForm;
