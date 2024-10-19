import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import useTransactions from '../../useTransactions.js';
import useStyles from './styles.js';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const Details = ({ title }) => {
  const classes = useStyles();
  const { total, chartData } = useTransactions(title);

  return (
    <Card className={title === 'Income' ? classes.income : classes.expense}>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="h5">₹{total}</Typography>
        {chartData ? (
          <Doughnut data={chartData} />
        ) : (
          <Typography variant="subtitle1">No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Details; 