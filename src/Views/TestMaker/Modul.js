import React from 'react';
import '../../css/Modul.css'
import Question from './Question'
import AddModuleDialog from './AddModulDialog';
import ModifyModulDialog from './ModifyModulDialog';
import AddQuestionDialog from './AddQuestionDialog';

export default class Modul extends React.Component {
    constructor() {
        super();
        this.state = {
            questions : [],
            data: [],
            allModul: [],
        };
    }
    componentDidMount(){
        this.setState({
            allModul: this.props.allModul
        })
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
    handleAddQuestion = (index,id) =>{
        let str = ''
        var tmpArr = this.props.questions
        if(tmpArr[0] === undefined){
            tmpArr = []
        }
        if(tmpArr.length === 0){
            str = id
        }else{
            tmpArr.map((question,idx)=>{
                if(index !== idx){
                    if (str === ''){
                        str = question.id
                    }else{
                        str = str + ':' + question
                    }
                }else{
                    if (str === ''){
                        str = question.id + ':' + id
                    }else{
                        str = str + ':' + question.id + ':' + id
                    }
                }
            })
        }
        if(!str.includes('undefined') && !str.includes('[object Object]')){
            this.props.handleModifyModulQuestions('ADD',{IDs : str, index : this.props.index})
        }
    }
    
    render() {
      return (
          <>
            <div className="modul-container">
                <div className="modul-header">
                    <div className="modul-title-handler">
                        <div className="modul-title">{this.props.data["data"][4]}</div>
                        <div className="modul-handler">
                            <ModifyModulDialog path='quizes/quiz_type' 
                                prerequisite={
                                    this.props.data["data"][1]
                                }  
                                action={this.handleModifyModul} 
                                data={this.props.data["data"]} 
                                allModul={this.props.allModulData}
                            />
                            <input type="button" className="x-icon" value="X" onClick={this.handleDeleteModul}/>
                        </div>
                    </div>
                    <div className="modul-description">
                        {this.props.data["data"][3]}
                    </div>
                </div>
                <div className="modul-body">
                    <AddQuestionDialog 
                        action={this.handleAddQuestion} 
                        zerotype = {true}
                        questions={this.props.allQuestion}
                        usedIDs ={this.props.data.data[0]}
                    />
                    {this.props.questions.map((questionData,index)=>{
                         return questionData?<Question 
                                                key={"question-" + index} 
                                                index={index} 
                                                data={questionData} 
                                                IDs={this.props.data.data[0]} 
                                                handleDeleteQuestion={this.handleDeleteQuestion} 
                                                handleAddQuestion={this.handleAddQuestion} 
                                                allQuestion={this.props.allQuestion}
                                            /> : null
                    })}
                </div>
                <div className="modul-footer">
                    <AddModuleDialog 
                        setCanStep={this.props.setCanStep}
                        path='quizes/quiz_type' 
                        action={this.handleNewModul}
                        allModul={this.props.allModul} 
                    />
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
    handleModifyModulQuestions : undefined,
    allQuestion : [],
    allModulData : [],
    setCanStep : undefined,
    allModul: [],
}