import React,{ useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import GroupManager from './GroupManager'
import Settings from './Settings'
import TestManager from './TestManager'
import Options from './Options'
import {db} from '../../config/base'
import 'firebase/firestore'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://youtu.be/iik25wqIuFo">
      {new Date().getFullYear()}. 
      {' Minden jog fenntartva!'}
      </Link>{' '}
    </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Típus','Beállítások', 'Csoport', 'Feladatsor'];

function getStepContent(canStep,handleStep,step,handleTypeChange,handleDeleteTest,handleDetailsChange,details,handleGroups,groups,groupOfTest,handleSetup,modules,handleModules,questions,handleQuestions,handleSave) {
  switch (step) {
    case 0:
        return <Options 
          action={handleTypeChange}/>;
    case 1:
      return <Settings 
        canStep={canStep}
        handleStep={handleStep}
        action={handleDetailsChange} 
        data={details} 
        handleSetup={handleSetup}
        titles={
          details["tests"].map((test)=>{
            return test.title
          })
        }
        deleteTest={handleDeleteTest}/>;
    case 2:
      return <GroupManager 
        action={handleGroups} 
        data={groups} 
        isZH={details["isZH"]} 
        actGroup={groupOfTest}/>;
    case 3 :
      return <TestManager 
        canStep={canStep}
        handleStep={handleStep}
        modules={modules} 
        questions={questions} 
        handleModules={handleModules} 
        handleQuestions={handleQuestions} 
        save={handleSave}/>;
    default:
      throw new Error('Unknown step');
  }
}

export default function Builder() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [testType, setTestType] = React.useState('NEW_TEST');
  const [isZH, setIsZH] = React.useState(false);
  const [testDetails, setTestDetails] = React.useState({title: "", description: "", icon:""});
  const [timeOfZH, setTimeOfZH] = React.useState({start: 0, end: 0})
  const [FirestoreGroups, setFirestoreGroups] = React.useState([])
  const [FirestoreTests, setFirestoreTests] = React.useState([])
  const [FirestoreQuestions, setFirestoreQuestions] = React.useState([])
  const [groupOfTest, setGroupOfTest] = React.useState("")
  const [moduleIDs, setModuleIDs] = React.useState([])
  const [modules, setModules] = React.useState([{title:"random", data : []}])
  const [canStep, setCanStep] = React.useState(true)

  const handleSetup = (newValue, actionMeta) =>{
    var pos = FirestoreTests.findIndex(obj => obj['title'] === newValue["value"])
    if(pos !== -1){
        let tmp = FirestoreTests[pos]
        setIsZH(tmp["zh"])
        if(testType === "TEMPLATE_TEST"){
          setTestDetails({title: "", description: tmp["description"], icon: tmp["icon"]})
        }else{
          setTestDetails({title: tmp["title"], description: tmp["description"], icon: tmp["icon"]})
        }
        setModuleIDs([...tmp["moduleIDs"]])
        let allModule = []
        tmp["moduleIDs"].map((moduleName) =>{
          allModule.push({ data: [...tmp[moduleName]], title: moduleName})
        })
        setModules(allModule)
        if(tmp["zh"]){
            setTimeOfZH({start: tmp["time"][0], end: tmp["time"][1]})
            setGroupOfTest(tmp["group"])
        }
    }
  }
  const handleQuestionChange = (index,type,obj) =>{
  }
  const handleModuleChange = (type,obj) =>{
    let tmp = [...modules]
    if(type === "ADD"){
      tmp.splice(obj.index+1,0,obj.data)
    }else if(type === "REMOVE"){
      let curr = tmp[obj.index]['data'][4]
      tmp.splice(obj.index,1)
      tmp.map((modul)=>{
        modul.data[1] =modul.data[1].replace(':' + curr,'').replace(curr + ':','').replace(curr,'')
      })
    }else if(type === "MODIFY"){
      tmp[obj.index] = obj.data
    }
    setModules(tmp)
  }
  const handleNext = () => {
    if(canStep){
      setActiveStep(activeStep + 1);
    }
  };
  const getQuestions = () =>{
      db.collection('questions').get()
      .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
          const data = doc.data()
          data_from_web.push({...data,id:doc.id})
        })
        setFirestoreQuestions([...data_from_web])
      })
      .catch( error => console.log(error))
  }
  const getTests = () =>{
    db.collection('quizes').get()
    .then( snapshot => {
      const data_from_web = []
      snapshot.forEach(doc => {
        const data = doc.data()
        data_from_web.push({...data,id:doc.id})
      })
      setFirestoreTests([...data_from_web])
    })
    .catch( error => console.log(error))
    }
    const getGroups = () =>{
        db.collection('groups').get()
        .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
            const data = doc.data()
            data_from_web.push({...data,id:doc.id})
        })
        setFirestoreGroups([...data_from_web])
        })
        .catch( error => console.log(error))
    }
    useEffect(() => {
      getGroups()
      getTests()
      getQuestions()
    },[]);
    const handleBack = () => {
      setActiveStep(activeStep - 1);
      setCanStep(true)
    };
  
    const handleTypeChange = (value) =>{
      setTestType(value)
      setIsZH(false)
      setTestDetails({title: "", description: "", icon:""})
      setTimeOfZH({start: "", end: ""})
      setGroupOfTest("")
      setModules([])
      setModuleIDs([])
      handleNext()
    }

  const handleDetailChange = (attr,value) =>{
    switch (attr) {
        case "title":
            setTestDetails({...testDetails, title: value})
            break;
        case "description":
            setTestDetails({...testDetails, description: value})
            break;
        case "icon":
            setTestDetails({...testDetails, icon: value})
            break;
        case "zh" :
            setIsZH(value)
            if(!value){
              setTimeOfZH({start: "", end: ""})
              setGroupOfTest("")
            }
            break;
        case "time-start" :
            setTimeOfZH({...timeOfZH, start: value})
            break;
        case "time-end" :
            setTimeOfZH({...timeOfZH, end: value})
            break;
        default:
            throw new Error('Unknown attribute');
      }
  }
  const handleGroupChange = (value) =>{
     setGroupOfTest(value)
  }
  const deleteTest = () =>{
    db.collection('quizes').doc(testDetails['title']).delete().then(()=>{
      handleBack()
    }).catch((error)=>{console.log(error)}).then(()=>{
      let pos = FirestoreTests.findIndex(obj =>obj.id === testDetails['title'])
      if(pos !== -1){
        let tmp = [...FirestoreTests]
        tmp.splice(pos,1)
        setFirestoreTests(tmp)
      }
    })
  }
  const handleSave = () =>{
    let tmp = {}
    let IDs = []
    modules.map((modul)=>{
      tmp = {...tmp, [modul.title]: modul.data}
      IDs.push(modul.title)
    })
    let test ={
      zh : isZH,
      title: testDetails['title'],
      time: [timeOfZH.start, timeOfZH.end],
      moduleIDs : [...IDs],
      group : groupOfTest,
      description : testDetails['description'],
      icon : testDetails['icon'],
      ...tmp
    }
    let name = testDetails['title']
    if(name === ""){
      name = "no-name-test"
      setTestDetails({...testDetails, title: name})
    }
    db.collection('quizes')
    .doc(name)
    .set(test)
    .catch((error)=>{
      console.log(error)
    })
    .finally(()=>{
      handleNext()
    })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout} >
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Feladatsor Manager
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom align="center">
                  Sikeresen létrehozott egy tesztet.
                </Typography>
                <Button 
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    href="/"
                >
                    Visszatérés a főoldalra
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(canStep, setCanStep, activeStep, handleTypeChange, deleteTest ,handleDetailChange, {isZH: isZH, testDetails: testDetails,timeOfZH: timeOfZH, type: testType, tests : FirestoreTests},handleGroupChange,FirestoreGroups,groupOfTest,handleSetup,modules,handleModuleChange,FirestoreQuestions,handleQuestionChange,handleSave)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Vissza
                    </Button>
                  )}
                  {activeStep !== 0? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={activeStep !== steps.length - 1  ? handleNext : handleSave}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1  ? 'Befejezés és mentés' : 'Tovább'}
                    </Button>
                      ):(null)}
                  
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}