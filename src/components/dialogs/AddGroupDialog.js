import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import 'firebase/firestore';
import SaveDialog from './SaveDialog';
import Select from 'react-select'
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
export default function AddGroupDialog({handleGroup}) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [valueDescription, setValueDescription] = React.useState("");
  const [valueOwner, setValueOwner] = React.useState("");
  const [valueImage, setValueImage] = React.useState("");
  const [valueName, setValueName] = React.useState("");
  const handleClickOpen = (event) => {
    event.preventDefault()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeDescription = (event) =>{
    setValueDescription(event.target.value)
  };
  const handleChangeOwner = (event) =>{
    setValueOwner(event.target.value);
  };
  const handleChangePicture = (newValue, actionMeta) =>{
    setValueImage(newValue['value'])
  };
  const handleChangeName = (event) =>{
    setValueName(event.target.value);
  };

  return(
      <>
      <button onClick={handleClickOpen } class="modul-button">
        Új csoport létrehozása
      </button>
      <Dialog open={open} onClose={handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Új hír létrehozása
            </Typography>
          </Toolbar>
        </AppBar>
            <div style={{display: "inline-flex", justifyContent: "center",alignContent:"center", margin:"auto", width:"80%", height:"400px", paddingTop:"20px"}}>
                <div class="center-fullwidth">
                    <div class="select-multy">
                        <Select width="50%" 
                        id="test-select" 
                        placeholder="Picture picker" 
                        />
                    </div>
                </div>
                <div class="center-fullwidth">
                    <input type="text" onChange={handleChangeName} class="text-input" placeholder="Csoport neve..."></input>
                </div>
                <div class="center-fullwidth">
                    <input type="text" onChange={handleChangeOwner} class="text-input" placeholder="Csoport felelőse..."></input>
                </div>
                <div class="center-fullwidth">
                    <input type="text" onChange={handleChangeDescription} class="text-input" placeholder="Csoport leírása..."></input>
                </div>

            </div>
      </Dialog>
      </>
  );
}
