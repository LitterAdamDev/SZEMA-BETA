import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import 'firebase/firestore'
import "firebase/storage"
import {db, storage} from '../../config/base'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import firebase from "firebase/app"
import ImageSelector from '../Components/dialogs/ChooseImageDialog'
import ChooseImageDialog from '../Components/dialogs/ChooseImageDialog'
import Select from 'react-select'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';

export default function ModifyQuestionDialog({topics, action, choosen_question_id, questions}) {
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = React.useState({})
    const [file, setFile] = React.useState({})
    const [right, setRight] = React.useState(1)

    const handleClickOpen = () => {
        setOpen(true)
        let pos = questions.findIndex(obj =>obj.id === choosen_question_id)
		if(pos !== -1){
            setQuestion({...questions[pos]})
            setRight(questions[pos].rightAnswer)
		}
        
    };

    const handleClose = () => {
        setOpen(false)
    };
    const handleSave = () => {
        db.collection('questions')
            .doc(choosen_question_id)
            .set(question)
            .catch((err) =>{
                console.log("ERROR: ", err)
            })
            .finally(()=>{
                action()
                setOpen(false)
            })
    };
    const handleIsPicture = (event) =>{
        if(event.target.checked){
            setQuestion(
                {...question, isPicture : true}
            )
        }else{
            setQuestion(
                {...question, isPicture : false}
            )
        }
    }
    const handleGetImageURL = (event) => {
        event.preventDefault()
        let file = event.target.files[0]
        if(file){
            var storage = firebase.storage()
            var storageRef = storage.ref();
            let folder = 'question_images/'
            storageRef.child(folder + file.name)
            .put(file)
            .then(()=>{
              storageRef.child(folder + file.name).getDownloadURL()
              .then((url) => {
                setQuestion(
                    {...question, picture : url}
                )
              })
              .catch((error) => {
                console.log(error)
              });
            });
        }
    }
    const handleImageSelect = (src) =>{
        setQuestion(
            {...question, picture : src}
        )
    }
    const handleQuestionParameterChange = (event) =>{
        event.preventDefault()
        let validation = true
        let id = event.target.id
        let value = event.target.value
        validation = id === "points" && value < 0 ? false : true
        if(validation){
            setQuestion(
                {...question, [event.target.id] : event.target.value}
            )
        }
    }
    const handleTopicChange = (value,event) =>{
        setQuestion(
            {...question, topicName : value.value}
        )
    }
    const handleAnswerChange = (event) =>{
        event.preventDefault()
        let id = event.target.id
        let value = event.target.value
        let pos = id.split('-')[1]
        let arr = [...question.answers]
        arr[pos] = value
        setQuestion(
            {...question, answers : [...arr]}
        )
    }
    const handleRightAnswerChange = (event) =>{
        event.preventDefault()
        let id = event.target.id
        let value = event.target.value
        let pos = id.split('-')[1]
        let arr = [...question.rightAnswer]
        arr[pos] = value
        setQuestion(
            {...question, rightAnswer : [...arr]}
        )
    }
    
    const handleRadioChange = (event) =>{
        let value = event.target.value
        setQuestion(
            {...question, rightAnswer: parseInt(value)+1}
        )
        setRight(parseInt(value)+1)
    }
    const handleAddAnswer = (event) =>{
        let pos = event.target.name.split('-')[1]
        let arr = [...question.answers]
        if((parseInt(pos)+1) <= right){
            setRight(right + 1)
            setQuestion(
                {...question, rightAnswer : (right + 1)}
            )
        }
        arr.splice(parseInt(pos), 0, "");
        setQuestion(
            {...question, answers : [...arr]}
        )
    }
    const handleDeleteAnswer = (event) =>{
        let pos = event.target.name.split('-')[1]
        let arr = [...question.answers]
        arr.splice(parseInt(pos), 1);
        if(right === (parseInt(pos)+1)){
            setQuestion(
                {...question, rightAnswer : 1}
            )
            setRight(1)
        }else if(right > (parseInt(pos)+1)){
            setQuestion(
                {...question, rightAnswer : (question.rightAnswer-1)}
            )
            setRight(right-1)
        }
        setQuestion(
            {...question, answers : [...arr]}
        )
    }
    const handleCheckboxChange = (event) =>{
        let pos = event.target.value
        let tmp = [...right]
        tmp[parseInt(pos)] = !tmp[parseInt(pos)]
        setRight(tmp)
        setQuestion({...question, rightAnswer : tmp})
    }
    const handleDeleteMultyAnswer = (event) =>{
        let pos = event.target.name.split('-')[1]
        let arr = [...question.answers]
        arr.splice(parseInt(pos), 1);
        let tmp = [...right]
        tmp.splice(parseInt(pos),1)
        setRight(tmp)
        setQuestion(
            {...question, rightAnswer : tmp, answers :[...arr]}
        )
    }
    const handleAddMultyAnswer = (event) =>{
        let pos = event.target.name.split('-')[1]
        let arr = [...question.answers]
        arr.splice(parseInt(pos), 0,'');
        let tmp = [...right]
        if(question.type === 3){
            tmp.splice(parseInt(pos),0,"")
        }else{
            tmp.splice(parseInt(pos),0,false)
        }
        setRight(tmp)
        setQuestion(
            {...question, rightAnswer : tmp, answers :[...arr]}
        )
    }
    return (
    <>
        <input type="button" onClick={handleClickOpen} disabled={choosen_question_id === undefined} className="action new-topic-action" value="Módosítás"/>
        <Dialog open={open}  onClose={handleClose}>
            <DialogTitle>Kérdés módosítása</DialogTitle>
            <DialogContent style={{textAlign: "center",}}>
            <div className="question-image-handler">
                <FormControlLabel control={<Checkbox onClick={handleIsPicture}  checked={question['isPicture']}/>} label="Tartozik a feladathoz kép?"/>
                {
                    question.isPicture && (
                        <>
                            <img alt="Hiba" className="questions-picture" src={question?question.picture: ""}/>
                            <ChooseImageDialog path="/question_images" action={handleImageSelect}/>
                            <a>
                                <input type="file" id="file" accept=".jpg, .png, .jpeg" onChange={handleGetImageURL}/>
                            </a>
                        </>
                    )
                }
            </div>
            <h2 onClick={()=>{console.log(question.answers)}}>Kérdése tulajdonságai</h2>
            <div className="question-detail-handler">
                <TextField
                    autoFocus
                    margin="dense"
                    id="question"
                    label="Kérdés"
                    fullWidth
                    variant="standard"
                    value={question.question}
                    onChange={handleQuestionParameterChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="points"
                    label="Pontok"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={question.points}
                    onChange={handleQuestionParameterChange}
                />
                <br/>
                <br/>
                <Select 
                    id="topic-select"
                    placeholder="Témakör"
                    options={topics.map((topic)=>{return {label: topic.Topicname, value : topic.Topicname}})}
                    onChange={handleTopicChange}
                    value={{label: question.topicName, value: question.topicName}}
                />
            </div>
            <h2>Válaszok</h2>
            <div className="question-answer-handler">
                {
                    question['type'] === 0 && ( 
                    <>
                        {question['answers'].map((answer,index)=>{
                            return (
                                <>
                                    <div className="answer-counters">
                                        {index+1 + ". lehetőség: "}
                                    </div>
                                    <div className="answer-content">
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id={"answer-" + index}
                                        label={(index+1) + ". válasz"}
                                        fullWidth
                                        variant="standard"
                                        value={answer}
                                        onChange={handleAnswerChange}
                                    />
                                    </div>
                                    <div className="answer-type">
                                        <FormControlLabel value={index} control={<Radio value={index} onChange={handleRadioChange} checked={(index+1) == right? true: false} />} label={(index+1) == right? "Helyes":"Helyetelen"} />
                                    </div>
                                    <div className="answer-handler">
                                        <input type="button" value="-" disabled={question.answers.length === 1} className="answer-handler-btn" name={"btn-"+index} onClick={handleDeleteAnswer}/>
                                        <input type="button" value="+" className="answer-handler-btn" name={"btn-" + index} onClick={handleAddAnswer}/>
                                    </div>
                                </>
                            )
                        })}
                    </>
                    )
                }
                {
                    question['type'] === 1 && ( 
                    <>
                        {question['answers'].map((answer,index)=>{
                            return (
                                <>
                                    <div className="answer-counters">
                                        {index+1 + ". lehetőség: "}
                                    </div>
                                    <div className="answer-content">
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id={"answer-" + index}
                                        label={(index+1) + ". válasz"}
                                        fullWidth
                                        variant="standard"
                                        value={answer}
                                        onChange={handleAnswerChange}
                                    />
                                    </div>
                                    <div className="answer-type">
                                        <FormControlLabel value={index} control={<Checkbox value={index} onChange={handleCheckboxChange} checked={right[index]? true: false} />} label={right[index]? "Helyes":"Helyetelen"} />
                                    </div>
                                    <div className="answer-handler">
                                        <input type="button" value="-" disabled={question.answers.length === 1} className="answer-handler-btn" name={"btn-"+index} onClick={handleDeleteMultyAnswer}/>
                                        <input type="button" value="+" className="answer-handler-btn" name={"btn-"+index} onClick={handleAddMultyAnswer}/>
                                    </div>
                                </>
                            )
                        })}
                    </>
                    )
                }
                {
                    question['type'] === 3 && ( 
                    <>
                        {question['answers'].map((answer,index)=>{
                            return (
                                <>
                                    <div className="answer-content">
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id={"answer-" + index}
                                            label={(index+1) + ". kérdés"}
                                            fullWidth
                                            variant="standard"
                                            value={answer}
                                            onChange={handleAnswerChange}
                                        />
                                    </div>
                                    <div className="answer-type">
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id={"answer-" + index}
                                            label={(index+1) + ". válasz"}
                                            fullWidth
                                            variant="standard"
                                            value={question.rightAnswer[index]}
                                            onChange={handleRightAnswerChange}
                                        />
                                    </div>
                                    <div className="answer-handler">
                                        <input type="button" value="-" disabled={question.answers.length === 1} className="answer-handler-btn" name={"btn-"+index} onClick={handleDeleteMultyAnswer}/>
                                        <input type="button" value="+" className="answer-handler-btn" name={"btn-"+index} onClick={handleAddMultyAnswer}/>
                                    </div>
                                </>
                            )
                        })}
                    </>
                    )
                }
                {
                    question['type'] === 4 && ( 
                    <>
                    </>
                    )
                }
            </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Mégse</Button>
            <Button onClick={handleSave}>Módosítás</Button>
            </DialogActions>
        </Dialog>
    </>
  );
}
