//local storage
export const waait = () => new Promise(res => setTimeout(res, Math.random() * 2000))


// colors
const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 34} 65% 50%`
}
// Exporte une fonction nommée fetchData
export const fetchData = (key) => {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data); // Tente de convertir en JSON
    // eslint-disable-next-line no-unused-vars
    } catch (Error) {
      return data; // Si ce n'est pas du JSON, retourne la chaîne brute
    }
  }


// create budget
export const createBudget = ({
    name, amount
  }) => {
    const newItem = {
      id: crypto.randomUUID(),
      name: name,
      createdAt: Date.now(),
      amount: +amount,
      // eslint-disable-next-line no-undef
      color: generateRandomColor()
    }
    const existingBudgets = fetchData("budgets") ?? [];
    return localStorage.setItem("budgets",
      JSON.stringify([...existingBudgets, newItem]))
  }
  
  // create expense
export const createExpense = ({
  name, amount, budgetId
}) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    budgetId: budgetId
  }
  const existingExpenses = fetchData("expenses") ?? [];
  return localStorage.setItem("expenses",
    JSON.stringify([...existingExpenses, newItem]))
}


// delete item
export const deleteItem = ({ key }) => {
    return localStorage.removeItem(key)
  }

 // total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.id === budgetId I passed in
    if (expense.budgetId !== budgetId) return acc

    // add the current amount to my total
    return acc += expense.amount
  }, 0)
  return budgetSpent;
}


// FORMATTING

// Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  })
}

  // Format currency
  export const formatCurrency = (amt) => {
    return amt.toLocaleString(undefined, {
      style: "currency",
      currency : "TND"
    })
  }


  
  