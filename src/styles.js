import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    desktop: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    mobile: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    main: {
        [theme.breakpoints.up('sm')]: {
            paddingBottom: '5px', // Fixed typo from '5x' to '5px'
        },
    },
    last: {
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(3),
            paddingBottom: '200px',
        },
    },
    grid: {
        '& > *': {
            margin: theme.spacing(2),
        },
    },
}));

export default useStyles;
