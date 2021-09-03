import React from 'react';
import '../../css/Modul.css'
import Question from './Question'
import AddModuleDialog from './AddModulDialog';
import ModifyModulDialog from './ModifyModulDialog';

export default class Modul extends React.Component {
    constructor() {
        super();
        this.state = {
            questions : [],
            data: []
        };
    }
    componentDidMount(){
        
    }
    handleNewModul = (value) =>{
        this.props.handleAddModul(this.props.index,value)
    }
    handleDeleteModul = () =>{
        this.props.handleDeleteModul(this.props.index)
    }
    handleModifyModul = (data) =>{
        this.props.handleModifyModul(this.props.index,data)
    }
    handleModifyQuestionsOfModul = (type) =>{
        this.props.handleModifyModulQuestions()
    }
    handleDeleteQuestion = (index) =>{
        this.props.handleModifyModulQuestions('REMOVE',{id: this.props.questions[index]["id"], index : this.props.index})
    }
    render() {
      return (
          <>
            <div className="modul-container">
                <div className="modul-header">
                    <div className="modul-title-handler">
                        <div className="modul-title">{this.props.data["data"][4]}</div>
                        <div className="modul-handler">
                            <ModifyModulDialog path='quizes/quiz_type' action={this.handleModifyModul} data={this.props.data["data"]}/>
                            <input type="button" value="X" onClick={this.handleDeleteModul}/>
                        </div>
                    </div>
                    <div className="modul-description">
                        {this.props.data["data"][3]}
                    </div>
                </div>
                <div className="modul-body">
                    {this.props.questions.map((questionData,index)=>{
                         return questionData?<Question key={"question-" + index} index={index} data={questionData} handleDeleteQuestion={this.handleDeleteQuestion}/> : null
                    })}
                </div>
                <div className="modul-footer">
                    <AddModuleDialog path='quizes/quiz_type' action={this.handleNewModul}/>
                </div>
            </div>
          </>
      )
    }
}
Modul.defaultProps = {
    index : undefined,
    data : [],
    questions : [],
    handleAddModul : undefined,
    handleDeleteModul : undefined,
    handleModifyModul : undefined,
    handleModifyModulQuestions : undefined
}