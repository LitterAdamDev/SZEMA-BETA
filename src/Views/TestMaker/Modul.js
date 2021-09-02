import React from 'react';
import '../../css/Modul.css'
import Question from './Question'

export default class Modul extends React.Component {
    constructor() {
        super();
        this.state = {
            questions : []
        };
    }
    componentDidMount(){
        let questionIDs = this.props.data["data"][0].split(':')
        let questionSet = questionIDs.map((questionID) =>{
            let pos = this.props.questions.findIndex(obj => obj['id'] === questionID)
            if(pos !== -1){
                return this.props.questions[pos]
            }
        })
        this.setState({
            questions : questionSet
        })
    }
    render() {
      return (
          <>
            <div className="modul-container">
                <div className="modul-header">
                    <div className="modul-title-handler">
                        <div className="modul-title">{this.props.data["data"][4]}</div>
                        <div className="modul-handler">
                            <input type="button" value="Handler" />
                        </div>
                    </div>
                    <div className="modul-description">
                        {this.props.data["data"][3]}
                    </div>
                </div>
                <div className="modul-body">
                    {this.state.questions.map((questionData)=>{
                        return <Question data={questionData}/>
                    })}
                </div>
                <div className="modul-footer">
                    +
                </div>
            </div>
          </>
      )
    }
}
Modul.defaultProps = {
    data : [],
    questions : []
}