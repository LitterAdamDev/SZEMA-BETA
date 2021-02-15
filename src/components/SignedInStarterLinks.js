import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                SZEMA
            </Typography>
            <Button className={classes.buttonTitle} color="inherit" href='/createnews'>Kérdésbázis</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/'>Feladatsor készítés</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/news'>Híroldal</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/'>Kijelentkezés</Button>
        </>
    )
}
export default HomePageLinks