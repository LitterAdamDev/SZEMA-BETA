import authReducer from './authReducer';
import { combineReducers } from 'redux';
import newsReducer from './newsReducer';
import {firebaseReducer} from 'react-redux-firebase';
import {firestoreReducer} from 'redux-firestore';

const rootReducer = combineReducers({
    auth: authReducer,
    news: newsReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});
export default rootReducer