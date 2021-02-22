import logo from './logo.svg';
import './App.css';
import { Login, Register } from "./components/login/index";
import React from "react";

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLogginActive: true
    };
  }

  //change state between reg. and login component to be on the right or on the left side
  changeState() {
    const { isLogginActive } = this.state;

    if (isLogginActive) {


     {/*
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left"); */}
    } else {




      {/*
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");*/}
    }
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

  render(){
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Regisztráció" : "Belépés";
    const currentActive = isLogginActive ? "login" : "register";
    return(
      <div className="App">
        <div className="login">
          <div className="container">
            {isLogginActive && <Login containerRef={(ref) => this.current = ref}/>}
            {/*
            
            Ide johetne, ha !isLogginActive akkor az jelentse azt,hogy azert nem aktiv,mert mar be van jelentkezve. Tehat a homepagera iranyitson at!
            
            */}
            {/*{isLogginActive && <Login containerRef={(ref) => this.current = ref}/>}
            {!isLogginActive && <Register containerRef={(ref) => this.current = ref} />}*/}
          </div>
          {/*<RightSide
            current={current}
            currentActive={currentActive}
            containerRef={ref => (this.rightSide = ref)}
            onClick={this.changeState.bind(this)}*/}
        </div>
      </div>
    )
  }
}
{/*
const RightSide = props => {
  return <div className="right-side" ref={props.containerRef} onClick={props.onClick}>
     <div className="inner-container">
       <div className="text">{props.current}</div>
     </div>
  </div>
}
*/}

export default App;
