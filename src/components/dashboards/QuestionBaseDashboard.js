import React, { useState, useEffect } from "react";
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SignedInStarterLinks from '../SignedInStarterLinks'
import 'firebase/firestore'
import { withStyles } from "@material-ui/core/styles";
import SearchField from 'react-search-field';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';



//for lists
function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

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
  themeQuestions: {

    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  questionManage: {
    display: 'flex',
    flexDirection: 'column',

  }
});

class QuestionBaseDashboard extends React.Component {

  
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
              <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                 Kérdésbázis
              </Typography>
            </Container>

            <center>
            <SearchField placeholder='Keresés a kérdések között...'  /> <style> white-space: normal;</style>
            <SearchField placeholder='Keresés a témakörök között...'  />

            <h1>Témakörök a kérdésekhez</h1>
      <div className={classes.themeQuestions}>
      
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders"> 
        <ListItem button> {/*  simple button */}
          <ListItemText primary="Térelemek ábrázolása" />
        </ListItem>
        <ListItemLink href="#simple-list">  {/*  LINK! */}
          <ListItemText primary="Síklapú testek vetületi ábrázolása" /> 
        </ListItemLink>
        <ListItem button>
          <ListItemText primary="Forgástestek vetületi ábrázolása" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Áthatások/Vetítési. Rajzi egyszerűsítések" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Metszeti ábrázolás" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Méretmegadás műszaki rajzokon" />
        </ListItem>
      </List>

      



    </div>

    <div className={classes.questionManage}><h1>Kérdések a ... témakörön belül</h1></div>

    
    <div className={classes.themeQuestions}><Divider />
    <List component="nav" aria-label="secondary mailbox folders">  
          <ListItem button> {/*  simple button */}
          <ListItemText primary="Elso kerdes" />
          </ListItem>
          <ListItem button> {/*  simple button */}
          <ListItemText primary="Masodik kerdes" />
          </ListItem>
          <ListItem button> {/*  simple button */}
          <ListItemText primary="Harmadik kerdes" />
          </ListItem>
          <ListItem button> {/*  simple button */}
          <ListItemText primary="Negyedik kerdes" />
          </ListItem>
    </List>
    </div>


    </center>

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
export default withStyles(useStyles)(QuestionBaseDashboard);