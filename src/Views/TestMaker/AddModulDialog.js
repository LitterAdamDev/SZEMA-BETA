import React,{ useEffect } from 'react';
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
import ImageSelector from '../Components/ImageSelector'


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

export default function AddModuleDialog({setCanStep, zerotype, path, action, allModul}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState(null);
  const [allM, setAllM] = React.useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (event) => {
    event.preventDefault()
    setDescription('')
    setOpen(true);
    setAllM(allModul)
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDescription = (event) =>{
    setDescription(event.target.value)
  }
  const handleName = (event) =>{
    if(allModul.includes(event.target.value)){
      setCanStep(false)
    }else{
      setCanStep(true)
    }
    setName(event.target.value)
  }
  const handleIcon = (image) =>{
    setIcon(image['src'])
  }
  const handleAddModul = (event) => { 
    if(!allModul.includes(name)){
      if(zerotype){
        action(0,{'description' : description, 'icon' : icon, 'name' : name})
      }else{
        action({'description' : description, 'icon' : icon, 'name' : name})
      }
      setOpen(false);
    }
  };

  return (
      <>
      <input type="button" className="add-modul-btn" value="+" onClick={handleClickOpen}/>
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
            <ImageSelector path={path} action={handleIcon} fullWidth/>
            <br/>
            {allM}
            <TextField
                autoFocus
                margin="dense"
                id="module-description-input"
                label="Modul neve"
                type="text"
                fullWidth
                className={allM.includes(name)? "wrong-input":""}
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
            Hozzáadás
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}