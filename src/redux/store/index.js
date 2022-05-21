import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import reducer from '../reducers'
import rootSaga from '../actions/sagas'

const sagaMiddleware = createSagaMiddleware()

//const middleware = __DEV__ ? applyMiddleware(sagaMiddleware, createLogger()) : applyMiddleware(sagaMiddleware)
const middleware = applyMiddleware(sagaMiddleware)

const store = createStore(reducer, middleware)
sagaMiddleware.run(rootSaga)

export default store
