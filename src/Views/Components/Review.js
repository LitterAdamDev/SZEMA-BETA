
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  }
}));
var quizTypes = [1, 2, 3, 4]
export default function Review({quiz}) {
  const classes = useStyles();
  const generateQuestionModals = (question,index) =>{

      var header = (
          <>
              <div class="modal-content-question">
                  {question['question']} ({question['points']} pont)
              </div>
              <div class="modal-content-image">
                  {question['isPicture'] ? (
                      <img src={question["picture"]}></img>
                  ):(
                      <></>
                  )}
              </div>
              <div class="modal-content-answers">
                  {
                      question['quizType'] === 0?
                      (
                          <>
                              {question['válaszok'].map((answer,indexa) =>{
                                      return(
                                          <div class={"answer-type-0" + (question['helyes'] === (indexa+1)? " good-answer" : "")}>
                                            <strong>{['A','B','C','D','E','F','G'][indexa]}. lehetőség:</strong>{ "\t" + answer}
                                          </div>
                                      )
                              })}
                          </>
                      ):(
                          question['quizType'] === 1?
                          (
                              <>
                                  {question['válaszok'].map((answer,indexa) =>{
                                          return(
                                              <div class={"answer-type-0" + (question['helyes'][indexa]? " good-answer" : "")}>
                                              <strong>{['A','B','C','D','E','F','G'][indexa]}. lehetőség:</strong>{ "\t" + answer}
                                              </div>
                                          )
                                  })}
                              </>
                          ):(
                              question['quizType'] === 3?
                              (
                                  <>
                                      {question['válaszok'].map((answer,indexa) =>{
                                      return(
                                          <div class={"answer-type-0"}>
                                              <strong>{['A','B','C','D','E','F','G'][indexa]}. megoldás:</strong>{ "\t" + answer + "\t"}<var class="good-answer">{question['helyes'][indexa]}</var>
                                          </div>
                                      )
                                      })}
                                  </>
                              ):(
                                  question['quizType'] === 4?
                                  (
                                      <>
                                          {question['válaszok'].map((answer,indexa) =>{
                                              return(
                                                  <div class={"answer-type-0"}>
                                                      <strong>{['A','B','C','D','E','F','G'][indexa]}. megoldás:</strong><span class="good-answer">{ "\t" + answer + "\t"}</span><img class="good-answer-img" src={question['helyes'][indexa]}></img>
                                                  </div>
                                              )
                                          })}
                                      </>
                                  ):(
                                      <></>
                                  )
                              )
                          )
                      )
                  }
              </div>
          </>    
      )
          return(header) 
  }
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom style={{marginBottom:'50px',textAlign: 'center'}}>
        Áttekintés
      </Typography>
      { quiz['modules'] !== undefined && quiz['modules'].length !== 0 ? (
        quiz['modules'].map((modul) => (
          <React.Fragment>
            <Typography variant="h4" display="block" gutterBottom>
            &#10147; {modul['name']}
            </Typography>
            { modul.hasOwnProperty('questions') && modul ? (
              modul['questions'].map((question,index) => (
                <div class="review-question">
                  <Divider/>
                  {generateQuestionModals(question,index)}
                </div>
              ))):
              (
                <React.Fragment>
                  <Divider/>
                  <Typography variant="body2" style={{textIndent:"50px"}} display="block" gutterBottom>
                    Nincsenek hozzáadva kérdések a modulhoz.
                  </Typography>
                </React.Fragment>
              )
            }
          </React.Fragment>
      ))):(
          <Typography variant="body2" display="block" gutterBottom>
                  Nincsenek hozzáadva modulok a feladatsorhoz.
          </Typography>
      )
    }
    </React.Fragment>
  );
}