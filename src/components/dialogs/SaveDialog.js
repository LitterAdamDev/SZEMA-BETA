import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import firebase from "../../config/base.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import "firebase/auth";
import { makeStyles } from '@material-ui/core/styles';
import 'firebase/firestore';
import {db} from '../../config/base.js'

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
const getCurrentDate = (separator='-') =>{
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`
  };

export default function SaveDialog({closeParentDialog,action, toSave, Type, id}) {
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
  const handleSave = (event) => { 
    db.collection("news")
    .add({
        date: getCurrentDate(),
        message: toSave['message'],
        profileImage: toSave['icon'],
        user: toSave['title']
    })
    .catch( error => console.log(error))
    .finally(()=>{
     action()
     closeParentDialog()
     setOpen(false);
    })
  };
  const handleUpdate = () => { 
    db.collection("news")
        .doc(id)
        .update({
          date: getCurrentDate(),
          message: toSave['message'],
          profileImage: toSave['icon'],
          user: toSave['title']
        })
        .catch( error => console.log(error))
      .finally(()=>{
        action()
        closeParentDialog()
        setOpen(false);
      })
  };

  return (
    <div>
      <Button className={classes.buttonTitle} color="inherit" onClick={handleClickOpen}>
        Mentés
      </Button>
      <Dialog
        style={{zIndex: "100011"}}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Biztosan szeretné menteni a változtatásokat?"}</DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button  id="save-btn" onClick={Type == "save"? handleSave : handleUpdate} color="inherit" autoFocus>
            Mentés
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}