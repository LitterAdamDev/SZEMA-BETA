import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SignedInStarterLinks from './SignedInStarterLinks'

const useStyles = makeStyles((theme) => ({
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
    /*top padding érték túl nagy(csak az üres oldal demonstrálásához kell) */
    paddingTop: theme.spacing(80),
    paddingBottom: theme.spacing(5)
  },
}));
export default function CreateTestDashboard() {
  const classes = useStyles();
  
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
                Feladatsor készítés
            </Typography>
            
            <div className={classes.heroButtons}>
              <Grid container spacing={1} justify="center">
                <Grid item>
                    <Typography component="h1" variant="h6" align="center" color="textPrimary" gutterBottom>
                        Valami leírás
                    </Typography>
                </Grid>
              </Grid>
            </div>
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