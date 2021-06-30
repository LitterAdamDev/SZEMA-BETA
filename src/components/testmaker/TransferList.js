import React, { useState, useEffect, Component } from "react"
import 'firebase/firestore'
import '../../css/TransferList.css'

export default class TransferList extends React.Component {

    constructor(props) {
      super(props);
      this.escFunction = this.escFunction.bind(this);
      this.state = {
          activeModalID : "",
      };
    }
    escFunction(event){
        if(event.keyCode === 27) {
          if(this.state.activeModalID != ""){
            document.getElementById(this.state.activeModalID).style.display = 'none'
            this.setState({
                activeModalID : ""
            })
          }
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }
    handleChangeLeft = (event) =>{
        if(event.target.checked){
            if(this.props.type === 'questions'){
                var id = event.target.id
                var result = this.props.questions.filter(obj => {
                    return obj.id === id
                })
                this.props.handleModul(result[0], false)
            }
            else if(this.props.type === 'multygroup'){
                var id = event.target.id
                var result = this.props.groupBase.filter(obj => {
                    return obj.name === id
                })
                this.props.handleMultyGroups(result[0]['name'], false)
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
            }
            else if(this.props.type === 'multygroup'){
                var id = event.target.id
                var leftId = id.replace('-right','')
                this.props.handleMultyGroups(leftId, true)
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
        if(this.state.activeModalID === ""){
            var id = event.target.id
            var modalID = id.substring(0,id.indexOf('-data')) + '-modal'
            document.getElementById(modalID).style.display = 'flex'
            this.setState({
                activeModalID : modalID
            })
        }
    }
    handleModalClose =(event) =>{
        var id = event.target.id
        var modalID = id.substring(0,id.indexOf('-button')) + '-modal'
        document.getElementById(modalID).style.display = 'none'
        this.setState({
            activeModalID : ""
        })
    }
    generateQuestionModals = (question,index) =>{

        var header = (
            <>
                <div class="modal-content-question">
                    {question['question']} ({question['points']} pont)
                </div>
                <div class="modal-content-image">
                    {question['isPicture'] ? (
                        <img src={question["picture"]}></img>
                    ):(
                        <></>
                    )}
                </div>
                <div class="modal-content-answers">
                    {
                        question['quizType'] === 0?
                        (
                            <>
                                {question['válaszok'].map((answer,indexa) =>{
                                        return(
                                            <div class={"answer-type-0" + (question['helyes'] === (indexa+1)? " good-answer" : "")}>
                                              <strong>{['A','B','C','D','E','F','G'][indexa]}. lehetőség:</strong>{ "\t" + answer}
                                            </div>
                                        )
                                })}
                            </>
                        ):(
                            question['quizType'] === 1?
                            (
                                <>
                                    {question['válaszok'].map((answer,indexa) =>{
                                            return(
                                                <div class={"answer-type-0" + (question['helyes'][indexa]? " good-answer" : "")}>
                                                <strong>{['A','B','C','D','E','F','G'][indexa]}. lehetőség:</strong>{ "\t" + answer}
                                                </div>
                                            )
                                    })}
                                </>
                            ):(
                                question['quizType'] === 3?
                                (
                                    <>
                                        {question['válaszok'].map((answer,indexa) =>{
                                        return(
                                            <div class={"answer-type-0"}>
                                                <strong>{['A','B','C','D','E','F','G'][indexa]}. megoldás:</strong>{ "\t" + answer + "\t"}<var class="good-answer">{question['helyes'][indexa]}</var>
                                            </div>
                                        )
                                        })}
                                    </>
                                ):(
                                    question['quizType'] === 4?
                                    (
                                        <>
                                            {question['válaszok'].map((answer,indexa) =>{
                                                return(
                                                    <div class={"answer-type-0"}>
                                                        <strong>{['A','B','C','D','E','F','G'][indexa]}. megoldás:</strong><span class="good-answer">{ "\t" + answer + "\t"}</span><img class="good-answer-img" src={question['helyes'][indexa]}></img>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    ):(
                                        <></>
                                    )
                                )
                            )
                        )
                    }
                </div>
            </>    
        )
            return(header) 
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
                        {this.props.type === 'group' && this.props.act_group !== 'default'? 
                        (
                            this.props.group.map((member) =>{
                                return(
                                <div class={"left-item transfer-item".concat(member['group'] !== undefined? " active-transferlist-item" : '')}
                                key={member['id']}>
                                    <div class="transferlist-item-checkbox" >
                                        <input type="checkbox" id={member['id']} onChange={this.handleChangeLeft}/>
                                    </div>
                                    <div class="transferlist-item-parameters">
                                        {member['group'] !== undefined ? member['name'] + ' [' + member['title'] + ' / ' + member['group'] + ']' :  member['name'] + ' [' + member['title'] + ']'}
                                    </div>
                                </div>)
                            })
                        ) 
                        : 
                        ( this.props.type === 'multygroup'? (
                            this.props.groupBase.map((group,index) =>{
                                return(
                                    <div class={"left-item transfer-item".concat(this.props.usedIDs.includes(group['name'])? " active-transferlist-item" : '')}
                                    key={group['name']}>
                                        <div class="transferlist-item-checkbox" >
                                            <input type="checkbox" id={group['name']} onChange={this.handleChangeLeft}/>
                                        </div>
                                        <div class="transferlist-item-parameters">
                                            {group['name']}
                                        </div>
                                    </div>)
                            })
                        ) : (
                            this.props.questions.map((question,index) =>{
                                return(
                                <div class={"left-item transfer-item".concat(this.props.usedIDs.includes(question['id'])? " active-transferlist-item" : '')} 
                                     key={question['id']} 
                                     onClick={()=>{console.log(this.props.usedIDs)}}
                                >
                                    <div class="transferlist-item-checkbox">
                                        <input type="checkbox" id={question['id']} onChange={this.handleChangeLeft}/>
                                    </div>
                                    <div class="transferlist-item-parameters" id={question['id']  + '-data'}  onClick={this.handleQuestionData}>
                                        {question['question'].substring(0,50) + '...'}
                                    </div>
                                </div>)
                            })
                        ))}
                    </div>
                </div>
                <div class="right-transferlist">
                <div class="transferlist-header">
                        <div class="transferlist-header-text">
                            {this.props.headers[1]}
                        </div>
                    </div>
                    <div class="transferlist-items">
                    {this.props.type === 'group' && this.props.act_group !== 'default'? 
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
                                    </div>
                                )
                            })
                        ) 
                        : 
                        ( this.props.type === 'multygroup'? (
                            this.props.containedGroups.map((group) =>{
                                return(
                                    <div class="right-item transfer-item" 
                                         key={group + '-right'}>
                                        <div class="transferlist-item-checkbox">
                                            <input type="checkbox" id={group + '-right'} defaultChecked onChange={this.handleChangeRight}/>
                                        </div>
                                        <div class="transferlist-item-parameters">
                                            {group}
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
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
                        ))}
                    </div>
                </div>
            </div>
            {this.props.questions.map((question,index) =>{
                return(
                    <div class="question-modal"  tabindex="1" id={question['id']  + '-modal'}>
                        <div class="question-modal-content">
                            {this.generateQuestionModals(question,index)}
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
        groupBase : [],
        type: 'questions',
        actModul : undefined,
        handleGroup : undefined,
        handleModul : undefined,
        handleMultyGroups : undefined,
        containedQuestions : undefined,
        containedMembers : undefined,
        containedGroups : [],
        actQuiz : undefined,
        usedIDs : [],
        act_group : 'default',
}