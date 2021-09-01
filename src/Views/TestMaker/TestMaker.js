import React from 'react';
import ResHeader from '../Components/ResHeader'
import Builder from './Builder'

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
            <ResHeader />
            <Builder />
          </>
      )
    }
}