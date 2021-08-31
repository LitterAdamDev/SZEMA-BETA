import React, { useReducer, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import "firebase/auth";
import { makeStyles } from '@material-ui/core/styles';
import 'firebase/firestore';
import {db} from '../../../config/base'


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

/*function useForceUpdate(){
    const [value, setValue] = useState(0); 
    return () => setValue(value => value + 1);
}*/

export default function DeleteQuizDialog({action, folder, name}) {

/*const forceUpdate = useForceUpdate();*/
const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (event) => {
    event.preventDefault()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => { 
    db.collection(folder)
        .doc(name)
        .delete()
        .catch( error => console.log(error));
        action({label: 'Új teszt', value: 'uj', folder: '', id : name})
    setOpen(false);
  };

  return (
      <>
      <a>
        <button class="delete-button" onClick={handleClickOpen}>
            Feladatsor törlése
        </button>
      </a>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Biztosan törölni szeretné az elemet?</DialogTitle>
        <DialogContent>
            Törlendő elem: {name}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button onClick={handleDelete} color="inherit" autoFocus>
            Törlés
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}