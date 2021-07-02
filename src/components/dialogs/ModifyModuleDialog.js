import React, { useReducer, useState, useEffect } from 'react';
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

export default function ModifyModuleDialog({action,options,index,dataset}) {
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
    setDescription(dataset[index]['description'])
    setIcon(dataset[index]['icon'])
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDescription = (event) =>{
    setDescription(event.target.value)
  }
  const handleIcon = (newValue, actionMeta) =>{
    setIcon(newValue['value'])
  }
  const handleModifyModul = (event) => { 
    action(event,{'description' : description, 'icon' : icon['value']})
    setOpen(false);
  };

  return (
      <>
      <a>
        <button class="modul-button" onClick={handleClickOpen}>
            Modul módosítása
        </button>
      </a>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        
      >
        <DialogTitle id="responsive-dialog-title">
            Modul módosítása
        </DialogTitle>
        <DialogContent>
        <DialogContentText></DialogContentText>
        <form autoComplete="off">
            <div class="center-fullwidth">
                <div id="select-top">
                    <Select width="50%" 
                    id="modul-icon-select" 
                    placeholder="Icon kiválasztása..." 
                    options={options} 
                    onChange={handleIcon}
                    value ={icon}
                    />
                </div>
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
        </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button onClick={handleModifyModul} color="inherit" autoFocus>
            Módosítás
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}