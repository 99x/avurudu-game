import { combineReducers } from 'redux'
import userReducer from './User/UserReducer'

const rootReducer = combineReducers({
    user: userReducer
})

export default rootReducer