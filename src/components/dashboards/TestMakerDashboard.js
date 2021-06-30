import React, { useState, useEffect, Component } from "react"
import Select from 'react-select'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import SignedInStarterLinks from '../SignedInStarterLinks'
import 'firebase/firestore'
import '../../css/TestMakerDashboard.css'
import TransferList from '../testmaker/TransferList'
import Review from '../testmaker/Review'
import 'firebase/firestore'
import {db} from '../../config/base'
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddGroupDialog
 from "../dialogs/AddGroupDialog"
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export default class TestMakerDashboard extends React.Component {

    constructor(props) {
      super(props);
      this.childRef = React.createRef();
      this.state = { 
          tests : [{label: 'Új teszt', value: 'uj'}],
          valueSelect: undefined,
          testType: undefined,
          theQuiz : {IsZH: false, quizName: "", groups: [], modules: [], DocDetails : ["","",""], Module_Fields : []},
          modules : [],
          actModul : 0,
          maxModul : 0,
          questionBase : [],
          usedQuestions : [],
          usedQuestionsIDs : [],
          memberBase : [],
          searchedQuiz : undefined,
          searchedModul : undefined,
          searchedWord : undefined,
          searchedGroup : undefined,
          questionCounter : 0,
          modulCounter : 0,
          availablePoints : 0,
          quizzesForFS : [],
          modulNamesForFS : [],
          everyDataTogetherOfQuizzes : [],
          groups : [],
          actGroup : [],
          allGroupsOfTests : [],
          open_ng_dialog : false,
          basic_group_infos : [],
      };
    }
    compare( a, b ) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
    }
    getUsers = () => {
        db.collection('users')
          .get()
          .then( snapshot => {
            const data_from_web = []
            snapshot.forEach(doc => {
              const data = doc.data()
              data_from_web.push({...data,id:doc.id})
            })
            this.setState({
                memberBase : data_from_web.sort(this.compare)
            },() =>{
                this.getGroups()
            })
          })
          .catch( error => console.log(error))
    }
    getGroups = () => {
        db.collection('groups')
        .get()
        .then( snapshot => {
          const data_from_web = []
          snapshot.forEach(doc => {
            const data = doc.data()
            data_from_web.push({...data,id:doc.id})
          })
          Object.keys(data_from_web[0]).map((key) =>{
              if(!['id','IDs'].includes(key)){
                  this.setState({
                      basic_group_infos : [...this.state.basic_group_infos,{ 'name' : key, 'data' : data_from_web[0][key]}]
                  })
              }
          })
          var allGroups = []
          data_from_web[0]['IDs'].map((data) =>{
            if(data !== 'default'){
                allGroups.push({'value' : data, 'label' : data})
                var myArray = this.state.memberBase.filter(function( obj ) {
                    if(obj.hasOwnProperty('group')){
                        return obj.group === data ;
                    }else{
                        return false
                    }
                });
                this.setState({
                    allGroupsOfTests : [...this.state.allGroupsOfTests,{'name' : data, 'members' : myArray}]
                })
            }
          })
          this.setState({
            groups : [...allGroups]
          })
        })
        .catch( error => console.log(error))
    }
    getQuizzes = () => {
        db.collection('QuizFolder')
        .get()
        .then( snapshot => {
          const data_from_web = []
          const data_for_tests = []
          snapshot.forEach(doc => {
            const data = doc.data()
            data_from_web.push({...data,id:doc.id})
            data_for_tests.push({'value' : doc.id, 'label' : doc.id})
          })
          this.setState({
              quizzesForFS : [...data_from_web],
              tests : [...this.state.tests, ...data_for_tests],
              
          },() =>{this.getQuestions()})
        })
        .catch( error => console.log(error))
    }
    getQuestions = () => {
        this.state.quizzesForFS.map((quiz,index_of_quiz) =>{
            var current_quiz = quiz
            current_quiz['modules'] = []
          quiz['ModuleIDs'].map((moduleName,index_of_module) =>{
            current_quiz['modules'][index_of_module] = { 'name' : moduleName, questions : []}
            db.collection('QuizFolder')
            .doc(quiz['id'])
            .collection(moduleName)
            .get()
            .then((snapshot) => {
              snapshot.forEach(doc => {
                const data = doc.data()
                current_quiz['modules'][index_of_module]['questions'] = [...current_quiz['modules'][index_of_module]['questions'],{...data, 'fb-id': doc.id}]
                this.setState({
                    questionBase : [...this.state.questionBase,{...data, 'fb-id': doc.id}],
                })
              })
            })
            .catch(error => alert(error))
          })
            let all_quiz = this.state.everyDataTogetherOfQuizzes
            all_quiz.push(current_quiz)
            this.setState({
                everyDataTogetherOfQuizzes : all_quiz
            })
        })
    }
    handleStart = () =>{
        this.getQuizzes()
        document.getElementById('main-welcome').style.display = "none"
        document.getElementById('main-start').style.display = "grid"
        this.getUsers()
    };
    handleFinish = () =>{
        let quiz = {
            'DocDetails' : [...this.state.theQuiz['DocDetails']],
            'ModuleIDs' : this.state.theQuiz['modules'].map((modul)=>{ return modul['name']}),
            'ZH' : this.state.theQuiz['IsZH'],
            'groups' : this.state.theQuiz['groups']
        }
        this.state.theQuiz['modules'].map((modul) =>{
            
            quiz[modul['name']] = ["","","","",""]
            
            modul['questions'].map((question) =>{
                quiz[modul['name']][0] = quiz[modul['name']][0] === "" ? quiz[modul['name']][0] + question['fb-id'] : quiz[modul['name']][0] + ":" + question['fb-id']
            })
            quiz[modul['name']][1] = modul['name']
            quiz[modul['name']][2] = ""  //ide kell majd egy kép URL
            quiz[modul['name']][3] = "ide kellen valami leírás" //ide meg leírás
            quiz[modul['name']][4] = modul['name'].substr(0, modul['name'].indexOf('_')-1) + " " + modul['name'].substr(modul['name'].length-1)
        })
        db.collection('QuizFolder')
        .doc(this.state.theQuiz.quizName).set(quiz)
        .then(() => {
            var batch = db.batch()
            this.state.theQuiz['modules'].map((modul) =>{
                modul['questions'].map((question) =>{
                    let questionToPush = question
                    let id = questionToPush['fb-id']
                    delete questionToPush['fb-id']
                    batch.set(db.collection('QuizFolder').doc(this.state.theQuiz['quizName']).collection(modul['name']).doc(id), questionToPush)
                })
            })
            batch.commit()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    };
    handlePrevModul = (event) =>{
        event.preventDefault()
        if(this.state.actModul >1){
            this.setState({
                actModul : this.state.actModul - 1
            })
        }
    }
    handleNextModul = (event) =>{
        event.preventDefault()
        if(this.state.theQuiz['modules'].length > this.state.actModul){
            this.setState({
                actModul : this.state.actModul + 1
            })
        }
    }
    handleAddModul = (event=undefined) =>{
        if(event !== undefined){
            event.preventDefault()
        }
        this.setState( prevState =>({
            theQuiz : {...prevState['theQuiz'], 'modules' : [...prevState['theQuiz']['modules'],{name:"Module_" + (this.state.theQuiz['modules'].length+1), questions: [] }]}
        }))
        if(this.state.actModul == 0){
            this.setState({
                actModul : this.state.actModul + 1
            })
        }
      
        this.countAll()
    }
    handleDeleteModul = (event) =>{
        event.preventDefault()
        this.changeChildState()
        if(this.state.actModul > 0){
            var arr = [...this.state.theQuiz['modules']]
            var len = arr.length
            arr.splice(this.state.actModul-1,1)
            this.setState( prevState =>({
                theQuiz : {...prevState['theQuiz'], 'modules' : [...arr]}
            }))
            if(this.state.actModul == len){
                this.setState({
                    actModul : this.state.actModul - 1
                }, () =>{
                    if(this.state.actModul === 0){
                        this.handleAddModul()
                    }
                })
            }
        }
        this.countAll()
    }
    handleUsedQuestionIDs = () =>{
        console.log(this.state.theQuiz['modules'].length)
        var allIDs = []
        this.state.theQuiz['modules'].map((modul, modul_index) =>{
            modul['questions'].map((question, question_index) =>{
                allIDs.push(question['id'])
               /* var result = this.state.questionBase.filter(obj => {
                    return obj.id === question['id']
                })
                    if(result[0]){
                    for (const key in result[0]) {
                        
                        let must_update = false
                        must_update = question.hasOwnProperty(key)
                        if(!must_update){
                            must_update = question[key] !== result[0][key]
                        }
                        if(must_update){
                            
                            var to_overwrite = this.state.theQuiz['modules']
                            if(to_overwrite[modul_index].hasOwnProperty('questions')){
                                to_overwrite[modul_index]['questions'][question_index] = result[0]
                            }
                            this.setState({
                                theQuiz : {...this.state.theQuiz, 'modules' : to_overwrite} 
                            })
                        }
                    }
                }*/
            })
        })
        this.setState({
            usedQuestionsIDs : [...allIDs]
        })
    }
    componentDidMount(){
        this.countAll()
    }
    
    setupBackend = (newValue, actionMeta) => {
        /* ZH opcio megjelenitese*/
        this.setState({
            valueSelect : newValue['value']
        })
        if(newValue['value'] !== undefined){
            document.getElementsByClassName('question-content')[0].style.display = "contents"
            document.getElementsByClassName('zh')[0].style.display = "block"
            document.getElementsByClassName('zh')[1].style.display = "block"
        }
        
        if(newValue['value'] === 'uj'){
            /*Uj kerdessor letrehozasa*/
            document.getElementsByClassName('new')[0].style.display = "none"
            document.getElementsByClassName('edit')[0].style.display = "none"
            document.getElementsByClassName('new')[1].style.display = "none"
            document.getElementsByClassName('edit')[1].style.display = "none"
            let arr = document.getElementsByClassName('choose-testattr')
            for(let i = 0; i < arr.length; i++){
                arr[i].style.display = 'flex'
            }

            this.setState({
                testType : 'NEW_TEST',
                theQuiz : {...this.state.theQuiz,'IsZH': false, 'quizName': "", 'groups': [], 'modules': [], 'DocDetails' : ["","",""], 'Module_Fields' : []},
                actModul : 1
            }, () =>{
                    this.handleAddModul()
                    this.handleUsedQuestionIDs()
            })
        }else{
            /*Meglevo kerdessor modositasa*/
            document.getElementsByClassName('new')[0].style.display = "block"
            document.getElementsByClassName('edit')[0].style.display = "block"
            document.getElementsByClassName('new')[1].style.display = "block"
            document.getElementsByClassName('edit')[1].style.display = "block"
            let arr = document.getElementsByClassName('choose-testattr')
            for(let i = 0; i < arr.length; i++){
                arr[i].style.display = 'flex'
            }
            document.getElementById('edit').checked = true
            var Current_Quiz = undefined 
            var pos = this.state.everyDataTogetherOfQuizzes.findIndex(obj => obj['id'] === newValue['value'])
            if (pos > -1) {
                Current_Quiz = this.state.everyDataTogetherOfQuizzes[pos]
                this.setState({
                    testType : 'EDIT_TEST',
                    theQuiz: {...this.state.theQuiz,'IsZH' : Current_Quiz['ZH'], 'quizName': Current_Quiz['id'], 'DocDetails': Current_Quiz['DocDetails'], 'modules' : Current_Quiz['modules']},
                    actModul : 1
                }, () =>{
                    if(this.state.actModul === 0){
                        this.handleAddModul()
                    }
                    this.handleUsedQuestionIDs()
                })
            }
        }
        this.countAll()
    };
    handleGroupUpdate = (member, remove) =>{
        if(remove === true){
            var theGroup = this.state.actGroup
            var id = member['id']
            var pos = theGroup.findIndex(obj => obj['id'] === id)
            if (pos > -1) {
                theGroup.splice(pos, 1);
            }
            var pos2= this.state.allGroupsOfTests.findIndex(obj => obj['name'] === this.state.searchedGroup)
            if (pos2 > -1) {
                var allGroup = this.state.allGroupsOfTests
                allGroup[pos2] = {'name' : this.state.searchedGroup, 'members' : theGroup}
                this.setState({
                    allGroupsOfTests : allGroup
                },)
            }
            var rightUserID = this.state.memberBase.findIndex(obj => obj['id'] === member['id'])
            
            var allusers = this.state.memberBase
            
            if (rightUserID > -1) {
                var rightUser = allusers[rightUserID]
                delete rightUser['group']
                allusers[rightUserID] = rightUser
                this.setState({
                    memberBase : allusers
                })
            }
        }else{
            var theGroup = this.state.actGroup
            theGroup.push(member)
            var pos= this.state.allGroupsOfTests.findIndex(obj => obj['name'] === this.state.searchedGroup)
            if (pos > -1) {
                var allGroup = this.state.allGroupsOfTests
                allGroup[pos] = {'name' : this.state.searchedGroup, 'members' : theGroup}
                this.setState({
                    allGroupsOfTests : allGroup
                })
            }
            var rightUserID = this.state.memberBase.findIndex(obj => obj['id'] === member['id'])
            
            var allusers = this.state.memberBase
            
            if (rightUserID > -1) {
                var rightUser = allusers[rightUserID]
                rightUser['group'] = this.state.searchedGroup

                allusers[rightUserID] = rightUser
                this.setState({
                    memberBase : allusers
                })
            }
        }
        this.countAll()
    }
    countAll = () =>{
        let counterQ = 0
        let sumPoints = 0

        this.state.theQuiz['modules'].map((modul) =>{
            modul['questions'].map((question) =>{
                if(question.hasOwnProperty('id')){
                    counterQ += 1
                    if(question.hasOwnProperty('points')){
                        sumPoints += question['points']
                    }
                }
            })
        })
        this.setState({
            questionCounter : counterQ, 
            modulCounter : this.state.theQuiz['modules'].length,
            availablePoints : sumPoints,
        })
    }
    handleQuestionUpdate = (question, remove) =>{
        if(remove === true){
            var theModules = this.state.theQuiz['modules']
            var tmpModule = theModules[this.state.actModul-1]['questions']
            var id = question['id']

            var pos = tmpModule.findIndex(obj => obj['id'] === id)
            if (pos > -1) {
                tmpModule.splice(pos, 1);
            }
            theModules[this.state.actModul-1]['questions'] = [...tmpModule]
            this.setState(prevState =>({
                theQuiz : {...prevState['theQuiz'], 'modules' : theModules }
            }))
        }else{
            var theModules = this.state.theQuiz['modules']
            theModules[this.state.actModul-1]['questions'] = [...theModules[this.state.actModul-1]['questions'],question]
            this.setState(prevState =>({
                theQuiz : {...prevState['theQuiz'], 'modules' : theModules }
            }))
        }
        this.countAll()
    }
    handleMultyGroupUpdate = (group, remove) =>{
        if(remove === true){
            var groups_of_quiz = this.state.theQuiz['groups']
            var pos = groups_of_quiz.findIndex(obj => obj === group)
            if (pos > -1) {
                groups_of_quiz.splice(pos, 1);
                this.setState({
                    theQuiz : {...this.state.theQuiz, 'groups' : [...groups_of_quiz]}
                })
            }
            
        }else{
            var groups_of_quiz = this.state.theQuiz['groups']
            groups_of_quiz.push(group)
            this.setState({
                theQuiz : {...this.state.theQuiz, 'groups' : [...groups_of_quiz]}
            })
        }
    }
    handlePreview = () =>{
        document.getElementsByClassName('preview-content')[0].style.display = "block"
        document.getElementsByClassName('preview-finish-content')[0].style.display = "flex"
        document.getElementsByClassName('choose-content')[0].style.display = "none"
        document.getElementsByClassName('finish-content')[0].style.display = "none"
        document.getElementsByClassName('member-content')[0].style.display = "none"
        document.getElementsByClassName('question-content')[0].style.display = "none"
    }
    handleBack = () =>{
        document.getElementsByClassName('preview-content')[0].style.display = "none"
        document.getElementsByClassName('preview-finish-content')[0].style.display = "none"
        document.getElementsByClassName('finish-content')[0].style.display = "flex"
        document.getElementsByClassName('choose-content')[0].style.display = "contents"
        if(this.state.valueSelect !== undefined){
            document.getElementsByClassName('question-content')[0].style.display = "contents"
        }
        if(this.state.theQuiz['IsZH'] == true){
            document.getElementsByClassName('member-content')[0].style.display = "contents"
        }
    };
    handleNameChange = (event) => {
        this.setState({
            theQuiz : {...this.state.theQuiz,'quizName' : event.target.value}
        })
    };
    handleFolderNameChange = (event) => {
        var DocDetails = this.state.theQuiz['DocDetails']
        DocDetails[0] = event.target.value
        this.setState({
            theQuiz: {...this.state.theQuiz, 'DocDetails' : DocDetails}
        })
    };
    handleFolderDescChange = (event) => {
        var DocDetails = this.state.theQuiz['DocDetails']
        DocDetails[1] = event.target.value
        this.setState({
            theQuiz: {...this.state.theQuiz, 'DocDetails' : DocDetails}
        })
    };
    handleFolderIconChange = (event) => {
        //pass
    };
    handleTypeChange = (event) => {
        console.log("event: " + event.target.value)
        this.setState({
            testType : event.target.value
        }, () =>{
            console.log(this.state.testType)
            if(this.state.actModul === 0){
                this.handleAddModul()
            }
            if(this.state.testType === 'EDIT_TEST'){
                var pos = this.state.everyDataTogetherOfQuizzes.findIndex(obj => obj['id'] === this.state.valueSelect)
                if (pos > -1) {
                    var Current_Quiz = this.state.everyDataTogetherOfQuizzes[pos]
                    this.setState({
                        theQuiz: {...this.state.theQuiz, 'quizName': Current_Quiz['id'], 'DocDetails': Current_Quiz['DocDetails']},
                    })
                }
            }else if(this.state.testType === 'TEMPLATE_TEST'){
                this.setState({
                    theQuiz: {...this.state.theQuiz, 'DocDetails' : ["","",""], 'quizName' : ''}
                })
            }
        })
        
    }
    handleZHChange = (event) => {
        if(event.target.checked){
            this.setState({
                theQuiz : {...this.state.theQuiz, 'IsZH' : true}
            })
            document.getElementsByClassName('member-content')[0].style.display = "contents"
        }else{
            this.setState({
                theQuiz : {...this.state.theQuiz, 'IsZH' : false}
            })
            document.getElementsByClassName('member-content')[0].style.display = "none"
        }
    }
    handleTestAttributeChange = (newValue, actionMeta) => {
        this.setState({
            searchedQuiz : newValue['value']
        })
    };
    handleModuleAttributeChange = (newValue, actionMeta) => {
        this.setState({
            searchedModul : newValue['value']
        })
    };
    handleGroupAttributeChange = (newValue, actionMeta) => {
        this.setState({
            searchedGroup : newValue['value']
        })
        var pos = this.state.allGroupsOfTests.findIndex(obj => obj['name'] === newValue['value'])
        if (pos > -1) {
            var theGroup = this.state.allGroupsOfTests[pos]['members']
            this.setState({
                actGroup : [...theGroup]
            })
        }
    };
    handleSearchChange = (event) =>{
        this.setState({
            searchedWord : event.target.value
        })
    }
    changeChildState = () => {
        this.childRef.current.handleModulGettingDeleted();
    }
    handleAddGroup = (group) =>{
        this.setState({
            basic_group_infos : [...this.state.basic_group_infos,group],
            allGroupsOfTests : [...this.state.allGroupsOfTests,{'name' : group['name'], 'members' : []}]
        })
    }
    render(){
        return(
        <>
            <header>  
                <AppBar position="relative" style={{background: '#2196f3'}}>
                    <Toolbar>
                        <SignedInStarterLinks />
                    </Toolbar>
                </AppBar>
            </header>
            <div id="main-welcome">
                <div id="welcome-content">
                    <div id="welcome-text">
                        Ezen a felületen létrehozhat új feladatsorokat a meglévő kérdésbázis segítségével, illetve módosíthatja a már létező teszteket.
                    </div>
                    <hr/>
                    <div id="welcome-rest">
                        <a  onClick={this.handleStart}>
                            <button variant="contained" color="primary">
                                Tovább
                            </button>
                        </a>
                        <a href="/questionbase">
                            <button variant="contained" color="secondary">
                                Kérdésbázis megtekintése
                            </button>
                        </a>
                    </div>
                </div>
            </div>
            <div id="main-start">
                <div id="main-start-wrapper">
                    <div class="choose-content">
                        <form>
                            <div class="center-fullwidth">
                                <div id="select-top">
                                    <Select width="50%" 
                                    id="test-select" 
                                    placeholder="Új teszt / Sablon kiválasztása..." 
                                    options={this.state.tests} 
                                    onChange={this.setupBackend}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div class="choose-testattr">
                                <input type="text"  class="text-input" placeholder="Teszt neve..." id="test-name" value={this.state.theQuiz['quizName']} onChange={this.handleNameChange} name="test-name"/>
                            </div>
                            <div class="choose-testattr">
                                <input type="text"  class="text-input" placeholder="Mappa címe..." id="folder-title" value={this.state.theQuiz['DocDetails'][0]} onChange={this.handleFolderNameChange} name="test-name"/>
                            </div>
                            <div class="choose-testattr">
                                <input type="text"  class="text-input" placeholder="Mappa leírás..." id="folder-desc" value={this.state.theQuiz['DocDetails'][1]} onChange={this.handleFolderDescChange} name="test-name"/>
                            </div>
                            <div class="choose-testattr">
                                <div id="select-top">
                                    <Select width="50%" 
                                    id="test-select" 
                                    placeholder="Mappa ikon..." 
                                    value={{'label':this.state.theQuiz['DocDetails'][2], 'value' : 'placeholder'}}
                                    onChange={this.handleFolderIconChange}
                                    />
                                </div>
                            </div>
                            <div class="test-attributes">
                                <input type="radio" class="edit" id="edit" onChange={this.handleTypeChange} name="test-type" value="EDIT_TEST"/>
                                <label for="edit" class="edit">Szerkesztés</label><br/>
                                <input type="radio" onChange={this.handleTypeChange} class="new" id="new" name="test-type" value="TEMPLATE_TEST"/>
                                <label for="new" class="new">Felhasználás sablonként</label><br/>
                                <input type="checkbox" id="zh" onChange={this.handleZHChange} class="zh" name="zh" value="zh"/>
                                <label for="zh" class="zh" > Zárthelyi dolgozat</label><br/>
                            </div>
                        </form>
                    </div>
                    <br/>
                    <div class="question-content">
                        <h1 onClick={() => { console.log('testtype'); console.log(this.state.testType)}}>Kérdések hozzáadása a feladatsorhoz</h1>
                        <form>
                            <div class="center-fullwidth">
                                <div class="select-multy">
                                    <Select width="50%" 
                                    id="test-select" 
                                    placeholder="Teszt keresése..." 
                                    options={this.state.tests} 
                                    onChange={this.handleTestAttributeChange}
                                    />
                                </div>
                            </div>
                            <div class="center-fullwidth">
                                <div class="select-multy">
                                    <Select width="50%" 
                                    id="test-select" 
                                    placeholder="Modul keresése..." 
                                    options={this.state.modules} 
                                    onChange={this.handleModuleAttributeChange}
                                    />
                                </div>
                            </div>
                            <div class="center-fullwidth">
                                <input type="text" onChange={this.handleSearchChange} class="text-input" placeholder="Kulcsszavak keresése..."></input>
                            </div>
                            <br/>
                            <div class="center-fullwidth">
                                <a>
                                    <button onClick={this.handlePrevModul} class="modul-button">
                                        Előző modul
                                    </button>
                                </a>
                                <div class="modul-counter">
                                    <div class="act-modul">
                                        {this.state.actModul}
                                    </div>
                                    <div>
                                        /
                                    </div>
                                    <div key={this.state.theQuiz['modules'].length}class="all-modul">
                                        {this.state.theQuiz['modules'].length}
                                    </div>
                                </div>
                                <a>
                                    <button onClick={this.handleNextModul} class="modul-button">
                                        Következő modul
                                    </button>
                                </a>
                            </div>
                            <div class="center-fullwidth">
                                <a>
                                    <button onClick={this.handleDeleteModul} class="modul-button">
                                        Modul törlése
                                    </button>
                                </a>
                                <a>
                                    <button onClick={this.handleAddModul} class="modul-button">
                                        Új modul
                                    </button>
                                </a>
                            </div>
                        </form>
                        <div class="transferlist">
                            <TransferList 
                                headers={['Választható','Választott']} 
                                type='questions' 
                                containedQuestions={this.state.theQuiz['modules'][this.state.actModul-1] ? this.state.theQuiz['modules'][this.state.actModul-1]['questions'] : []} 
                                handleModul={this.handleQuestionUpdate} 
                                questions={this.state.questionBase}
                                ref={this.childRef}
                                actModul={this.state.actModul}
                                actQuiz={this.state.theQuiz}
                                usedIDs={this.state.usedQuestionsIDs}
                            />
                        </div>
                    </div>
                    <br/>
                    <div class="member-content">
                        <h1>Csoportok hozzárendelése a feladatsorhoz</h1>
                        <TransferList 
                        type="multygroup"
                        headers={['Választható','Választott']} 
                        containedGroups={this.state.theQuiz['groups']}
                        handleMultyGroups={this.handleMultyGroupUpdate}
                        groupBase ={this.state.allGroupsOfTests}
                        usedIDs={this.state.theQuiz['groups']}
                        />
                        
                        <h1>Felhasználók hozzárendelése a csoportokhoz</h1>
                        <form>
                            <div class="center-fullwidth">
                                <div class="select-multy">
                                    <Select width="50%" 
                                    id="group-select" 
                                    placeholder="Csoport kiválasztása..." 
                                    options={this.state.groups} 
                                    onChange={this.handleGroupAttributeChange}
                                    />
                                </div>
                            </div>
                            {/*<a>
                                <div class="center-fullwidth">
                                        <AddGroupDialog handleGroup={this.handleAddGroup}/>
                                </div>
                            </a>*/}
                        </form>
                        <TransferList 
                        headers={['Választható','Választott']} 
                        type='group' 
                        containedMembers={this.state.actGroup} 
                        handleGroup={this.handleGroupUpdate} 
                        group={this.state.memberBase}
                        act_group={this.state.searchedGroup}
                        />
                    </div>
                    <div class="preview-content">
                        <Review quiz={this.state.theQuiz}/>
                    </div>
                    <div class="finish-content">
                        <div class="finish-content-results">
                            <div class="result-question">Kérdések: <var id="result-question">{this.state.questionCounter}</var></div>
                            <div class="result-points">Elérhető pontszám: <var id="result-points">{this.state.availablePoints}</var></div>
                            <div class="result-members">Hozzárendelt csoportok: <var id="result-members">{this.state.theQuiz['IsZH'] ? this.state.theQuiz['groups'].length : 0}</var></div>
                            <div class="result-type">Feladatsor jellege: 
                                <var id="result-type">
                                    {this.state.theQuiz['IsZH'] ? (<var>Zárthelyi dolgozat</var>) : (<var>Nem zárthelyi dolgozat</var>)}
                                </var>
                            </div>
                        </div>
                        <div class="finish-content-preview-btn">
                            <a>
                                <button onClick={this.handlePreview} class="preview-button">
                                    Tovább az előnézethez
                                </button>
                            </a>
                        </div>
                    </div>
                    <div class="preview-finish-content">
                        <div class="finish-content-results">
                        <div class="result-question">Kérdések: <var id="result-question">{this.state.questionCounter}</var></div>
                            <div class="result-points">Elérhető pontszám: <var id="result-points">{this.state.availablePoints}</var></div>
                            <div class="result-members">Hozzárendelt csoportok: <var id="result-members">{this.state.theQuiz['groups'].length}</var></div>
                            <div class="result-type">
                                Feladatsor jellege: 
                                <var id="result-type">
                                    {this.state.theQuiz['IsZH'] ? (<var>Zárthelyi dolgozat</var>) : (<var>Nem zárthelyi dolgozat</var>)}
                                </var>
                            </div>
                        </div>
                        <div class="finish-content-btns">
                            <a>
                                <button onClick={this.handleBack} class="back-preview-button">
                                    Vissza
                                </button>
                            </a>
                            <a href="/createtest">
                                <button onClick={this.handleFinish} class="finish-button">
                                    Mentés
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              <strong>SZEMA - </strong>Széchenyi István Egyetem
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
              Biró István - istvanbiro.bwe@gmail.com - 06-30-403-9089 
          </Typography>
            </footer>
        </>
        )
    }
}