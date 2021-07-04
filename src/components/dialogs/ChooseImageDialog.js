import React, { useReducer, useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import "firebase/auth";
import { makeStyles } from '@material-ui/core/styles'
import Select from 'react-select'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import ImageSelector from '../ImageSelector'


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

export default function ChooseImageDialog({path,action}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [icon, setIcon] = React.useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
  },[]);
  const handleClickOpen = (event) => {
    event.preventDefault()
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
      <>
      <a>
        <button class="modul-button" onClick={handleClickOpen}>
            Icon kiválasztása
        </button>
      </a>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        
      >
        <DialogTitle id="responsive-dialog-title">
            Icon kiválasztása
        </DialogTitle>
        <DialogContent>
        <DialogContentText></DialogContentText>
        <form autoComplete="off">
            <div class="center-fullwidth">
                <ImageSelector path='quizes/quiz_type'/>
            </div>
            <br/>
        </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button  onClick={handleClose} color="inherit" autoFocus>
            Módosítás
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}