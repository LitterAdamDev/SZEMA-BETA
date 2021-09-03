import React from 'react';
import Typography from '@material-ui/core/Typography';
import Modul from './Modul'
import '../../css/TestManager.css'
import Select from 'react-select'

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
    let tmp = {title: obj.name, data: [this.props.modules[index]["data"][0],"",obj.icon,obj.description,obj.name]}
    this.props.handleModules('MODIFY',{index:index, data : tmp})
  }
  handleModifyModulQuestions = (type,obj) =>{
    console.log(obj)
    if(type === 'REMOVE'){
      let cont = this.props.modules[obj.index]["data"][0].includes(':')
      let std = this.props.modules[obj.index]["data"][0].replace(obj.id,'')
      console.log(std)
      let tmp = {...this.props.modules[obj.index]}
      tmp.data[0] = std
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