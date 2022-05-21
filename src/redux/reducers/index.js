import master from './masterReducer'
import avatar from './avatarReducer'
import { combineReducers } from 'redux'

export default combineReducers({
  master,
  avatar
})