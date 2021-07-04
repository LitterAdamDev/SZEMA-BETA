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
import {db} from '../../config/base'
import DeleteQuizDialog from '../dialogs/DeleteQuizDialog'
import AddModuleDialog from '../dialogs/AddModuleDialog'
import ModifyModuleDialog from '../dialogs/ModifyModuleDialog'
import ChooseImageDialog from "../dialogs/ChooseImageDialog"

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
          tests : [{label: 'Új teszt', value: 'uj', folder: ''}],
          valueSelect: undefined,
          testType: undefined,
          theQuiz : {IsZH: false, quizName: "", groups: [], modules: [], DocDetails : ["","",""], Module_Fields : []},
          modules : [],
          actModul : 0,
          maxModul : 0,
          questionBase : [],
          filtered_questionBaes : [],
          filtered_questionBaes_for_more : [],
          usedQuestions : [],
          usedQuestionsIDs : [],
          memberBase : [],
          ModulesForSearch : [{'label' : 'Összes', 'value' : 'all'}],
          TestsForSearch :  [{'label' : 'Összes', 'value' : 'all'}],
          SearchedTest: undefined,
          SearchedModul: undefined,
          searchedGroup : undefined,
          searchedWord : '',
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
          actTest : {label: '', folder: '', value: ''},
          replaceTestValue : undefined,
          moduleSearchDisabled : true,
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
        ['QuizFolder','ZHQuizFolder'].map((folder)=>{
            db.collection(folder)
            .get()
            .then( snapshot => {
              const data_from_web = []
              const data_for_tests = []
              snapshot.forEach(doc => {
                const data = doc.data()
                data_from_web.push({...data,id:doc.id})
                data_for_tests.push({'value' : doc.id, 'label' : doc.id, 'folder': folder})
              })
              this.setState({
                  quizzesForFS : [...data_from_web],
                  tests : [...this.state.tests, ...data_for_tests],
                  TestsForSearch :[...this.state.TestsForSearch, ...data_for_tests]
                  
              },() =>{this.getQuestions(folder)})
            })
            .catch( error => console.log(error))
        })
        
    }
    getQuestions = (foldername) => {
        this.state.quizzesForFS.map((quiz,index_of_quiz) =>{
            var current_quiz = quiz
            current_quiz['modules'] = []
          quiz['ModuleIDs'].map((moduleName,index_of_module) =>{
            current_quiz['modules'][index_of_module] = { 'name' : moduleName, questions : []}
            db.collection(foldername)
            .doc(quiz['id'])
            .collection(moduleName)
            .get()
            .then((snapshot) => {
              snapshot.forEach(doc => {
                const data = doc.data()
                current_quiz['modules'][index_of_module]['questions'] = [...current_quiz['modules'][index_of_module]['questions'],{...data, 'fb-id': doc.id}]
                this.setState({
                    questionBase : [...this.state.questionBase,{...data, 'fb-id': doc.id}],
                    filtered_questionBaes : [...this.state.filtered_questionBaes,{...data, 'fb-id': doc.id}],
                    filtered_questionBaes_for_more : [...this.state.filtered_questionBaes_for_more,{...data, 'fb-id': doc.id}],
                })
              })
            })
            .catch(error => alert(error))
          })
            let all_quiz = this.state.everyDataTogetherOfQuizzes
            all_quiz.push(current_quiz)
            this.setState({
                everyDataTogetherOfQuizzes : all_quiz,
            })
        })
    }
    handleStart = () =>{
        this.getQuizzes()
        document.getElementById('main-welcome').style.display = "none"
        document.getElementById('main-start').style.display = "grid"
        this.getUsers()
    };
    handleFinish = (event) =>{
        event.preventDefault()
        let quiz = {
            'DocDetails' : [...this.state.theQuiz['DocDetails']],
            'ModuleIDs' : this.state.theQuiz['modules'].map((modul)=>{ return modul['name']}),
            'ZH' : this.state.theQuiz['IsZH'],
            'groups' : this.state.theQuiz['groups']
        }
        this.state.theQuiz['modules'].map((modul,index) =>{
            
            quiz[modul['name']] = ["","","","",""]
            
            modul['questions'].map((question) =>{
                quiz[modul['name']][0] = quiz[modul['name']][0] === "" ? quiz[modul['name']][0] + question['fb-id'] : quiz[modul['name']][0] + ":" + question['fb-id']
            })
            quiz[modul['name']][1] = (modul['name'][modul['name'].length-1] === '1')? 'none' : 'Module_' + (Number(modul['name'][modul['name'].length-1]) -1)
            quiz[modul['name']][2] = this.state.theQuiz['Module_Fields'][index]['icon']['value']
            quiz[modul['name']][3] = this.state.theQuiz['Module_Fields'][index]['description']
            quiz[modul['name']][4] = modul['name'].substr(0, modul['name'].indexOf('_')-1) + " " + modul['name'].substr(modul['name'].length-1)
        })
        let name_of_collection = this.state.theQuiz['IsZH'] ? 'ZHQuizFolder' : 'QuizFolder'
        db.collection(name_of_collection)
        .doc(this.state.theQuiz.quizName).set(quiz)
        .then(() => {
            var batch = db.batch()
            this.state.theQuiz['modules'].map((modul) =>{
                modul['questions'].map((question) =>{
                    let questionToPush = question
                    let id = questionToPush['fb-id']
                    delete questionToPush['fb-id']
                    batch.set(db.collection(name_of_collection).doc(this.state.theQuiz['quizName']).collection(modul['name']).doc(id), questionToPush)
                })
            })
            batch.commit()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        })
        .finally(()=>{
            document.getElementById(event.target.id).parentElement.setAttribute("href", "createtest")
            document.getElementById(event.target.id).parentElement.click()
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
    handleAddModul = (event=undefined, data={'description' : '', 'icon' : ''},index=this.state.actModul) =>{
        if(event !== undefined){
            event.preventDefault()
        }
        let modules = this.state.theQuiz['modules']
        let new_module = {name:"Module_" + (this.state.theQuiz['modules'].length+1), questions: [] }
        let module_dataset = this.state.theQuiz['Module_Fields']
        modules.splice(index, 0, new_module)
        module_dataset.splice(index, 0, data)
        this.setState({
            theQuiz : {...this.state.theQuiz, 'modules': modules, 'Module_Fields' : module_dataset}
        },()=>{
            let modules = this.state.theQuiz['modules']
            modules.map((modul,index) =>{
                modules[index]['name'] = modul['name'].split('_')[0] + '_'+(index+1)
            })
            this.setState({
                theQuiz : {...this.state.theQuiz, 'modules' : modules}
            })
        })
        if(this.state.actModul == 0){
            this.setState({
                actModul : this.state.actModul + 1
            })
        }
        this.countAll()
    }
    handleModifyModul = (event=undefined,data) =>{
        if(event !== undefined){
            event.preventDefault()
        }
        let fields = this.state.theQuiz['Module_Fields']
        fields[this.state.actModul-1] = data
        this.setState({
            theQuiz : {...this.state.theQuiz, 'Module_Fields' : fields}
        })
    }
    handleDeleteModul = (event) =>{
        event.preventDefault()
        this.changeChildState()
        if(this.state.actModul > 0){
            var arr = [...this.state.theQuiz['modules']]
            var arrdata = this.state.theQuiz['Module_Fields']
            var len = arr.length
            arr.splice(this.state.actModul-1,1)
            arrdata.splice(this.state.actModul-1,1)
            this.setState( prevState =>({
                theQuiz : {...prevState['theQuiz'], 'modules' : [...arr], 'Module_Fields' : [...arrdata]}
            }),()=>{
                let modules = this.state.theQuiz['modules']
                modules.map((modul,index) =>{
                    modules[index]['name'] = modul['name'].split('_')[0] + '_' + (index+1)
                })
                this.setState({
                    theQuiz : {...this.state.theQuiz, 'modules' : modules}
                })
            })
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
            valueSelect : newValue['value'],
            actTest : newValue,
        })
        if(newValue['value'] !== undefined){
            document.getElementsByClassName('question-content')[0].style.display = "contents"
        }
        if(newValue.hasOwnProperty('id')){
            
            document.getElementsByClassName('member-content')[0].style.display = "none"
            var pos = this.state.tests.findIndex(obj => obj['label'] === newValue['id'])
            if (pos > -1) {
                let allTests = this.state.tests
                allTests.splice(pos,1)
                let TestsForSearch = allTests.map((item) => {
                    if(item['value'] !== 'uj'){
                        return item
                    }
                })
                this.setState({
                    tests : allTests,
                    replaceTestValue :{'label': 'Új teszt', 'value': 'uj', 'folder': ''},
                    TestsForSearch : TestsForSearch,
                })
            }
        }
        if(newValue['value'] === 'uj' || newValue.hasOwnProperty('id')){
            /*Uj kerdessor letrehozasa*/
            document.getElementsByClassName('template')[0].style.display = "none"
            document.getElementsByClassName('edit')[0].style.display = "none"
            document.getElementsByClassName('template')[1].style.display = "none"
            document.getElementsByClassName('edit')[1].style.display = "none"
            document.getElementsByClassName('zh')[0].style.display = "block"
            document.getElementsByClassName('zh')[1].style.display = "block"
            document.getElementsByClassName('delete-button')[0].style.display = 'none'
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
            document.getElementsByClassName('delete-button')[0].style.display = 'flex'
            document.getElementsByClassName('template')[0].style.display = "block"
            document.getElementsByClassName('edit')[0].style.display = "block"
            document.getElementsByClassName('template')[1].style.display = "block"
            document.getElementsByClassName('edit')[1].style.display = "block"
            document.getElementsByClassName('zh')[0].style.display = "none"
            document.getElementsByClassName('zh')[1].style.display = "none"
            let arr = document.getElementsByClassName('choose-testattr')
            for(let i = 0; i < arr.length; i++){
                arr[i].style.display = 'flex'
            }
            document.getElementById('edit').checked = true
            var Current_Quiz = undefined 
            var pos = this.state.everyDataTogetherOfQuizzes.findIndex(obj => obj['id'] === newValue['value'])
            if (pos > -1) {
                Current_Quiz = this.state.everyDataTogetherOfQuizzes[pos]
                let tmp_desc = []
                Current_Quiz['ModuleIDs'].map((modulName) =>{
                    tmp_desc.push({'description' : Current_Quiz[modulName][3], 'icon' :  {'value' :Current_Quiz[modulName][2], 'label': Current_Quiz[modulName][2]}})
                })
                let group = Current_Quiz['groups']? Current_Quiz['groups'] : []
                this.setState({
                    testType : 'EDIT_TEST',
                    theQuiz: {...this.state.theQuiz,'IsZH' : Current_Quiz['ZH'], 'quizName': Current_Quiz['id'], 'DocDetails': Current_Quiz['DocDetails'], 'modules' : Current_Quiz['modules'],'groups' : group, 'Module_Fields' : [...tmp_desc]},
                    actModul : 1
                }, () =>{
                    if(this.state.theQuiz['IsZH']){
                        document.getElementsByClassName('member-content')[0].style.display = "contents"
                    }
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
            this.setState({
                theQuiz : {...this.state.theQuiz, 'groups' : [...this.state.theQuiz['groups'],group]}
            },()=>{console.log(this.state.theQuiz['groups'])})
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

        var names = this.state.everyDataTogetherOfQuizzes.map((quiz) =>{
            return quiz['id']
        })
        if(names.includes(event.target.value) && ['TEMPLATE_TEST','NEW_TEST'].includes(this.state.testType)){
            document.getElementById(event.target.id).style.backgroundColor = 'red'
        }else{
            document.getElementById(event.target.id).style.backgroundColor = 'white'
        }
        this.setState({
            theQuiz : {...this.state.theQuiz,'quizName' : event.target.value},
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
        this.setState({
            testType : event.target.value
        }, () =>{
            if(this.state.actModul === 0){
                this.handleAddModul()
            }
            if(this.state.testType === 'EDIT_TEST'){
                
            document.getElementsByClassName('zh')[0].style.display = "none"
            document.getElementsByClassName('zh')[1].style.display = "none"
            document.getElementsByClassName('delete-button')[0].style.display = 'flex'
                var pos = this.state.everyDataTogetherOfQuizzes.findIndex(obj => obj['id'] === this.state.valueSelect)
                if (pos > -1) {
                    var Current_Quiz = this.state.everyDataTogetherOfQuizzes[pos]
                    this.setState({
                        theQuiz: {...this.state.theQuiz,'quizName': Current_Quiz['id'], 'DocDetails': Current_Quiz['DocDetails']},
                    })
                }
            }else if(this.state.testType === 'TEMPLATE_TEST'){
                document.getElementsByClassName('zh')[0].style.display = "block"
                document.getElementsByClassName('zh')[1].style.display = "block"
                document.getElementsByClassName('delete-button')[0].style.display = 'none'
                document.getElementById('zh').clicked = this.state.theQuiz['IsZH']
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
                theQuiz : {...this.state.theQuiz, 'IsZH' : false, 'groups' : []}
            })
            document.getElementsByClassName('member-content')[0].style.display = "none"
        }
    }
    handleTestAttributeChange = (newValue, actionMeta) => {
        
        if(newValue['value'] === 'all'){
            this.setState({
                filtered_questionBaes : [...this.state.questionBase],
                filtered_questionBaes_for_more : [...this.state.questionBase],
                SearchedTest : newValue['value'],
                moduleSearchDisabled : true,
                SearchedModul : undefined,
                searchedWord : '',
            })
            this.handleUsedQuestionIDs()
        }else{
            var pos = this.state.everyDataTogetherOfQuizzes.findIndex(obj => obj['id'] === newValue['value'])
            if (pos > -1) {
                let tmp_array = []
                this.state.everyDataTogetherOfQuizzes[pos]['modules'].map((module) =>{
                    tmp_array.push(...module['questions'])
                })
                let searchable_modules =[]
                this.state.everyDataTogetherOfQuizzes[pos]['ModuleIDs'].map((moduleName)=>{
                    searchable_modules.push({'label': moduleName, 'value' : moduleName})
                })
                this.setState({
                    filtered_questionBaes : [...tmp_array],
                    filtered_questionBaes_for_more : [...tmp_array],
                    SearchedTest : newValue['value'],
                    moduleSearchDisabled : false,
                    SearchedModul : undefined,
                    ModulesForSearch : [...searchable_modules,{'label' : 'Összes', 'value' : 'all'}],
                    searchedWord : '',
                })
                this.handleUsedQuestionIDs()
             }
        }
    };
    handleModuleAttributeChange = (newValue, actionMeta) => {
        var pos = this.state.everyDataTogetherOfQuizzes.findIndex(obj => obj['id'] === this.state.SearchedTest)
        if(newValue['value'] === 'all'){
            let tmp_array = []
            this.state.everyDataTogetherOfQuizzes[pos]['modules'].map((module) => {
                tmp_array.push(...module['questions'])
            })
            this.setState({
                filtered_questionBaes : [...tmp_array],
                filtered_questionBaes_for_more : [...tmp_array],
                SearchedModul : {'label' : newValue['label'], 'value' : newValue['value']},
                searchedWord : '',
            })
            this.handleUsedQuestionIDs()
        }else{
            if (pos > -1) {
                let tmp_array = []
                this.state.everyDataTogetherOfQuizzes[pos]['modules'].map((module) => {
                    if(module['name'] === newValue['value']){
                        tmp_array.push(...module['questions'])
                    }
                })
                this.setState({
                    filtered_questionBaes : [...tmp_array],
                    filtered_questionBaes_for_more : [...tmp_array],
                    SearchedModul : {'label' : newValue['value'], 'value' : newValue['value']},
                    searchedWord : '',
                })
                this.handleUsedQuestionIDs()
             }
        }
    };
    handleSearchChange = (event) =>{
        this.setState({
            filtered_questionBaes_for_more : [],
            searchedWord : event.target.value
        },()=>{
            let tmp_array = []
            this.state.filtered_questionBaes.map((question) =>{
                if(question['question'].toLowerCase().includes(event.target.value.toLowerCase())){
                    var pos = tmp_array.findIndex(obj => obj['id'] === question['id'])
                    if(pos === -1){
                        tmp_array.push(question) 
                    }
                }
            })
            this.setState({
                filtered_questionBaes_for_more : tmp_array,
                searchedWord : event.target.value
            })
        })
        this.handleUsedQuestionIDs()
    }
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
    changeChildState = () => {
        this.childRef.current.handleModulGettingDeleted();
    }
    handleAddGroup = (group) =>{
        this.setState({
            basic_group_infos : [...this.state.basic_group_infos,group],
            allGroupsOfTests : [...this.state.allGroupsOfTests,{'name' : group['name'], 'members' : []}]
        })
    }
    handleQuizDelete = () =>{
        this.setState({
            actQuiz : {'label': '', 'folder': '', 'value' : ''}
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
                        <form autoComplete="off">
                            <div class="center-fullwidth">
                                <div id="select-top">
                                    <Select width="50%" 
                                    id="test-select" 
                                    placeholder="Új teszt / Sablon kiválasztása..." 
                                    options={this.state.tests} 
                                    onChange={this.setupBackend}
                                    value={this.state.replaceTestValue}
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
                            <div class="center-fullwidth">
                                <ChooseImageDialog />
                            </div>
                            <div class="test-attributes">
                                <input type="radio" class="edit" id="edit" onClick={this.handleTypeChange} name="test-type" value="EDIT_TEST"/>
                                <label for="edit" class="edit">Szerkesztés</label><br/>
                                <input type="radio" onClick={this.handleTypeChange} class="template" id="template" name="test-type" value="TEMPLATE_TEST"/>
                                <label for="template" class="template">Felhasználás sablonként</label><br/>
                                <input type="checkbox" checked={this.state.theQuiz['IsZH']} id="zh" onChange={this.handleZHChange} class="zh" name="zh" value="zh"/>
                                <label for="zh" class="zh" > Zárthelyi dolgozat</label><br/>
                            </div>
                            <div class="center-fullwidth">
                                <DeleteQuizDialog id="deleteQuizDialog" action={this.setupBackend} folder={this.state.actTest['folder']} name={this.state.actTest['label']}/>
                            </div>
                        </form>
                    </div>
                    <br/>
                    <div class="question-content">
                        <h1 onClick={()=>{console.log(this.state.filtered_questionBaes_for_more)}}>Kérdések hozzáadása a feladatsorhoz</h1>
                        <form>
                            <div class="center-fullwidth">
                                <div class="select-multy">
                                    <Select width="50%" 
                                    id="search-test-select" 
                                    placeholder="Teszt keresése..." 
                                    options={this.state.TestsForSearch} 
                                    onChange={this.handleTestAttributeChange}
                                    />
                                </div>
                            </div>
                            <div class="center-fullwidth">
                                <div class="select-multy">
                                    <Select width="50%" 
                                    id="search-module-select" 
                                    value = {this.state.SearchedModul? this.state.SearchedModul : null}
                                    isDisabled={this.state.moduleSearchDisabled}
                                    placeholder="Modul keresése..." 
                                    options={this.state.ModulesForSearch} 
                                    onChange={this.handleModuleAttributeChange}
                                    />
                                </div>
                            </div>
                            <div class="center-fullwidth">
                                <input type="text" onChange={this.handleSearchChange} class="text-input" value={this.state.searchedWord} placeholder="Kulcsszavak keresése..."></input>
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
                                <AddModuleDialog action={this.handleAddModul} maxidx={this.state.theQuiz['modules'].length+1}/>
                                <ModifyModuleDialog action={this.handleModifyModul} index={this.state.actModul-1} dataset={this.state.theQuiz['Module_Fields']}/>
                            </div>
                        </form>
                        <div class="transferlist">
                            <TransferList 
                                headers={['Választható','Választott']} 
                                type='questions' 
                                containedQuestions={this.state.theQuiz['modules'][this.state.actModul-1] ? this.state.theQuiz['modules'][this.state.actModul-1]['questions'] : []} 
                                handleModul={this.handleQuestionUpdate} 
                                questions={this.state.filtered_questionBaes_for_more}
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
                            <div class="result-members">Hozzárendelt csoportok: <var id="result-members">{this.state.theQuiz['groups'] ? this.state.theQuiz['groups'].length : 0}</var></div>
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
                            <div class="result-members">Hozzárendelt csoportok: <var id="result-members">{this.state.theQuiz['groups']?this.state.theQuiz['groups'].length : "0"}</var></div>
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
                                <button onClick={this.handleFinish} id="SaveBtn" class="finish-button">
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