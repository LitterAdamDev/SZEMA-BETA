import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import "firebase/auth";
import firebase from "firebase/app";
import ResponsiveDialog from './ResponsiveDialog';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      fontFamily: 'Anton'
    },
    buttonTitle: {
      fontFamily: 'Anton'
    }
  }));

const HomePageLinks = () =>{
    const classes = useStyles();
    return(
        <>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            </IconButton>
            <Typography variant="h5" className={classes.title}>
                SZEMA
            </Typography>
            <Button className={classes.buttonTitle} color="inherit" href='/questionbase'>Kérdésbázis</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/createtest'>Feladatsor készítés</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/news'>Híroldal</Button>
            <ResponsiveDialog />
        </>
    )
}
export default HomePageLinks