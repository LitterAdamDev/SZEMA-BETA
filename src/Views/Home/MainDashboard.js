import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import 'firebase/firestore'
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import 'firebase/firestore'
import {db} from '../../config/base'
import ResHeader from '../Components/ResHeader'
import '../../css/Home.css'

const useStyles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
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
  root:{
    flexGrow: 1,
    textAlign: 'center',
    textTransform: "none",
    height: "100"
  },
  cardGrid: {
    marginTop:"10vh"
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
    padding: theme.spacing(2),
    backgroundColor: "#1c2442",
  },
});

class CreateTestDashboard extends React.Component {

  getCards = () => {
    db.collection('news')
      .orderBy("date","desc")
      .limit(3)
      .get()
      .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
          const data = doc.data()
          data_from_web.push({...data,id:doc.id})
        })
        this.setState({
          cards_array : data_from_web
        })
      })
      .catch( error => console.log(error))
  } 
  constructor(props) {
    super(props);
    this.state = {
      cards_array : [],
    };
  }
  componentDidMount(){
    this.getCards();
    this.state.cards_array.sort()
  }
  handleClickOnText = (event) =>{
    var id = event.target.id
    var pos = this.state.cards_array.findIndex(obj => obj['id'] === id)
    if(document.getElementById(id).innerText.length === 38){
      if (pos > -1) {
          document.getElementById(id).innerText = this.state.cards_array[pos]['message']
      }
    }else{
          document.getElementById(id).innerText = this.state.cards_array[pos]['message'].substring(0,35) + '...'
    }
    
  }
  render(){
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <ResHeader />
        <main>
          {/* Hero unit */}
          <div className="home-main">
            <Container maxWidth="sm">
              <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom className="main-title"> 
                 Üdvözlünk a SZEMA honlapján!
              </Typography>
              <Grid className={classes.root} container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button variant="contained" size="large" href="/questionbase" className="main-button">
                    Kérdésbázis megtekintése
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4} >
                  <Button variant="contained" size="large" href="/createtest" className="main-button">
                    Feladatsorok kezelése
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Button variant="contained" size="large" href="/news" className="main-button">
                    Hírek létrehozása
                  </Button>
                </Grid>
              </Grid>
            </Container>
            <Container className={classes.cardGrid} maxWidth="md">
              <Grid container spacing={4}>
              {this.state.cards_array.map((card) => (
                <Grid item key={card["id"]} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={card["profileImage"]}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card["user"]+ " " + card["date"]}
                      </Typography>
                      <Typography id={card["id"]} onClick={this.handleClickOnText}>
                        {card["message"].substring(0,35) + '...'}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent:"centers", display:"table",textTransform: "capitalize"}}> 
                    <Button size="small" href="/news" color="primary" style={{textTransform: "none", color: "#1c2442"}}>
                      További hírek
                    </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          </div>
        </main>
        {/*<footer>
        <Typography variant="subtitle1" align="center" color="white" component="p">
              <strong>SZEMA - </strong>Széchenyi István Egyetem
          </Typography>
          <Typography variant="subtitle1" align="center" color="white" component="p">
              Biró István - istvanbiro.bwe@gmail.com - 06-30-403-9089 
          </Typography>
        </footer>*/}
        <footer className={classes.footer} style={{color: "red"}}>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p">
          <div className="footer-text" style={{color: "white"}}>
          <strong>SZEMA - </strong>Széchenyi István Egyetem
          </div>
        </Typography>
      </footer>
      </React.Fragment>
    );
  }
}
export default withStyles(useStyles)(CreateTestDashboard);