import React from 'react';
import Typography from '@material-ui/core/Typography';
import Modul from './Modul'
import Question from './Question'
import '../../css/TestManager.css'



export default class TestManager extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  componentDidMount(){
  }
  render(){
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Feladatsor kezelése
        </Typography>
        <div className="builder-body">
          {this.props.modules.map((module,index) =>{
            return (
              <>
                <Modul key={"modul-"+index} data={module} questions={this.props.questions}/>
              </>
            )
          })}
        </div>
      </React.Fragment>
    );
  }
}

TestManager.defaultProps = {
  modules : [],
  questions : [],
  handleQuestions : undefined,
  handleModules : undefined,
}