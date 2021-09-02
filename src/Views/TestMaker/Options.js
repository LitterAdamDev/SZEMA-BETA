import React from 'react';
import '../../css/Options.css'

export default class TestMaker extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }
    handleTypeSelect = (event) =>{
        this.props.action(event.target.id)
    }
    render() {
      return (
          <>
            <div className="quiz-types">
                <div className="qtype" id="NEW_TEST" onClick={this.handleTypeSelect}>
                    Új üres teszt
                </div>
                <div className="qtype" id="TEMPLATE_TEST" onClick={this.handleTypeSelect}>
                    Új teszt sablonból
                </div>
                <div className="qtype" id="EDIT_TEST" onClick={this.handleTypeSelect}>
                    Teszt módosítása
                </div>
            </div>
          </>
      )
    }
}
TestMaker.defaultProps = {
    action : undefined
}