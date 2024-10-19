import React from 'react';
import {Card,CardHeader,CardContent,Typography,Grid,Divider} from '@material-ui/core';
import useStyles from '../../styles';
import Form from './Form/Form';
import List from './List/List';

const Main = () => {
    const classes = useStyles();
  return (
    <Card className={classes.root}>
        <CardHeader style={{ fontSize: '16px', color: '#333' }} title="Vaani:The Expense Tracker" subheader='Powered by khushi' />
        <CardContent>
           
            <Typography variant="subtitle1" style={{lineHeight:'1.5em',marginTop:'20px'}}>
                {/* InfoCard...*/}
                Try Saying: Add income for 100 in salary category.
            </Typography>
            <Divider/>
                <Form />
           
        </CardContent>
        <CardContent className={classes.cardContent}>
                 <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <List/>

                    </Grid>
                 </Grid>
        </CardContent>
    </Card>
  )
}

export default Main