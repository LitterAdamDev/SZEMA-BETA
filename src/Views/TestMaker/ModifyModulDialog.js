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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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

export default function ModifyModulDialog({prerequisite,path,action,data,allModul}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState(null);
  const [selection, setSelection] = React.useState('')
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (event) => {
    event.preventDefault()
    
    setOpen(true);
    setDescription(data[3])
    setName(data[4])
    setIcon(data[2])
    setSelection(prerequisite)
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
    action({'description' : description, 'icon' : icon, 'name' : name, selection: selection})
    setOpen(false);
  };
  const handleModulSelect = (event) =>{
    let id = event.target.id
    let tmp = selection
    if(event.target.checked){
      if(tmp === ''){
        tmp = id
      }else{
        tmp = tmp + ':' + id
      }
    }else{
      tmp = tmp.replace(id + ':','')
      tmp = tmp.replace(':' + id,'')
      tmp = tmp.replace(id,'')
    }
    setSelection(tmp)
  }
  return (
      <>
      <input type="button" value="handler" onClick={handleClickOpen}/>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
       
      >
        <DialogTitle id="responsive-dialog-title"  style={{width: "100%"}}>
            Modul módosítása
        </DialogTitle>
        <DialogContent className="modify-modul-dialog">
            <img style={{maxHeight: "20vh", border: "inset"}} src={icon} alt="Még nincsen hozzáadva icon a modulhoz."></img>
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
            <div className="multy-modul-picker">
              Előkövetelmények:
            {
              allModul.map((modul,index)=>{
                if(modul.title !== name){
                  return(
                    <Accordion key={index} style={{width: "100%"}}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-label="Expand"
                        aria-controls="additional-actions3-content"
                        id="additional-actions3-header"
                      >
                        <FormControlLabel
                          aria-label="Acknowledge"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<Checkbox id={modul.title} onChange={handleModulSelect} defaultChecked={selection.includes(modul.title)}/>}
                          label={modul.title}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                              {modul.description}
                      </AccordionDetails>
                    </Accordion>
                  )
                }
              })
            }
            </div>
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