import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select'

export default function GroupManager({action,data,isZH,actGroup}) {
  const handleGroupChange = (obj,event) =>{
    action(obj.value)
  }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Csoportok kezelése
      </Typography>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {
        isZH? (
            <Grid item xs={12} md={12} style={{width: "80%"}}>
              <Select 
                id="test-select"
                width="100%"
                style={{width: "100%"}}
                placeholder="Csoport kiválasztása..."
                options={data.map((group)=>{return {label: group["title"], value : group["title"]}})}
                onChange={handleGroupChange}
                value={actGroup? {label: actGroup, value: actGroup} :null}
              />
            </Grid>
          ):(
            <Grid item xs={12} md={12}>
              <Typography variant="h6" gutterBottom>
                Csoportokat csak a zárthelyi dolgozatként megjelölt tesztek esetén lehetséges beállítani.
              </Typography>
            </Grid>
            )
        }
      </Grid>
    </React.Fragment>
  );
}