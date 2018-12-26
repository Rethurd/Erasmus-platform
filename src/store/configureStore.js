import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import eventsReducer from '../reducers/events';
import helpPostsReducer from '../reducers/help';
import infoPostsReducer from '../reducers/info';
import toDoPostsReducer from '../reducers/toDo';
import toDoFiltersReducer from '../reducers/toDoFilters';
import usersReducer from '../reducers/users';

//Store creation
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    const store = createStore(combineReducers({
        auth:authReducer,
        events:eventsReducer,
        helpPosts:helpPostsReducer,
        infoPosts:infoPostsReducer,
        toDoPosts:toDoPostsReducer,
        toDoFilters:toDoFiltersReducer,
        users:usersReducer
}),
        composeEnhancers(applyMiddleware(thunk)) // for asynchronous actions
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
}
