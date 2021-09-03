import React, { Component } from 'react'
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
import firebase from 'firebase/app';
import 'firebase/storage'; 
import { actionTypes } from 'react-redux-firebase';
 
export default class ImageSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      imageList : []
    }
    this.onPick = this.onPick.bind(this)
  }
  componentDidMount(){
    var storage = firebase.storage();
    var storageRef = storage.ref(this.props.path);
    var temp = []
    storageRef.listAll().then(function (result) {
      
      let path = storageRef.fullPath
      path = path.replace(/\b\/\b(?!.*?\b\/\b)/, "%2F");
      result.items.forEach(fileRef => {
          temp.push({name:  fileRef.name})
      });
    }).then(()=>{
      temp.map((file) =>{
        storageRef.child(file['name']).getDownloadURL()
        .then((url)=>{
          this.setState({
            imageList : [...this.state.imageList, {'url': url, 'name': file['name']}]
          })
        })
      })
    }).catch(error => {
      console.log(error);
    })
    
    var imageList = []
  }
  onPick(image) {
    this.setState({
      image : image
    })
    this.props.action(image)
  }
  
  render() {
    return (
      <div style={{width:"100%",display:"flex", justifyContent:"center"}}>
        <ImagePicker 
          images={this.state.imageList.map((image, i) => ({src: image['url'], value: i, name : image['name']}))}
          onPick={this.onPick}
        />
      </div>
    )
  }
}
 
ImageSelector.defaultProps ={
  path : '',
  action : undefined,
}