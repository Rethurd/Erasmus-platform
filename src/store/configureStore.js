import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import eventsReducer from '../reducers/events';
import helpPostsReducer from '../reducers/help';
import infoPostsReducer from '../reducers/info';

//Store creation
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    const store = createStore(combineReducers({
        auth:authReducer,
        events:eventsReducer,
        helpPosts:helpPostsReducer,
        infoPosts:infoPostsReducer
        }),
        composeEnhancers(applyMiddleware(thunk)) // for asynchronous actions
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
}
