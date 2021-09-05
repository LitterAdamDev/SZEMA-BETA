import React, {useEffect} from 'react';
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
import ActionsInAccordionSummary from './ActionsInAccordionSummary'


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

export default function AddQuestionDialog({zerotype,action,questions}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [questionSET, setQuestionSET] = React.useState([]);
  const [question, setQuestion] = React.useState('')
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (event) => {
    event.preventDefault()
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const AddQuestion = () =>{
    if(zerotype){
      action(0,question)
      console.log(question)
    }else{
      action(question)
    }
    setOpen(false);
  }
  useEffect(() => {
    var tmp = [] 
    questions.map((question)=>{
      if(question){
        tmp.push(question) 
      }
    })
    setQuestionSET(tmp)
  },[]);
  return (
      <>
      <input type="button" className="add-modul-btn" value="+" onClick={handleClickOpen}/>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
            Kérdés hozzáadás
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
          {questionSET.length === 0 && 'Nincsenek felhasználatlan kérdések.'}
        </DialogContentText>
        <ActionsInAccordionSummary dataset={questionSET} action={setQuestion}/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="inherit">
            Mégsem
          </Button>
          <Button color="inherit" autoFocus onClick={AddQuestion}>
            Hozzáadás
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}