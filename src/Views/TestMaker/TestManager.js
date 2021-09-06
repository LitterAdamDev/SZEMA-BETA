import React from 'react';
import Typography from '@material-ui/core/Typography';
import Modul from './Modul'
import '../../css/TestManager.css'
import AddModuleDialog from './AddModulDialog';
import ModifyModulDialog from './ModifyModulDialog';

export default class TestManager extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  componentDidMount(){
  }
  handleDeleteModul = (index) =>{
    this.props.handleModules("REMOVE",{index: index})
  }
  handleAddModul = (index,obj) =>{
    let tmp = {title: obj.name, data: ["","",obj.icon,obj.description,obj.name]}
    this.props.handleModules('ADD',{index:index,data: tmp})
  }
  handleModifyModul = (index,obj) =>{
    let tmp = {title: obj.name, data: [this.props.modules[index]["data"][0],obj.selection,obj.icon,obj.description,obj.name]}
    this.props.handleModules('MODIFY',{index:index, data : tmp})
  }
  handleModifyModulQuestions = (type,obj) =>{
    if(type === 'REMOVE'){
      let cont = this.props.modules[obj.index]["data"][0].includes(':')
      let std = this.props.modules[obj.index]["data"][0]
      if(!cont){
        std = std.replace(obj.id,'')
      }else{
        std = std.replace(':' + obj.id,'')
        std = std.replace( obj.id + ':','')
      }
      let tmp = {...this.props.modules[obj.index]}
      tmp.data[0] = std
      this.props.handleModules('MODIFY',{index:obj.index, data : tmp})
    }
    else if(type === 'ADD'){
      let tmp = {...this.props.modules[obj.index]}
      tmp.data[0] = obj.IDs
      this.props.handleModules('MODIFY',{index:obj.index, data : tmp})
    }
  }
  render(){
    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Feladatsor kezelése
        </Typography>
        <div className="builder-body">
          <AddModuleDialog 
            zerotype={true} 
            path='quizes/quiz_type' 
            allModul={
              this.props.modules.map((modul)=>{
                return {title: modul.title, description: 'modul["data"][3]'}
              })
            } 
            action={this.handleAddModul}/>
          {this.props.modules.map((module,index) =>{
            return (
              <>
                <Modul 
                  key={"modul-"+index} 
                  id={"modul-"+index} 
                  index={index} 
                  data={module} 
                  questions={
                    module["data"][0].split(':').map((questionID)=>{
                      let pos = this.props.questions.findIndex(obj => obj.id === questionID)
                      if(pos !== -1){
                        return this.props.questions[pos]
                      }
                    })
                  } 
                  allModulData ={
                    this.props.modules.map((modul)=>{
                      return {title: modul.title, "description": modul.data[3]}
                    })
                  }
                  allQuestion={this.props.questions}
                  handleAddModul={this.handleAddModul}
                  handleDeleteModul={this.handleDeleteModul}
                  handleModifyModul={this.handleModifyModul}
                  handleModifyModulQuestions={this.handleModifyModulQuestions}
                  />
              </>
            )
          })}
        </div>
      </React.Fragment>
    );
  }
}

TestManager.defaultProps = {
  modules : [],
  questions : [],
  handleQuestions : undefined,
  handleModules : undefined,
}