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
            <input type="button"onClick={handleClickOpen} disabled={choosen_topic_id === undefined} className="action modify-topic" value="M??dos??t??s"/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>T??mak??r m??dos??t??sa</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Adja meg az t??mak??r ??j nev??t ??s le??r??s??st.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="T??mak??r neve"
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
                    label="T??mak??r le??r??sa"
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>M??gse</Button>
                <Button onClick={handleSave} disabled={!saveable}>M??dos??t??s</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
