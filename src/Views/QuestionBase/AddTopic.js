import {db} from '../../config/base'
import {useState} from 'react';
  
const AddTheme = () => {
    const [topic_name  , SetTopicName] = useState("");
    const [description , SetDescription] = useState("");
    const [created_by , SetCreatedBy] = useState("");
    
    const sub = (e) => {
        e.preventDefault();

        // Add data to the store
        db.collection("topics").add({
            Topicname: topic_name,
            Description: description,
            Createdby: created_by
        })
        .then((docRef) => {
            alert("A téma sikeresen létrehozva!");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
  
    return (
        <div>
            <center>
                <form style={{marginTop:"20vw", borderStyle: "dotted" }}
                  onSubmit={(event) => {sub(event)}}>
                    <input type="text" placeholder="Téma neve"
                      onChange={(e)=>{SetTopicName(e.target.value)}} />
                      <br/><br/>
                    <input type="text" placeholder="Téma leírása"
                      onChange={(e)=>{SetDescription(e.target.value)}}/>
                      <br/><br/>
                    <input type="text" placeholder="Létrehozó neve"
                      onChange={(e)=>{SetCreatedBy(e.target.value)}}/>
                      <br/><br/>
                    <button type="submit">Felvétel</button>
                </form>
            </center>
        </div>
    );
}
  
export default AddTheme;