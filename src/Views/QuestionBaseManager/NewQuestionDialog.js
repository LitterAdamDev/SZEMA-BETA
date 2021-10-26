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
import ChooseImageDialog from '../Components/dialogs/ChooseImageDialog'
import Select from 'react-select'
import Radio from '@mui/material/Radio';

export default function ModifyQuestionDialog({topics, action, choosen_question_id, questions}) {
    const [open, setOpen] = React.useState(false)
    const [question, setQuestion] = React.useState({})
    const [right, setRight] = React.useState(1)
    const [type, setType] = React.useState({label: 'Egy jó válasz.', value : 0})
    const handleClickOpen = () => {
        setOpen(true)
        setQuestion({
            type : 0,
            question : '',
            isPicture : false,
            picture: '',
            answers: [""],
            rightAnswer: 1,
            points: 0,
            topicName: topics[0].Topicname
        })
        setType({label: 'Egy jó válasz.', value : 0})
    };
    const handleTypeChange = (value, event) =>{
        setType(value)
        if(value.value === 0){
            setQuestion({
                type : 0,
                question : '',
                isPicture : false,
                picture: '',
                answers: [""],
                rightAnswer: 1,
                points: 0,
                topicName: topics[0].Topicname
            })
            setRight(1)
        }else if(value.value === 1){
            setQuestion({
                type : 1,
                question : '',
                isPicture : false,
                picture: '',
                answers: [""],
                rightAnswer: [false],
                points: 0,
                topicName: topics[0].Topicname
            })
            setRight([false])
        }else if(value.value === 3){
            setQuestion({
                type : 3,
                question : '',
                isPicture : false,
                picture: '',
                answers: [""],
                rightAnswer: [""],
                points: 0,
                topicName: topics[0].Topicname
            })
            setRight([""])
        }
    }
    const handleClose = () => {
        setOpen(false)
    };
    const handleSave = () => {
        db.collection('questions')
            .doc()
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
        setRight(arr)
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
        console.log("Before: ", tmp)
        if(type.value === 3){
            tmp.splice(parseInt(pos),0,"")
        }else{
            tmp.splice(parseInt(pos),0,false)
        }
        setRight(tmp)
        console.log("After: ", tmp)
        setQuestion(
            {...question, rightAnswer : tmp, answers :[...arr]}
        )
    }
    return (
    <>
        <input type="button" style={{borderTopLeftRadius: "0px"}} onClick={handleClickOpen} disabled={choosen_question_id !== undefined} className="action new-topic-action" value="Új kérdés"/>
        <Dialog open={open}  onClose={handleClose}>
            <DialogTitle>Kérdés létrehozása</DialogTitle>
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
                <strong>Kérdés típusa:</strong>
                <Select 
                    id="topic-select"
                    placeholder="Feladat típus"
                    options={[{label: 'Egy jó válasz.', value : 0},{label: 'Több jó válasz.', value : 1},{label: 'Kiegészítendő kérdések.', value : 3}]}
                    onChange={handleTypeChange}
                    value={type}
                />
                <br/>
                <br/>
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
                                        <FormControlLabel value={index} control={<Radio value={index} onChange={handleRadioChange} checked={(index+1) == right? true: false} />} label={(index+1) == right? "Helyes":"Helytelenen"} />
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
                                        <FormControlLabel value={index} control={<Checkbox value={index} onChange={handleCheckboxChange} checked={right[index]? true: false} />} label={right[index]? "Helyes":"Helytelenen"} />
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
            <Button onClick={handleSave}>Létrehozás</Button>
            </DialogActions>
        </Dialog>
    </>
  );
}
