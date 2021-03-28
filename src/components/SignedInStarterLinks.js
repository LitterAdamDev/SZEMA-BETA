import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import "firebase/auth";
import LogoutDialog from './dialogs/LogoutDialog';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
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
              <Tooltip title={<h1 style={{lineHeight:"1.5rem", fontSize:"15px", color: "lightblue" }}>Kezdőlap, hírek megnyitása.</h1>}>
                <Button className={classes.buttonTitle} color="inherit" href="/">SZEMA</Button></Tooltip>
              </Typography>
              <Tooltip title={<h1 style={{lineHeight:"1.5rem", fontSize:"15px", color: "lightblue" }}>Kérdések létrehozása, módosítása, szerkesztése oldal.</h1>}>
            <Button className={classes.buttonTitle} color="inherit" href='/questionbase'>Kérdésbázis</Button></Tooltip>
            <Tooltip title={<h1 style={{lineHeight:"1.5rem", fontSize:"15px", color: "lightblue" }}>Tesztek kezelése, összeállítása.</h1>}>
            <Button className={classes.buttonTitle} color="inherit" href='/createtest'>Feladatsor készítés</Button></Tooltip>
            <LogoutDialog />
        </>
    )
}
export default HomePageLinks