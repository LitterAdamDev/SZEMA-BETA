import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import "firebase/auth";
import LogoutDialog from './LogoutDialog';
import Link from '@material-ui/core/Link'

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
                <Link variant="inherit" color="inherit" href="/">SZEMA</Link>
              </Typography>
            <Button className={classes.buttonTitle} color="inherit" href='/questionbase'>Kérdésbázis</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/createtest'>Feladatsor készítés</Button>
            <Button className={classes.buttonTitle} color="inherit" href='/news'>Híroldal</Button>
            <LogoutDialog />
        </>
    )
}
export default HomePageLinks