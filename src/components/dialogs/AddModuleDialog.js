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
import Select from 'react-select'
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
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

export default function AddModuleDialog({path,action,options,maxidx}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [index, setIndex] = React.useState(1);
  const [icon, setIcon] = React.useState({'label' : 'https://firebasestorage.googleapis.com/v0/b/szema-ac882.appspot.com/o/quizes%2Fquiz_type%2Fcube.png?alt=media&token=31e44214-3a23-4f31-bb3f-865772f47d11', 'value' : 'https://firebasestorage.googleapis.com/v0/b/szema-ac882.appspot.com/o/quizes%2Fquiz_type%2Fcube.png?alt=media&token=31e44214-3a23-4f31-bb3f-865772f47d11'});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (event) => {
    event.preventDefault()
    setDescription('')
    setIndex(maxidx)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDescription = (event) =>{
    setDescription(event.target.value)
  }
  const handleIndex = (event) =>{
    
    if(event.target.value < 1){
      setIndex(1)
    }else if(event.target.value> maxidx){
      setIndex(maxidx)
    }else{
      setIndex(event.target.value)
    }
  }
  const handleIcon = (image) =>{
    setIcon(image['src'])
  }
  const handleAddModul = (event) => { 
    action(event,{'description' : description, 'icon' : icon},index-1)
    setOpen(false);
  };

  return (
      <>
      <a>
        <button class="modul-button" onClick={handleClickOpen}>
            Új modul
        </button>
      </a>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        
      >
        <DialogTitle id="responsive-dialog-title">
            Új modul létrehozása
        </DialogTitle>
        <DialogContent>
        <DialogContentText></DialogContentText>
        <form autoComplete="off">
            <div class="center-fullwidth">
                <ImageSelector path={path} action={handleIcon}/>
            </div>
            <br/>
            <TextField
                autoFocus
                margin="dense"
                id="module-description-input"
                label="Modul leírása"
                type="text"
                fullWidth
                onChange={handleDescription}
                value={description}
            />
            <TextField
                autoFocus
                margin="dense"
                id="module-position-input"
                label="Modul pozíciója a tesztben"
                type="number"
                fullWidth
                onChange={handleIndex}
                value={index}
            />
        </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button onClick={handleAddModul} color="inherit" autoFocus>
            Hozzáadás
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}