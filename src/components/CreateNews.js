import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Component } from 'react';
import { createNews } from '../store/actions/newsActions';
import { connect } from 'react-redux';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class CreateNews extends Component{
  state = {
      date: '',
      message: '',
      profileImage: '',
      user: ''
  }
  handleChange = (e) => {
   this.setState({
       [e.target.id]: e.target.value
   })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.createNews(this.state);
  }
  render(){
    const {classes} = this.props;
    return (
        <Container component="main" maxWidth="xs">
        <Typography component="div" style={{ backgroundColor: 'white', height: '70vh', width: '50vh' }}>
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Új hír létrehozása
            </Typography>
            <form className={classes.form} noValidate  onSubmit={this.handleSubmit}>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="date"
                label="Dátum"
                name="date"
                disabled
                onChange={this.handleChange}
            />{new Date().getUTCDate}
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="message"
                label="Tartalom"
                type="text"
                id="message"
                autoComplete="current-password"
                onChange={this.handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Küldés
            </Button>
            </form>
        </div>
        </Typography>
        </Container>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    createNews : news => dispatch(createNews(news))
  };
}
export default withStyles(useStyles)(connect(null, mapDispatchToProps)(CreateNews))