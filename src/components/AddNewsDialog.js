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
import firebase from "firebase/app";
import 'firebase/firestore'
import {db} from './config'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function useForceUpdate(){
  const [value, setValue] = useState(0); 
  return () => setValue(value => value + 1); 
}

export default function AddNewsDialog() {

  const forceUpdate = useForceUpdate();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();

  const getCurrentDate = (separator='-') =>{
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) =>{
    setValue(event.target.value);
  };


  const handleSave = () => { 
    db.collection("news")
        .add({
            date: getCurrentDate(),
            message: value,
            profileImage:`https://firebasestorage.googleapis.com/v0/b/szema-ac882.
                      appspot.com/o/management.png?alt=media&token=1ded933d-08
                      ca-40f2-8180-bbcd7dffb767`,
            user: "Admin"
        })
        .catch( error => console.log(error));
    setOpen(false);
   /*forceUpdate();*/
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Új hír létrehozása
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Új hír létrehozása
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSave}>
              Mentés
            </Button>
          </Toolbar>
        </AppBar>
            <div style={{display: "inline-flex", justifyContent: "center",alignContent:"center", margin:"auto", width:"80%", height:"400px", paddingTop:"20px"}}>
                <textarea 
                    placeholder="Tartalom"
                    style={{
                        margin:"auto",
                        width:"100%",
                        height:"100%",
                        padding:"12px,20px", 
                        boxSizing:"border-box",
                        borderRadius:"4px",
                        backgroundColor:"azure",
                        fontSize:"32px",
                        resize:"none",
                    }}
                    onChange={handleChange}
                />
            </div>
      </Dialog>
    </div>
  );
}
