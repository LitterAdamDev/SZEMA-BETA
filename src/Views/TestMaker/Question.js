import React from 'react';

export default class Question extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }
    componentDidMount(){
        console.log(this.props.data)
    }
    render() {
      return (
          <>
            <div>{this.props.data? this.props.data["id"]: null}</div>
          </>
      )
    }
}
Question.defaultProps ={
    data : undefined
}