import React, { useState, useEffect, Component } from "react"
import Select from 'react-select'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import SignedInStarterLinks from '../SignedInStarterLinks'
import 'firebase/firestore'
import '../../css/TestMakerDashboard.css'
import Button from '@material-ui/core/Button'
import TransferList from '../testmaker/TransferList'
import Review from '../testmaker/Review'
import { ThreeDRotationSharp } from "@material-ui/icons"
import 'firebase/firestore'
import {db} from '../../config/base'

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
          tests : [
                        { value: 'első', label: 'Első teszt' },
                        { value: 'második', label: 'Második teszt' },
                        { value: 'harmadik', label: 'Harmadik teszt' },
                        { value: 'uj', label: 'Új teszt' }
                    ],
          valueSelect: undefined,
          testType: undefined,
          testName: undefined,
          theQuiz : {IsZH: false, quizName: "", group: [], modules: []},
          modules : [
                        { value: 'első', label: 'Modul_0' },
                        { value: 'második', label: 'Modul_1' },
                        { value: 'harmadik', label: 'Modul_2' },
                        { value: 'uj', label: 'Modul_3' }
                    ],
          actModul : 0,
          maxModul : 0,
          questionBase : [],
          usedQuestions : [],
          usedQuestionsIDs : [],
          alreadyMemberIDs : [],
          memberBase : [
              { 'name' : 'Kiss Béla', 'title' : 'Hallgató', 'id' : '1'},
              { 'name' : 'Nagy Károly', 'title' : 'Hallgató', 'id' : '2'},
              { 'name' : 'Kovács Enikő', 'title' : 'Hallgató', 'id' : '3'},
              { 'name' : 'Borbély Hunor', 'title' : 'Hallgató', 'id' : '4'},
              { 'name' : 'Nemismerek Többnevet', 'title' : 'Hallgató', 'id' : '5'}
                        ],
          searchedQuiz : undefined,
          searchedModul : undefined,
          searchedWord : undefined,
          questionCounter : 0,
          modulCounter : 0,
          availablePoints : 0,
          
          quizzesForFS : [],
          modulNamesForFS : [],
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
            })
          })
          .catch( error => console.log(error))
    }
    getQuizzes = () => {
        db.collection('QuizFolder')
        .get()
        .then( snapshot => {
          const data_from_web = []
          snapshot.forEach(doc => {
            const data = doc.data()
            data_from_web.push({...data,id:doc.id})
          })
          this.setState({
              quizzesForFS : [...data_from_web]
          },() =>{this.getQuestions()})
        })
        .catch( error => console.log(error))
    }
    getQuestions = () => {
        console.log('gettingquestions')
        this.state.quizzesForFS.map((quiz) =>{
          quiz['ModuleIDs'].map((moduleName) =>{
            db.collection('QuizFolder')
            .doc(quiz['id'])
            .collection(moduleName)
            .get()
            .then((snapshot) => {
              snapshot.forEach(doc => {
                const data = doc.data()
                this.setState({
                    questionBase : [...this.state.questionBase,{...data}]
                })
              })
            })
            .catch(error => alert(error))
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
        alert("Elmentve")
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
    componentDidMount(){
        let MemberIDs = []
        this.state.theQuiz['group'].map((member) =>{
            if(member.hasOwnProperty('id')){
                MemberIDs.push(member['id'])
            }
        })
        this.setState({
            alreadyMemberIDs : [...MemberIDs]
        })
        this.state.theQuiz['modules'].map((modul, modul_index) =>{
            var contained = modul['questions']
            contained.map((question, question_index) =>{
                var result = this.state.questionBase.filter(obj => {
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
                }
                this.setState({
                    usedQuestions : [...this.state.usedQuestions, this.state.theQuiz['modules'][modul_index]['questions'][question_index]],
                    usedQuestionsIDs : [...this.state.usedQuestionsIDs, this.state.theQuiz['modules'][modul_index]['questions'][question_index]['id']]
                })
            })
        })
        this.countAll()
    }
    
    handleChange = (newValue, actionMeta) => {
        if(newValue['value'] !== undefined){
            this.setState({
                actModul : this.state.theQuiz['modules'].length
            })
            document.getElementsByClassName('question-content')[0].style.display = "contents"
            document.getElementsByClassName('zh')[0].style.display = "block"
            document.getElementsByClassName('zh')[1].style.display = "block"
        }
        this.state.valueSelect = newValue['value']
        if(this.state.valueSelect != 'uj'){
            document.getElementsByClassName('new')[0].style.display = "block"
            document.getElementsByClassName('edit')[0].style.display = "block"
            document.getElementsByClassName('new')[1].style.display = "block"
            document.getElementsByClassName('edit')[1].style.display = "block"
            document.getElementsByClassName('choose-testname')[0].style.display = "none";
            document.getElementById('edit').checked = true
            this.setState({
                testType : 'EDIT_TEST',
                testName : 'TEMPLATE_NAME'
            }, () =>{
                if(this.state.actModul === 0){
                    this.handleAddModul()
                }
            })
        }else{
            document.getElementsByClassName('new')[0].style.display = "none"
            document.getElementsByClassName('edit')[0].style.display = "none"
            document.getElementsByClassName('new')[1].style.display = "none"
            document.getElementsByClassName('edit')[1].style.display = "none"
            document.getElementsByClassName('choose-testname')[0].style.display = "flex";
            this.setState({
                testType : 'NEW_TEST',
                testName : ''
            }, () =>{
                if(this.state.actModul === 0){
                    this.handleAddModul()
                }
            })
        }
        this.countAll()
    };
    handleGroupUpdate = (member, remove) =>{
        if(remove === true){
            var theGroup = this.state.theQuiz['group']
            var id = member['id']
            var pos = theGroup.findIndex(obj => obj['id'] === id)
            if (pos > -1) {
                theGroup.splice(pos, 1);
            }
            this.setState({
                theQuiz : {...this.state.theQuiz, 'group' : theGroup}
            })
        }else{
            this.setState({
                theQuiz : {...this.state.theQuiz, 'group' : [...this.state.theQuiz['group'],member]}
            })
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
            console.log(question)
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
            testName : event.target.value
        })
    };
    handleTypeChange = (event) => {
        this.setState({
            testType : event.target.value
        }, () =>{
            if(this.state.actModul === 0){
                this.handleAddModul()
            }
        })
        if(this.state.testType == 'EDIT_TEST'){
            document.getElementsByClassName('choose-testname')[0].style.display = "none";
        }else if(this.state.testType == 'TEMPLATE_TEST'){
            document.getElementsByClassName('choose-testname')[0].style.display = "flex";
        }
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
        console.log(this.state.questionBase)
        console.log('this.state.questionBase')
    }
    handleTestAttributeChange = (newValue, actionMeta) => {
        alert(newValue['value'])
    };
    handleModuleAttributeChange = (newValue, actionMeta) => {
        this.setState({
            searchedModul : newValue['value']
        })
    };
    handleSearchChange = (event) =>{
        alert(event.target.value)
    }
    changeChildState = () => {
        this.childRef.current.handleModulGettingDeleted();
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
                                    onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div class="choose-testname">
                                <input type="text"  class="text-input" placeholder="Teszt neve..." id="test-name" value={this.state.testName} onChange={this.handleNameChange} name="test-name"/><br/>
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
                        <h1 onClick={() => { console.log('Modules'); console.log(this.state.theQuiz['modules'])}}>Kérdések hozzáadása a feladatsorhoz</h1>
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
                                    <div class="all-modul">
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
                        <h1>Felhasználók hozzárendelése a feladatsorhoz</h1>
                        <TransferList 
                        headers={['Választható','Választott']} 
                        type='group' containedMembers={this.state.theQuiz.group} 
                        handleGroup={this.handleGroupUpdate} 
                        group={this.state.memberBase}
                        usedIDs={this.state.alreadyMemberIDs}
                        />
                    </div>
                    <div class="preview-content">
                        <Review quiz={this.state.theQuiz}/>
                    </div>
                    <div class="finish-content">
                        <div class="finish-content-results">
                            <div class="result-question">Kérdések: <var id="result-question">{this.state.questionCounter}</var></div>
                            <div class="result-points">Elérhető pontszám: <var id="result-points">{this.state.availablePoints}</var></div>
                            <div class="result-members">Hozzárendelt felhasználók: <var id="result-members">{this.state.theQuiz['IsZH'] ? this.state.theQuiz['group'].length : 0}</var></div>
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
                            <div class="result-members">Hozzárendelt felhasználók: <var id="result-members">{this.state.theQuiz['group'].length}</var></div>
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
                            <a>
                                <button onClick={this.handleFinish} class="finish-button">
                                    Mentés
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <Typography variant="h6" align="center" gutterBottom>
                    SZEMA
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Széchenyi István Egyetem
                </Typography>
            </footer>
        </>
        )
    }
}