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
        let questionSet = []
        questionIDs.forEach((questionID) =>{
            let pos = this.props.questions.findIndex(obj => obj.id === questionID)
            if(pos !== -1){
                questionSet.push(this.props.questions[pos])
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
                            <input type="button" value="X"/>
                        </div>
                    </div>
                    <div className="modul-description">
                        {this.props.data["data"][3]}
                    </div>
                </div>
                <div className="modul-body">
                    {this.state.questions.map((questionData,index)=>{
                        return <Question key={"question-"+index} data={questionData} />
                    })}
                </div>
                <div className="modul-footer">
                    <input className="add-modul-btn" type="button"value="+" />
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