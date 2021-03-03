import React, { useState, useEffect } from "react";
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SignedInStarterLinks from './SignedInStarterLinks'
import 'firebase/firestore'
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
});

class HomeDashboard extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
  }
  render(){
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <SignedInStarterLinks />
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                 Kezőlap
              </Typography>
            </Container>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            SZEMA
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Széchenyi István Egyetem
          </Typography>
          
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}
export default withStyles(useStyles)(HomeDashboard);