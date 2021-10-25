import React, { useEffect } from "react"
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import 'firebase/firestore'
import {db} from '../../config/base'
import { withStyles } from "@material-ui/core/styles"
import '../../css/NewsDashboard.css'
import "firebase/auth"
import firebase from "../../config/base.js"
import '../../css/QuestionBase.css'
import ResHeader from '../Components/ResHeader'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import NewTopicDialog from './NewTopicDialog'
import ModifyTopicDialog from './ModifyTopicDialog'
import NewQuestionDialog from './NewQuestionDialog'
import ModifyQuestionDialog from "./ModifyQuestionDialog"
import { TenMpRounded } from "@mui/icons-material"
import Select from 'react-select'

const abc = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N']

const useStyles = (theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  heroContent: {
    backgroundColor: 'white',
    padding: theme.spacing(8, 0, 6),
    height : "100vh",
    
  },
  questionGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    backgroundColor: "#1c2442",
  },
});
class QuestionBaseIndex extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        FirestoreQuestions: [],
        FirestoreTopics: [],
        filteredFirestoreQuestions : [],
        choosen_topic : undefined,
        choosen_question : undefined,
        topicFilter : {label: "Összes", value: "Összes"},
    };
  }
    getQuestions = () =>{
        db.collection('questions').get()
        .then( snapshot => {
            const data_from_web = []
            snapshot.forEach(doc => {
            const data = doc.data()
            data_from_web.push({...data,id:doc.id})
            })
            this.setState({
                FirestoreQuestions : [...data_from_web],
                filteredFirestoreQuestions : [...data_from_web],
                topicFilter : {label: "Összes", value: "Összes"}
            })
        })
        .catch( error => console.log(error))
    }
    getTopics = () =>{
		function sortByKey(array, key) {
			return array.sort(function(a, b) {
				var x = a[key]; var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}
        db.collection('topics').get()
        .then( snapshot => {
            const data_from_web = []
            snapshot.forEach(doc => {
            const data = doc.data()
            data_from_web.push({...data,id:doc.id})
            })
            this.setState({
                FirestoreTopics : [...sortByKey(data_from_web,"Topicname")],
            })
        })
        .catch( error => console.log(error))
    }
    componentDidMount(){
        this.getQuestions()
        this.getTopics()
    }
    handleQuestionChoose = (event) =>{
		let id = event.target.id;
		if(event.target.checked){
			this.setState({
				choosen_question : id,
			})
		}else{
			this.setState({
				choosen_question : undefined,
			})
		}
	}
    handleTopicChoose = (event) =>{
		let id = event.target.id;
		if(event.target.checked){
			this.setState({
				choosen_topic : id,
			})
		}else{
			this.setState({
				choosen_topic : undefined,
			})
		}
    }
    handleDeleteTopic = (event) =>{
		event.preventDefault()
    let pos0 = this.state.FirestoreTopics.findIndex(obj =>obj.id === this.state.choosen_topic)
		if(pos0 !== -1){
			this.state.FirestoreQuestions.map((question)=>{
        if(question.topicName === this.state.FirestoreTopics[pos0].Topicname){
          db.collection('questions')
            .doc(question.id)
            .update({...question, topicName: "Alapértelmezett"})
            .catch((error)=>{console.log(error)})
        }
      })
		}
    
		db.collection('topics').doc(this.state.choosen_topic)
		.delete()
		.catch((error)=>{console.log(error)})
		let pos = this.state.FirestoreTopics.findIndex(obj =>obj.id === this.state.choosen_topic)
		if(pos !== -1){
			let tmp = [...this.state.FirestoreTopics]
			tmp.splice(pos,1)
			this.setState({
				FirestoreTopics : [...tmp],
				choosen_topic : undefined,
			},()=>{this.getQuestions()})
		}
	} 
	handleDeleteQuestion = (event) =>{
		event.preventDefault()
    db.collection('quizes').get()
    .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
        const data = doc.data()
        data_from_web.push({...data,id:doc.id})
        })
        data_from_web.map((quiz) =>{
          quiz['moduleIDs'].map((moduleName) =>{
            let tmp = quiz[moduleName][0]
            let cont = tmp.includes(':')
            if(tmp.includes(this.state.choosen_question)){
              if(!cont){
                tmp = tmp.replace(this.state.choosen_question,'')
              }else{
                tmp = tmp.replace(':' + this.state.choosen_question,'')
                tmp = tmp.replace( this.state.choosen_question + ':','')
              }
              quiz[moduleName][0] = tmp
              
            }
          })
          db.collection('quizes')
                .doc(quiz.id)
                .set({...quiz})
                .catch( error => console.log(error))
          })
      })
      .finally(()=>{
        db.collection('questions').doc(this.state.choosen_question)
          .delete()
          .catch((error)=>{console.log(error)})
          let pos = this.state.FirestoreQuestions.findIndex(obj =>obj.id === this.state.choosen_question)
          if(pos !== -1){
            let tmp = [...this.state.FirestoreQuestions]
            tmp.splice(pos,1)
            this.setState({
              FirestoreQuestions : [...tmp],
              choosen_question : undefined,
            })
          }
      })
      .finally(()=>{this.getQuestions()})
      .catch( error => console.log(error))
	  } 
    handleNewTopic = (obj) =>{
      	this.getTopics()
		//may extend later
    }
    handleModifiedTopic = (obj) =>{
        this.getTopics()
		//may extend later
    }
    getAllTopicForSelect = () =>{
      let tmp = [{label: "Összes", value: "Összes"}]
      this.state.FirestoreTopics && this.state.FirestoreTopics.map((topic)=>{tmp.push({label: topic.Topicname, value : topic.Topicname})})
      return tmp
    }
    handleSelectTopicFilter = (value, event) =>{
      this.setState({
        topicFilter : value
      })
      let tmp = []
      this.state.FirestoreQuestions.map((question) =>{
        if(question.topicName === value.value || value.value === "Összes"){
          tmp.push(question)
        }
      })
      this.setState({
        filteredFirestoreQuestions : [...tmp]
      })
    }
    render(){
        const { classes } = this.props;
        return (
            <React.Fragment>
                <ResHeader />
                <main>
                <div className="questionbase-main">
                <Container className={classes.questionGrid} maxWidth="md">
                    <div className="topichandler">
                      <div className="topic-actions">
                        <NewTopicDialog action={this.handleNewTopic} choosen_topic_id={this.state.choosen_topic}/>
                        <ModifyTopicDialog action={this.handleModifiedTopic} choosen_topic_id={this.state.choosen_topic} topics={this.state.FirestoreTopics}/>
                        <input type="button" onClick={this.handleDeleteTopic} disabled={this.state.choosen_topic === undefined} className="action delete-topic action" value="Törlés"/>
                      </div>
                        <div className="question-picker">
                          <div>
                            {this.state.FirestoreTopics.map((topic)=>{
                                return (
                                    <Accordion id={topic.id}>
                                        <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        >
                                          <FormControlLabel
                                            aria-label="Acknowledge"
                                            onClick={(event) => event.stopPropagation()}
                                            onFocus={(event) => event.stopPropagation()}
                                            control={
                                              <Checkbox 
                                                id={topic['id']} 
                                                onChange={this.handleTopicChoose} 
                                                checked={(topic.id === this.state.choosen_topic) && (this.state.choosen_topic !== undefined)}
                                                disabled={(topic.id !== this.state.choosen_topic) && (this.state.choosen_topic !== undefined) || topic.Topicname === "Alapértelmezett"}/>}
                                                label={topic.Topicname}
                                              />
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            {topic.Description}
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })}  
                        </div>
                        </div>
                    </div>
                    <div className="questionhandler">
                <div className="">
                  <Select 
                    id="test-select"
                    style={{width: "100%"}}
                    placeholder="Témakör kiválasztása..."
                    options={this.getAllTopicForSelect()}
                    value={this.state.topicFilter}
                    onChange={this.handleSelectTopicFilter}
                  />
              </div>
						<div className="question-actions">
							<NewQuestionDialog action={this.getQuestions} topics={this.state.FirestoreTopics} choosen_question_id={this.state.choosen_question}/>
							<ModifyQuestionDialog topics={this.state.FirestoreTopics} action={this.getQuestions} choosen_question_id={this.state.choosen_question} questions={this.state.FirestoreQuestions}/>
							<input type="button" onClick={this.handleDeleteQuestion} disabled={this.state.choosen_question === undefined} className="action delete-question-action" value="Törlés"/>
                      	</div>
                        <div className="question-picker">
							{(this.state.filteredFirestoreQuestions && this.state.filteredFirestoreQuestions[0])? (this.state.filteredFirestoreQuestions.map((question)=>{
								return(
								<Accordion key={question.id}>
									<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-label="Expand"
									aria-controls="additional-actions3-content"
									id="additional-actions3-header"
									>
									<FormControlLabel
										aria-label="Acknowledge"
										onClick={(event) => event.stopPropagation()}
										onFocus={(event) => event.stopPropagation()}
										control={<Checkbox id={question['id']} onChange={this.handleQuestionChoose} disabled={(question.id !== this.state.choosen_question) && (this.state.choosen_question !== undefined)}/>}
										label={question.question + ' [' + question.points + ' pont]'}
									/>
									</AccordionSummary>
									<AccordionDetails>
									<div className="question-body">
										{
											question?
											question.isPicture &&
											(
												<img alt="Hiba" className="question-picture" src={question?question.picture: ""}/>
											):""
										}
										{
											question?question.answers.map((answer,index)=>{
												return (
													<div className="question-answer" 
													style={
														(question.type=== 0 && question.rightAnswer-1 === index) || 
														(question.type=== 1 && question.rightAnswer[index])  || 
                            (question.type=== 3)? {background: "green", fontWeight:"700"}: {}}>
														<div className="option">
															{[3,4].includes(question.type)?
																(
																	abc[index]+". Kérdés: " + answer
																):(
																	abc[index]+". Lehetőség: " + answer
																)
															}
															
														</div>
														<div className="answer">
															{
																question.type === 0 && (
																	question.rightAnswer-1 === index? "Helyes": ""
																)
															}
															{
																question.type === 1 && (
																	question.rightAnswer[index]? "Helyes": "Helytelen"
																)
															}
															{
																question.type === 2 && (
																	null
																)
															}
															{
																question.type === 3 && (
                                  <>
																	   {"Helyes válasz: " + question.rightAnswer[index]}
                                  </>
																)
															}
															{
																question.type === 4 && (
																	<img alt="megoldás" className="answer-picture" src={question.rightAnswer[index]} />
																)
															}
														</div>
													</div>
												)
											}):""
										}
									</div>
									</AccordionDetails>
								</Accordion>
								)
							})):""}
                        </div>
                    </div>
                </Container>
                </div>
                    <footer className={classes.footer} style={{color: "red"}}>
                        <Typography
                        variant="subtitle1"
                        align="center"
                        color="textSecondary"
                        component="p">
                        <div className="footer-text" style={{color: "white"}}>
                        <strong>SZEMA - </strong>Széchenyi István Egyetem
                        </div>
                        </Typography>
                    </footer>
                </main>
            </React.Fragment>
        );
    }
}
export default withStyles(useStyles)(QuestionBaseIndex);