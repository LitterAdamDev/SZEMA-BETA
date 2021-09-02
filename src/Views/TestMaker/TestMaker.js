import React from 'react';
import ResHeader from '../Components/ResHeader'
import Builder from './Builder'
import '../../css/TestMaker.css'

export default class TestMaker extends React.Component {
    constructor() {
        super();
        this.state = {
            firestoreQuestionBase : [],
            firestoreGroupBase : [],
            firestoreQuizBase : [],
            currentQuiz : {},
        };
    }
    render() {
      return (
          <>
            <div className="test-main">
                <ResHeader />
                <Builder />
            </div>
          </>
      )
    }
}