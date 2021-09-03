import React from 'react';
import '../../css/Question.css'
import AddQuestionDialog from './AddQuestionDialog';

const abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N']
export default class Question extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }
    componentDidMount(){
    }
    handleDeleteQuestion = () =>{
        this.props.handleDeleteQuestion(this.props.index)
    }
    render() {
      return (
          <>
            <div className="question-container">
                <div className="question-header">
                <div className="question-data">
                    {this.props.data? this.props.data.question: ""}
                </div>
                <div className="question-handler">
                    <input type="button"value="X" onClick={this.handleDeleteQuestion}/>
                </div>
                </div>
                <div className="question-body">
                    {
                        this.props.data?
                        this.props.data.isPicture &&
                        (
                            <img alt="Hiba" className="question-picture" src={this.props.data?this.props.data.picture: ""}/>
                        ):""
                    }
                    {
                        this.props.data?this.props.data.answers.map((answer,index)=>{
                            return (
                                <div className="question-answer" 
                                style={
                                    (this.props.data.type=== 0 && this.props.data.rightAnswer-1 === index) || 
                                    (this.props.data.type=== 1 && this.props.data.rightAnswer[index])? {background: "green", fontWeight:"700"}: {}}>
                                    <div className="option">
                                        {[3,4].includes(this.props.data.type)?
                                            (
                                                abc[index]+". Megoldás: " + answer
                                            ):(
                                                abc[index]+". Lehetőség: " + answer
                                            )
                                        }
                                        
                                    </div>
                                    <div className="answer">
                                        {
                                            this.props.data.type === 0 && (
                                                this.props.data.rightAnswer-1 === index? "Helyes": ""
                                            )
                                        }
                                        {
                                            this.props.data.type === 1 && (
                                                this.props.data.rightAnswer[index]? "Helyes": "Helytelen"
                                            )
                                        }
                                        {
                                            this.props.data.type === 2 && (
                                                null
                                            )
                                        }
                                        {
                                            this.props.data.type === 3 && (
                                                this.props.data.rightAnswer[index]
                                            )
                                        }
                                        {
                                            this.props.data.type === 4 && (
                                                <img alt="megoldás" className="answer-picture" src={this.props.data.rightAnswer[index]} />
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }):""
                    }
                </div>
                <div className="question-footer">
                    <AddQuestionDialog />
                </div>
            </div>
          </>
      )
    }
}
Question.defaultProps ={
    data : undefined,
    index : undefined,
    handleDeleteQuestion : undefined,
}