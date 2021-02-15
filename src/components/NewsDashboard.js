import React from 'react';
import { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import NewsDetails from './NewsDetails';
import { connect } from 'react-redux';

 class NewsDashboard extends Component {
     render(){
        const {allnews} = this.props;
        return (
            <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }} >
                    <NewsDetails allnews={allnews}/>
                </Typography>
            </Container>
            </React.Fragment>
        );
     }
}
const mapStateToProps = (state) => {
    return{
        allnews: state.news.allnews
    }
}
export default connect(mapStateToProps)(NewsDashboard)