import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ButtonAppBar from './ButtonAppBar';
import Grid from '@material-ui/core/Grid';
function QuestionBaseDashboard() {
    return (
        <React.Fragment>
            <CssBaseline />
            
            <Container maxWidth="sm" style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
                <Grid item xs={12}>
                    <ButtonAppBar/>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary"/>
                </Grid>
                
            </Container>
        </React.Fragment>
    )
}

export default QuestionBaseDashboard
