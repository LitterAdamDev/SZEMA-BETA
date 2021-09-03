import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import "firebase/auth";
import { makeStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import ChooseImageDialog from '../Components/dialogs/ChooseImageDialog'
import { ControlPointDuplicateOutlined } from '@material-ui/icons';


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

export default function ModifyModulDialog({path,action,data}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (event) => {
    event.preventDefault()
    
    setOpen(true);
    setDescription(data[3])
    setName(data[4])
    setIcon(data[2])
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDescription = (event) =>{
    setDescription(event.target.value)
  }
  const handleName = (event) =>{
    setName(event.target.value)
  }
  const handleIcon = (image) =>{
    setIcon(image)
  }
  const handleAddModul = (event) => { 
    action({'description' : description, 'icon' : icon, 'name' : name})
    setOpen(false);
  };

  return (
      <>
      <input type="button" value="handler" onClick={handleClickOpen}/>
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
            <img class="folder-icon" src={icon} alt="Még nincsen hozzáadva icon a modulhoz."></img>
            <ChooseImageDialog path={path} action={handleIcon}/>
            <br/>
            <TextField
                autoFocus
                margin="dense"
                id="module-description-input"
                label="Modul neve"
                type="text"
                fullWidth
                onChange={handleName}
                value={name}
            />
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
          <Button onClick={handleAddModul} color="inherit" autoFocus>
            Módosítás
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}