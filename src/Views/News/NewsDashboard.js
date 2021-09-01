import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AddNewsDialog from '../Components/dialogs/AddNewsDialog'
import 'firebase/firestore'
import {db} from '../../config/base'
import { withStyles } from "@material-ui/core/styles";
import UpdateNewsDialog from "../Components/dialogs/UpdateNewsDialog";
import DeleteNewsDialog from '../Components/dialogs/DeleteNewsDialog';
import '../../css/NewsDashboard.css'
import "firebase/auth";
import firebase from "../../config/base.js";
import ResHeader from '../Components/ResHeader'

const useStyles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  heroContent: {
    backgroundColor: 'white',
    padding: theme.spacing(8, 0, 6),
    height : "100vh",
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
    padding: theme.spacing(2),
  },
});

class NewsDashboard extends React.Component {
  getUsers = () => {
    db.collection('users')
      .get()
      .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
          const data = doc.data()
          data_from_web.push({...data,id:doc.id})
        })
        this.setState({
            memberBase : data_from_web.sort(this.compare)
        },() =>{
          firebase.auth().onAuthStateChanged((user) => {
            var pos = this.state.memberBase.findIndex(obj => obj['id'] === user['uid'])
            if(pos != -1){
              this.setState({
                selfTitle : this.state.memberBase[pos]['title']
              })
            }
          });
        })
      })
      .catch( error => console.log(error))
  }
  handleCardChanges = () => {
    this.getCards()
  }
  getCards = () => {
    db.collection('news')
      .get()
      .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
          const data = doc.data()
          data_from_web.push({...data,id:doc.id})
        })
        this.setState({cards_array : data_from_web})
      })
      .catch( error => console.log(error))
  }
  constructor(props) {
    super(props);
    this.state = {
      cards_array : [],
      memberBase : [],
      selfTitle: '',
    };
  }
  componentDidMount(){
    this.getCards()
    this.getUsers()
  }
  render(){
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ResHeader />
        <main>
          <div className="news-main">
            <Container maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom className="news-title">
                  Hírek és újdonságok
              </Typography>
              <div>
                <Grid container spacing={1} justify="center">
                  <Grid item>
                   <AddNewsDialog action={this.handleCardChanges} title={this.state.selfTitle}/> 
                  </Grid>
                </Grid>
              </div>
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
                      <Typography>
                        {card["message"]}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent:"centers", display:"table", color: "#1c2442"}}> 
                    <Grid container spacing={2} justify="center"> 
                      <UpdateNewsDialog toUpdate={card} action={this.handleCardChanges} title={this.state.selfTitle}/>
                      <DeleteNewsDialog toUpdate={card} action={this.handleCardChanges}/>
                    </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          </div>
        </main>
      </React.Fragment>
    );
  }
}
export default withStyles(useStyles)(NewsDashboard);