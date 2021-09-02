import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ChooseImageDialog from '../Components/dialogs/ChooseImageDialog'
import Select from 'react-select'

export default function AddressForm({action,data,handleSetup}) {
  const handleChange = (event) =>{
    if(event.target.id === "zh"){
        action(event.target.id,event.target.checked)
    }else{
        action(event.target.id,event.target.value)
    }
  }
  const handleIconChange =(value)=>{
      action("icon",value)
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
              onChange={handleSetup}
              value={(data["testDetails"]["title"] !== "") && (data["type"] !== 'NEW_TEST')? {label: data["testDetails"]["title"], value : data["testDetails"]["title"]}:null}
            />
          </Grid> 
        )
        }
        <Grid item xs={12} sm={12} style={{width: "80%"}}>
          <TextField
            required
            id="title"
            name="title"
            label="Feladatsor neve"
            fullWidth
            value={data["testDetails"]["title"]}
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
                        defaultValue="2017-05-24T10:30"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} container direction="column" justifyContent="center" alignItems="center">
                    <TextField
                        id="time-end"
                        label="Végzés időpontja"
                        type="datetime-local"
                        defaultValue="2017-05-24T10:30"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        ):(<></>)}
      </Grid>
    </React.Fragment>
  );
}