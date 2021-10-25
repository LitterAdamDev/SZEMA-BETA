import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N']

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function ActionsInAccordionSummary({dataset,action}) {
  const classes = useStyles();
  const [questions,setQuestions] = React.useState([])
  const [choosen, setChoosen] = React.useState('')
  useEffect(() => {
    setQuestions(dataset)
    action('')
  },[]);
  useEffect(() => {
    setQuestions(dataset)
    console.log(dataset)
  },[dataset]);

  const handleChange = (event) =>{
    let id = event.target.id
    if(event.target.checked){
      setChoosen(id)
      action(id)
    }else{
      setChoosen('')
      action('')
    }
  }
  return (
    <div className={classes.root}>
      {(questions && questions[0])? (questions.map((question)=>{

        return(
          <Accordion key={question.id}>
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
                control={<Checkbox id={question['id']} onChange={handleChange} disabled={(question.id !== choosen) && (choosen !== '')}/>}
                label={question.question + ' [' + question.points + ' pont]'}
              />
            </AccordionSummary>
            <AccordionDetails>
              <div className="question-body">
                {
                    question?
                    question.isPicture &&
                    (
                        <img alt="Hiba" className="question-picture" src={question?question.picture: ""}/>
                    ):""
                }
                {
                    question?question.answers.map((answer,index)=>{
                        return (
                            <div className="question-answer" 
                            style={
                                (question.type === 0 && question.rightAnswer-1 === index) || 
                                (question.type === 1 && question.rightAnswer[index])|| 
                                (question.type === 3)? {background: "green", fontWeight:"700"}: {}}>
                                <div className="option">
                                    {[3,4].includes(question.type)?
                                        (
                                            abc[index]+". Kérdés: " + answer
                                        ):(
                                            abc[index]+". Lehetőség: " + answer
                                        )
                                    }
                                    
                                </div>
                                <div className="answer">
                                    {
                                        question.type === 0 && (
                                            question.rightAnswer-1 === index? "Helyes": ""
                                        )
                                    }
                                    {
                                        question.type === 1 && (
                                            question.rightAnswer[index]? "Helyes": "Helytelen"
                                        )
                                    }
                                    {
                                        question.type === 2 && (
                                            null
                                        )
                                    }
                                    {
                                        question.type === 3 && (
                                          <>
                                            {"Helyes válasz: " + question.rightAnswer[index]}
                                          </>                                        
                                        )
                                    }
                                    {
                                        question.type === 4 && (
                                            <img alt="megoldás" className="answer-picture" src={question.rightAnswer[index]} />
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }):""
                }
              </div>
            </AccordionDetails>
          </Accordion>
        )
      })):""}
    </div>
  );
}
