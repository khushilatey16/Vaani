import React, { useState, useContext, useEffect } from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import useStyles from '../../../styles';
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import formatDate from '../../../utils/formatDate';
import { incomeCategories, expenseCategories } from '../../../constants/categories';

// Helper function to convert words like "hundred" to numbers
const wordToNumber = (str) => {
  const wordsToNumbersMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
    'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000
  };

  let words = str.split(" ");
  let result = 0, tempNum = 0;

  words.forEach(word => {
    let num = wordsToNumbersMap[word.toLowerCase()];
    if (num) {
      tempNum += num;
    } else if (word.toLowerCase() === 'hundred') {
      tempNum *= 100;
    } else if (word.toLowerCase() === 'thousand') {
      tempNum *= 1000;
    }
  });

  result += tempNum;
  return result;
};

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
  const [transcript, setTranscript] = useState('');  // Added for debugging purposes

  // Web Speech API logic
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Captured voice input:', lastResult);  // Log captured speech for debugging
      setTranscript(lastResult);  // Set for display/debugging purposes
      handleVoiceInput(lastResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);  // Log any recognition errors
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening]);

  // Improved function to handle voice commands and update the form
  const handleVoiceInput = (input) => {
    console.log('Raw Input:', input);
    // Updated regex to better capture the input structure
    const pattern = /(add|record|insert)\s*(income|expense)\s*(of\s*)?(\b(?:\d+|hundred|thousand|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b)\s*(in|for)?\s*(.+?)\s*category/i;

    const match = input.match(pattern);

    if (match) {
      const [_, action, type, , amount, , category] = match;
      console.log('Parsed values:', { action, type, amount, category });

      let amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) && amount) {
        amountNumber = wordToNumber(amount.trim()); // Clean the amount string
      }

      if (amountNumber && category) {
        const isIncome = type.toLowerCase() === 'income';
        const categoryList = isIncome ? incomeCategories : expenseCategories;
        const matchedCategory = categoryList.find((c) => c.type.toLowerCase() === category.toLowerCase());

        if (matchedCategory) {
          console.log('Matched Category:', matchedCategory.type);
          setFormData((prevData) => ({
            ...prevData,
            amount: amountNumber,
            category: matchedCategory.type,
            type: isIncome ? 'Income' : 'Expense',
            date: formatDate(new Date()),  // Use the current date
          }));
        } else {
          alert(`Invalid category: ${category}. Please use a valid category.`);
        }
      } else {
        alert("Please make sure to specify a valid amount and category.");
      }
    } else {
      alert("Please use a format like: 'Add [income/expense] of [amount] in [category] category'");
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
            border: '1px solid #333',
            borderRadius: '5px',
            padding: '10px 20px',
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: '#fff',
          }}
          onClick={() => setIsListening(true)}
        >
          Start Voice Input
        </Button>
        <Button fullWidth
          style={{
            fontSize: '16px',
            color: '#333',
            border: '1px solid #333',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#fff',
          }}
          onClick={() => setIsListening(false)}
        >
          Stop Voice Input
        </Button>
        <Typography variant="caption">Captured Input: {transcript}</Typography>  {/* Display captured speech */}
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
