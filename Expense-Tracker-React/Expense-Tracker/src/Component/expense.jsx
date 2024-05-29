import React, { useEffect, useState } from 'react';
import '../App.css';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formState, setFormState] = useState({ description: '', amount: '', category: '' });
  const [total, setTotal] = useState(0);
  const [view, setView] = useState('list');

  useEffect(() => {
    fetchExpenses();
    fetchTotalAmount();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('There was an error fetching the expenses!', error);
    }
  };

  const fetchTotalAmount = async () => {
    try {
      const response = await axios.get('/api/expenses/total');
      setTotal(response.data);
    } catch (error) {
      console.error('There was an error fetching the total amount!', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/expenses', formState);
      fetchExpenses();
      setView('list');
    } catch (error) {
      console.error('There was an error adding the expense!', error);
    }
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/expenses/${currentExpense.id}`, formState);
      fetchExpenses();
      setView('list');
    } catch (error) {
      console.error('There was an error updating the expense!', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error('There was an error deleting the expense!', error);
    }
  };

  const handleViewDetails = (expense) => {
    setCurrentExpense(expense);
    setView('details');
  };

  const handleViewUpdate = (expense) => {
    setCurrentExpense(expense);
    setFormState(expense);
    setView('update');
  };

  const handleBack = () => {
    setFormState({ description: '', amount: '', category: '' });
    setView('list');
  };

  return (
    <div className="app">
      {view === 'list' && (
        <>
          <h1>Expenses</h1>
          <button onClick={() => setView('add')} className="add-button">Add Expense</button>
          <ul>
            {expenses.map(expense => (
              <li key={expense.id}>
                {expense.description} - ${expense.amount}
                <button onClick={() => handleViewUpdate(expense)} className="update-button">Update</button>
                <button onClick={() => handleViewDetails(expense)} className="details-button">Details</button>
                <button onClick={() => handleDeleteExpense(expense.id)} className="delete-button">Delete</button>
              </li>
            ))}
          </ul>
          <h2>Total Amount: ${total}</h2>
        </>
      )}
      {view === 'add' && (
        <div className="form-container">
          <h1>Add Expense</h1>
          <form onSubmit={handleAddExpense}>
            <input type="text" name="description" placeholder="Description" value={formState.description} onChange={handleInputChange} required />
            <input type="number" name="amount" placeholder="Amount" value={formState.amount} onChange={handleInputChange} required />
            <input type="text" name="category" placeholder="Category" value={formState.category} onChange={handleInputChange} required />
            <button type="submit">Add</button>
          </form>
          <button onClick={handleBack} className="back-button">Back</button>
        </div>
      )}
      {view === 'update' && (
        <div className="form-container">
          <h1>Update Expense</h1>
          <form onSubmit={handleUpdateExpense}>
            <input type="text" name="description" placeholder="Description" value={formState.description} onChange={handleInputChange} required />
            <input type="number" name="amount" placeholder="Amount" value={formState.amount} onChange={handleInputChange} required />
            <input type="text" name="category" placeholder="Category" value={formState.category} onChange={handleInputChange} required />
            <button type="submit">Update</button>
          </form>
          <button onClick={handleBack} className="back-button">Back</button>
        </div>
      )}Expense
      
    </div>
  );
}

export default Expense;
