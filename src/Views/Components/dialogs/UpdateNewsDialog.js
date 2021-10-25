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
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import ChooseImageDialog from './ChooseImageDialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'inherited',
    backgroundColor : "#1c2442"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: "#ffffff",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function useForceUpdate(){
  const [value, setValue] = useState(0); 
  return () => setValue(value => value + 1); 
}
var content = ""
export default function UpdateNewsDialog({action, toUpdate, title}) {

  const forceUpdate = useForceUpdate();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();
  const [message, setMessage] = React.useState();
  const [icon, setIcon] = React.useState();

  const handleClickOpen = () => {
    setMessage(toUpdate['message'])
    setIcon(toUpdate['profileImage'])
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) =>{
    setValue(event.target.value);
    
    console.log(event.target.value);
  };

  const handleMessageChange = (event) =>{
    setMessage(event.target.value);
  };
  const handleIconChange = (icon) =>{
    setIcon(icon['src']);
  };

  return (
    <div>
      <Tooltip title={<h1 style={{lineHeight:"1.5rem", fontSize:"15px", color: "lightblue" }}>Hír szerkesztése.</h1>}>
      <Button size="small" color ="primary" onClick={handleClickOpen}>
        <EditIcon style={{ color: '#1c2442'}}/>
      </Button>
      </Tooltip>
      <Dialog open={open} style={{zIndex: "10000"}} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" style={{color: "#ffffff"}} onClick={handleClose} aria-label="close">
              <CloseIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Hír szerkesztése
            </Typography>
            <SaveDialog 
              action={action} 
              closeParentDialog={handleClose}
              toSave={
                {
                  'message' : message,
                  'icon': icon,
                  'title' : title,
                }
              } 
              Type="update" 
              id={toUpdate["id"]}
            />
          </Toolbar>
        </AppBar>
          <div class="news-dialog-fullwidth">
            <div class="news-dialog-icon-modifier">
              <img class="news-icon-to-modify" src={icon} alt="Még nincsen hozzáadva icon a poszthoz."></img>
              <ChooseImageDialog path="post_icons" action={handleIconChange}/>
            </div>
          </div>
          <div class="news-dialog-fullwidth">
                <textarea  
                  style={{resize: 'none'}}
                  class="news-dialog-textarea"
                  placeholder="Tartalom"
                  rows="10"
                  onChange={handleMessageChange}
                  value={message}
                />
          </div>
      </Dialog>
    </div>
  );
}
