import React, { useState, useContext, useEffect } from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import useStyles from '../../../styles';
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import formatDate from '../../../utils/formatDate';
import { incomeCategories, expenseCategories } from '../../../constants/categories';

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date()),  // Automatically sets the current date
};

const Form = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialState);
  const { addTransaction } = useContext(ExpenseTrackerContext);
  const [isListening, setIsListening] = useState(false);

  // Web Speech API logic
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1][0].transcript.trim();
      handleVoiceInput(lastResult);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening]);

  // Function to handle voice commands and update the form
  const handleVoiceInput = (input) => {
    const pattern = /Add (income|expense) of (\d+) in (\w+) category/i;
    const match = input.match(pattern);

    if (match) {
      const [_, type, amount, category] = match;
      const isIncome = type.toLowerCase() === 'income';
      const categoryList = isIncome ? incomeCategories : expenseCategories;
      const matchedCategory = categoryList.find((c) => c.type.toLowerCase() === category.toLowerCase());

      if (matchedCategory) {
        setFormData({
          amount: parseInt(amount),
          category: matchedCategory.type,
          type: isIncome ? 'Income' : 'Expense',
          date: formatDate(new Date()),  // Use the current date
        });
      } else {
        alert(`Invalid category. Please use one of the valid categories: ${categoryList.map(c => c.type).join(', ')}`);
      }
    } else {
      alert("Please use the format: 'Add [income/expense] of [amount] in [category] category'");
    }
  };

  const createTransaction = () => {
    if (formData.amount && formData.category && formData.date) {
      const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() };
      addTransaction(transaction);
      setFormData(initialState);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle2" gutterBottom>
          ...
        </Typography>
      </Grid>
      <Grid item xs={12}>
      <Button fullWidth
  style={{
    fontSize: '16px',
    color: '#333',
    border: '1px solid #333', // Adjust the color and thickness as needed
    borderRadius: '5px', // Optional: adds rounded corners
    padding: '10px 20px', // Optional: adds padding for better click area
    marginRight: '10px', // Optional: adds space between buttons
    cursor: 'pointer', // Optional: changes cursor on hover
    backgroundColor: '#fff', // Optional: background color
  }}
  onClick={() => setIsListening(true)}
>
  Start Voice Input
</Button>
<Button fullWidth
  style={{
    fontSize: '16px',
    color: '#333',
    border: '1px solid #333', // Same border styling for consistency
    borderRadius: '5px', // Optional
    padding: '10px 20px', // Optional
    cursor: 'pointer', // Optional
    backgroundColor: '#fff', // Optional
  }}
  onClick={() => setIsListening(false)}
>
  Stop Voice Input
</Button>

      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            {selectedCategories.map((c) => (
              <MenuItem key={c.type} value={c.type}>
                {c.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="number"
          label="Amount"
          fullWidth
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="date"
          label="Date"
          fullWidth
          value={formData.date}  // Automatically filled with the current date
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}  // Allow user to select a date
        />
      </Grid>
      <Grid item xs={12}>
        <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

export default Form;
