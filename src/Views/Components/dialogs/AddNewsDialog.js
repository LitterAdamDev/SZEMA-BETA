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
import Tooltip from '@material-ui/core/Tooltip';
import ImageSelector from '../ImageSelector';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor : "#1c2442"
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

export default function AddNewsDialog({action,title}) {

  const forceUpdate = useForceUpdate();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [icon, setIcon] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
    setMessage('')
    setIcon('')
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMessageChange = (event) =>{
    setMessage(event.target.value);
  };
  const handleIconChange = (icon) =>{
    setIcon(icon['src']);
  };

  return (
    <>
      <Tooltip title={<h1 style={{lineHeight:"1.5rem", fontSize:"15px", color: "lightblue" }}>Ezzel a gombbal hozzáadható egy új hír.</h1>}>
      <Button variant="contained" color="primary" className="news-button" onClick={handleClickOpen}>
        Új hír létrehozása
      </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} style={{zIndex: "10000", height: "100vh"}} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Új hír létrehozása
            </Typography>
            <SaveDialog
              closeParentDialog = {handleClose} 
              action={action}
              toSave={
                {
                  'message' : message,
                  'icon' : icon,
                  'title' : title,
                }
              } 
              Type="save"/>
          </Toolbar>
        </AppBar>
            <div class="news-dialog-fullwidth">
              <div 
                style={{
                  fontWeight: 900,
                  fontSize: "6vh",
                  paddingTop: "6vh"
                }}
              >
                Ikon kiválasztása
              </div>
              <div class="news-dialog-iconpicker">
                  <ImageSelector path="post_icons" action={handleIconChange}/>
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
    </>
  );
}
