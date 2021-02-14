import authReducer from './authReducer'
import { combineReducers } from 'redux'
import newsReducer from './newsReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    news: newsReducer
});
export default rootReducer