import React, { useState, useEffect, Component } from "react"
import 'firebase/firestore'
import '../../css/TransferList.css'
import Modal from '@material-ui/core/Modal';
import QuestionDataModal from "./QuestionDataModal";
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: 5,
        padding: '2rem 3rem 2rem 4rem',
      },
});

class TransferList extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          activeModalID : "",
      };
    }
    handleChangeLeft = (event) =>{
        if(event.target.checked){
            if(this.props.type === 'questions'){
                var id = event.target.id
                var result = this.props.questions.filter(obj => {
                    return obj.id === id
                })
                this.props.handleModul(result[0], false)
            }else{
                var id = event.target.id
                var result = this.props.group.filter(obj => {
                    return obj.id === id
                })
                this.props.handleGroup(result[0], false)
            }
            
            document.getElementById(id).parentElement.parentElement.classList.toggle('active-transferlist-item')
            document.getElementById(id).parentElement.style.display = 'none'
            document.getElementById(id).parentElement.parentElement.children[1].style.justifyContent = 'center'
            document.getElementById(id).parentElement.parentElement.children[1].style.width = '100%'
        }
        
    }
    handleModulGettingDeleted = () =>{
        if(this.props.containedQuestions){
            this.props.containedQuestions.map((question) =>{
                
                var leftId = question['id']
                document.getElementById(leftId).parentElement.parentElement.classList.toggle('active-transferlist-item')
                document.getElementById(leftId).parentElement.style.display = 'flex'
                document.getElementById(leftId).checked = false
                document.getElementById(leftId).parentElement.parentElement.children[1].style.justifyContent = 'left'
                document.getElementById(leftId).parentElement.parentElement.children[1].style.width = '80%'
            
            })
        }
    }
    handleChangeRight = (event) =>{
        if(!event.target.checked){
            

            if(this.props.type === 'questions'){
                var id = event.target.id
                var leftId = id.replace('-right','')
                var result = this.props.containedQuestions.filter(obj => {
                    return obj['id'] === leftId
                })
                this.props.handleModul(result[0], true)
            }else{
                var id = event.target.id
                var leftId = id.replace('-right','')
                var result = this.props.containedMembers.filter(obj => {
                    return obj['id'] === leftId
                })
                this.props.handleGroup(result[0], true)
             
            }
            document.getElementById(leftId).parentElement.parentElement.classList.toggle('active-transferlist-item')
            document.getElementById(leftId).parentElement.style.display = 'flex'
            document.getElementById(leftId).checked = false
            document.getElementById(leftId).parentElement.parentElement.children[1].style.justifyContent = 'left'
            document.getElementById(leftId).parentElement.parentElement.children[1].style.width = '80%'
        }
    }
    handleQuestionData = (event) =>{
        var id = event.target.id
        var modalID = id.substring(0,id.indexOf('-data')) + '-modal'
        document.getElementById(modalID).style.display = 'flex'
        this.setState({
            activeModalID : modalID
        })
    }
    handleModalClose =(event) =>{
        var id = event.target.id
        var modalID = id.substring(0,id.indexOf('-button')) + '-modal'
        document.getElementById(modalID).style.display = 'none'
        this.setState({
            activeModalID : ""
        })
    }
    render(){
        const { classes } = this.props;
        return(
         <>
            <div class="transferlist">
                <div class="left-transferlist">
                    <div class="transferlist-header">
                        <div class="transferlist-header-text">
                            {this.props.headers[0]}
                        </div>
                    </div>
                    <div class="transferlist-items">
                        {this.props.type === 'group' ? 
                        (
                            this.props.group.map((member) =>{
                                return(
                                <div class={"left-item transfer-item".concat(this.props.usedIDs.includes(member['id'])? " active-transferlist-item" : '')}
                                key={member['id']}>
                                    <div class="transferlist-item-checkbox" >
                                        <input type="checkbox" id={member['id']} onChange={this.handleChangeLeft}/>
                                    </div>
                                    <div class="transferlist-item-parameters">
                                        {member['name'] + ' [' + member['title'] + ']'}
                                    </div>
                                </div>)
                            })
                        ) 
                        : 
                        (
                            this.props.questions.map((question,index) =>{
                                return(
                                <div class={"left-item transfer-item".concat(this.props.usedIDs.includes(question['id'])? " active-transferlist-item" : '')} 
                                     key={question['id']} 
                                >
                                    <div class="transferlist-item-checkbox">
                                        <input type="checkbox" id={question['id']} onChange={this.handleChangeLeft}/>
                                    </div>
                                    <div class="transferlist-item-parameters" id={question['id']  + '-data'}  onClick={this.handleQuestionData}>
                                        {question['question'].substring(0,50) + '...'}
                                    </div>
                                </div>)
                            })
                        )}
                    </div>
                </div>
                <div class="right-transferlist">
                <div class="transferlist-header">
                        <div class="transferlist-header-text">
                            {this.props.headers[1]}
                        </div>
                    </div>
                    <div class="transferlist-items">
                    {this.props.type === 'group' ? 
                        (
                            this.props.containedMembers.map((member) =>{
                                return(
                                <div class="right-item transfer-item" key={member['id'] + '-right'}>
                                    <div class="transferlist-item-checkbox">
                                        <input type="checkbox" id={member['id'] + '-right'} defaultChecked onChange={this.handleChangeRight}/>
                                    </div>
                                    <div class="transferlist-item-parameters">
                                        {member['name'] + ' [' + member['title'] + ']'}
                                    </div>
                                </div>)
                            })
                        ) 
                        : 
                        (
                            this.props.containedQuestions ? (
                            this.props.containedQuestions.map((question) =>{
                                return(
                                <div class="right-item transfer-item" key={question['id']  + '-right'}>
                                    <div class="transferlist-item-checkbox">
                                        <input type="checkbox" id={question['id']  + '-right'} defaultChecked onChange={this.handleChangeRight}/>
                                    </div>
                                    <div class="transferlist-item-parameters" id={question['id']  + '-data'} onClick={this.handleQuestionData}>
                                        {question['question'].substring(0,50) + '...'}
                                    </div>
                                </div>)
                            })) : (
                                null
                            )
                        )}
                    </div>
                </div>
            </div>
            {this.props.questions.map((question,index) =>{
                return(
                    <div class="question-modal"  tabindex="1" id={question['id']  + '-modal'}>
                        <div class="question-modal-content">
                            <div>
                                {index+1}. Kérdés: {question['question']} ({question['points']} pont)
                            </div>
                            { [1, 2, 3, 4].includes(question['quizType'])?( 
                                question['válaszok'].map((answer, index) => (
                                <div>
                                    &diams; {answer}  [{question['helyes'][index]}]
                                </div>
                                ))
                            ):(
                                question['válaszok'].map((answer, index) => (
                                <div>
                                    &diams; {answer}  { question['helyes'][0] === index+1? (<span>[Helyes]</span>):(null)}
                                </div>
                            )))}
                        </div>
                        <div class="question-modal-footer">
                            <button id={question['id']  + '-button'} onClick={this.handleModalClose}>Bezárás</button>
                        </div>

                    </div>
                )
            })}
         </>
        )
    }
}
TransferList.defaultProps = {
        headers : ['Választható', 'Választott'],
        questions : [],
        group: [],
        type: 'questions',
        actModul : undefined,
        handleGroup : undefined,
        handleModul : undefined,
        containedQuestions : undefined,
        containedMembers : undefined,
        actQuiz : undefined,
        usedIDs : []
}
export default withStyles(styles)(TransferList);