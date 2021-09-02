import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function GroupManager({handleGroups,groups,isZH}) {
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
          null
          ):(
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Csoportokat csak a zárthelyi dolgozatként megjelölt tesztek esetén lehetséges beállítani.
              </Typography>
            </Grid>
            )
        }
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}