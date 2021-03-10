import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import "firebase/auth";
import firebase from "firebase/app";
import { makeStyles } from '@material-ui/core/styles';

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

export default function LogoutDialog() {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    setOpen(false);
    firebase.auth().signOut();
  };

  return (
    <div>
      <Button className={classes.buttonTitle} color="inherit" onClick={handleClickOpen}>
        Kijelentkezés
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Biztosan ki szeretne jelentkezni?"}</DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button onClick={handleLogout} color="inherit" autoFocus>
            Kijelentkezem!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}