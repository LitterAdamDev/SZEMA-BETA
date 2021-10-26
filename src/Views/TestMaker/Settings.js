import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ChooseImageDialog from '../Components/dialogs/ChooseImageDialog'
import Select from 'react-select'

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = a.getMonth()< 10? '0' + a.getMonth() : a.getMonth()
  var date = a.getDate()< 10? '0' + a.getDate() : a.getDate()
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = year + '-' + month  + '-' + date + 'T' + hour + ':' + min;
  return time;
}
export default function Settings({canStep,handleStep,action,data,handleSetup,deleteTest,titles}) {
  const [selectValue,setSelectValue] = React.useState(null)
  const [start,setStart] = React.useState('')
  const [end,setEnd] = React.useState('')

  useEffect(() => {
    setEnd(data.timeOfZH["end"])
    setStart(data.timeOfZH["start"])
  },[data]);

  const handleChange = (event) =>{
    if(event.target.id === "zh"){
        action(event.target.id,event.target.checked)
    }else if(event.target.id === "time-start"){
      action(event.target.id,event.target.value)
      setStart(event.target.value)
    }else if(event.target.id === "time-end"){
      action(event.target.id,event.target.value)
      setEnd(event.target.value)
    }else if(event.target.id === "title"){
      if(titles.includes(event.target.value)){
        handleStep(false)
      }else{
        handleStep(true)
      }
      action(event.target.id,event.target.value)
      setEnd(event.target.value)
    }else{
        action(event.target.id,event.target.value)
    }
  }
  const handleIconChange =(value)=>{
      action("icon",value)
  }
  const handleDeleteTest = () =>{
    if(data["testDetails"].title !== ''){
      deleteTest()
    }
  }
  const handleSetupFront = (newValue, actionMeta) =>{
    setSelectValue({label:newValue["value"], value: newValue["value"]})
    handleSetup({value: newValue.value},null)
  }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Beállítások
      </Typography>
      <Grid 
        container 
        spacing={3}
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{width:"100%", margin: 0}}
      >
        {data["type"] === 'NEW_TEST'?(null) :
        (
          <Grid item xs={12} sm={12} style={{width: "80%"}}>
            <Select 
              id="test-select"
              width="100%"
              style={{width: "100%"}}
              placeholder="Teszt kiválasztása..."
              options={data["tests"].map((test)=>{return {label: test["title"], value : test["title"]}})}
              onChange={handleSetupFront}
              value={selectValue}
            />
          </Grid> 
        )
        }
        {(data["type"] === 'EDIT_TEST') && (
          <input type="button" className="delete-btn" value="Teszt törlése" onClick={handleDeleteTest}/>
        )}
        <Grid item xs={12} sm={12} style={{width: "80%"}}>
          <TextField
            required
            id="title"
            name="title"
            label="Feladatsor neve"
            fullWidth
            disabled={data["type"]==="EDIT_TEST"}
            value={data["testDetails"]["title"]}
            error={(data["type"] !=="EDIT_TEST") && titles.includes(data["testDetails"]["title"])}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} style={{width: "80%"}}>
          <TextField
            required
            fullWidth
            id="description"
            name="description"
            label="Feladatsor leírása"
            value={data["testDetails"]["description"]}
            onChange={handleChange}
          />
        </Grid>
        <Grid 
            item 
            xs={12}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <img className="folder-icon" src={data["testDetails"]["icon"]} alt="Még nincsen hozzáadva icon a feladatsorhoz."></img>
        </Grid>
        <Grid 
            item 
            xs={12}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <ChooseImageDialog path='quizes/quiz_type' action={handleIconChange} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
                <Checkbox 
                    color="secondary" 
                    id="zh"
                    checked={data["isZH"]}
                    onChange={handleChange}
                />
            }
            label="Zárthelyi dolgozat"
          />
        </Grid>
        {data["isZH"]? (
             <Grid 
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12} sm={6} container direction="column" justifyContent="center" alignItems="center">
                    <TextField
                        id="time-start"
                        label="Kezdés időpontja"
                        type="datetime-local"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        value={start}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} container direction="column" justifyContent="center" alignItems="center">
                    <TextField
                        id="time-end"
                        label="Végzés időpontja"
                        type="datetime-local"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        value={end}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        ):(<></>)}
      </Grid>
    </React.Fragment>
  );
}