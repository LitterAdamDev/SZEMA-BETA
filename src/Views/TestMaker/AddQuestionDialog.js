import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import "firebase/auth";
import { makeStyles } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import ActionsInAccordionSummary from './ActionsInAccordionSummary'
import TextField from '@material-ui/core/TextField';
import Select from 'react-select'


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
      backgroundColor: "white",
    },
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

export default function AddQuestionDialog({zerotype,action,questions,usedIDs}) {
const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [questionSET, setQuestionSET] = React.useState([]);
  const [question, setQuestion] = React.useState('');
  const [topics, setTopics] = React.useState(['Összes']);
  const [topicFilter, setTopicFilter] = React.useState('Összes');
  const [filteredQuestions,setFilteredQuestions] = React.useState([]);

  const handleClickOpen = (event) => {
    event.preventDefault()
    var tmp = [] 
    var topicNames = ['Összes']
    if(zerotype){
      questions.map((question)=>{
        if(!usedIDs.includes(question.id)){
          tmp.push(question)
        }
      })
    }else{
      questions.map((question)=>{
        if(question){
          tmp.push(question) 
        }
      })
    }
    questions.map((question)=>{
      if(question && question.topicName){
        if(!topicNames.includes(question.topicName)){
          topicNames.push(question.topicName)
        }
      }
    })
    setQuestionSET(tmp)
    setFilteredQuestions(tmp)
    setTopics(topicNames)
    setOpen(true);
  };
  const handleFilters = (newValue, actionMeta)=>{
    setTopicFilter(newValue.value)
    let tmp = []
    if(newValue.value === 'Összes'){
      setFilteredQuestions(questionSET)
    }else{
      questionSET && questionSET.map((question)=>{
        if(question && question.topicName){
          if(!usedIDs.includes(question.id) && question.topicName === newValue.value)
          tmp.push(question)
        }
      })
      setFilteredQuestions(tmp)
    }
  }
  const handleClose = () => {
    setOpen(false);
  };
  const AddQuestion = () =>{
    if(question === ''){
      setOpen(false);
    }else{
      if(zerotype){
        action(0,question)
      }else{
        action(question)
      }
      setOpen(false);
    }
  }
  return (
      <>
      <input type="button" className="add-question-btn" value="ÚJ KÉRDÉS" onClick={handleClickOpen}/>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" style={{backgroundColor: "#1c2442", color: "#ffffff"}}>
            Kérdés hozzáadás
        </DialogTitle>
        <DialogContent className="question-add-dialog-content">
        <DialogContentText>
          {questionSET.length === 0 && 'Nincsenek felhasználatlan kérdések.'}
        </DialogContentText>
        <div className="question-filters">
          <Select 
            id="test-select"
            style={{width: "100%"}}
            placeholder="Témakör kiválasztása..."
            options={topics && topics.map((topic)=>{return {label: topic, value : topic}})}
            onChange={handleFilters}
            value={{label:topicFilter, value:topicFilter}}
          />
        </div>
        <div className="question-picker">
          <ActionsInAccordionSummary dataset={filteredQuestions} action={setQuestion}/>
        </div>
        </DialogContent>
        <DialogActions style={{backgroundColor: "#1c2442", color: "#ffffff"}}>
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