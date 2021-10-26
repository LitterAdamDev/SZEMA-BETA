import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import 'firebase/firestore'
import {db} from '../../config/base'

export default function ModifyTopicDialog({action, choosen_topic_id, topics, topicNames}) {
    const [open, setOpen] = React.useState(false);
    const [saveable, setSaveable] = React.useState(true)
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    const handleClickOpen = () => {
        let pos = topics.findIndex(obj =>obj.id === choosen_topic_id)
        if(pos !== -1){
            setName(topics[pos].Topicname)
            setDescription(topics[pos].Description)
        }
        setOpen(true);
        
    };

    const handleClose = () => {
        setOpen(false)
    };
    const handleSave = () => {
        db.collection('topics')
            .doc(choosen_topic_id)
            .update({Topicname: name, Description: description})
            .catch((err) =>{
                console.log("ERROR: ", err)
            })
            .finally(()=>{
                setOpen(false)
                action({Topicname: name, Description: description})
            })
    };
    const handleNameChange = (event) =>{
        event.preventDefault()
        setName(event.target.value)
        if(topicNames.includes(event.target.value)){
            setSaveable(false)
        }else{
            if(!saveable){
                setSaveable(true)
            }
        }
    }
    const handleDescriptionChange = (event) =>{
        event.preventDefault()
        setDescription(event.target.value)
    }
    return (
        <>
            <input type="button"onClick={handleClickOpen} disabled={choosen_topic_id === undefined} className="action modify-topic" value="Módosítás"/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Témakör módosítása</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Adja meg az témakör új nevét és leírásást.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Témakör neve"
                    fullWidth
                    variant="standard"
                    value={name}
                    error= {!saveable}
                    onChange={handleNameChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="desctiption"
                    label="Témakör leírása"
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Mégse</Button>
                <Button onClick={handleSave}>Módosítás</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
