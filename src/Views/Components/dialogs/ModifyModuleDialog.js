import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import "firebase/auth"
import { makeStyles } from '@material-ui/core/styles'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import ChooseImageDialog from './ChooseImageDialog'


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

export default function ModifyModuleDialog({path,action,options,index,dataset}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [icon, setIcon] = React.useState(null);
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
  const handleIcon = (image) =>{
    setIcon(image['src'])
  }
  const handleModifyModul = (event) => { 
    action(event,{'description' : description, 'icon' : icon})
    setOpen(false);
  };

  return (
      <>
      <a>
        <button className="modul-button" onClick={handleClickOpen}>
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
        <form class="dialog-form" autoComplete="off">
          <div class="dialog-form-field">
            <img class="folder-icon" src={icon} alt="Még nincsen hozzáadva icon a modulhoz."></img>
            <ChooseImageDialog path={path} action={handleIcon}/>
          </div>
          <div class="dialog-form-field">
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
          </div>
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