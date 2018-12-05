// import validator from 'validator';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter , {history} from './routers/AppRouter';
import configureStore from './store/configureStore';
import {login,logout} from './actions/auth';
import getVisibleExpenses from './selectors/expenses';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import {firebase} from './firebase/firebase';
import { addEvent } from './actions/events';
import moment from 'moment';
import uuid from 'uuid';

const store = configureStore();

// console.log(store.getState());

store.subscribe(()=>{
    const state = store.getState();
    // console.log(getVisibleExpenses(state.expenses,state.filters));
});

console.log(store.getState());
const event = {
    'eventId':uuid(),
    date:moment(),
    name:'first event',
    description:'this will be such a fun event',
    location:'My house',
    'participants':[],
    'participantsID':[]
            
}
const event2 = {
    'eventId':uuid(),
    date:moment().add('days',1),
    name:'second event',
    description:'this will be less fun',
    location:'My house',
    'participants':['Kamil Grzegorek'],
    'participantsID':['DWakg8YCU7WpwmExWJrNB4rsEMY2']
}
const event3 = {
    'eventId':uuid(),
    date:moment(),
    name:'third event',
    description:'this will be horrible',
    location:'My house',
    'participants':['Kamil Grzegorek'],
    'participantsID':[]
}
store.dispatch(addEvent(event));
store.dispatch(addEvent(event2));
store.dispatch(addEvent(event3));
console.log(store.getState());

const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
    
);

let hasRendered = false;
const renderApp = ()=>{
    if(!hasRendered){
        ReactDOM.render(jsx,document.getElementById('app'));
        hasRendered=true;
    }
}
ReactDOM.render(jsx,document.getElementById('app'));



firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        console.log('uid',user.uid);
        store.dispatch(login(user.uid));
        if (history.location.pathname==='/'){
            history.push('/info');
        }
       

    }else{
        store.dispatch(logout());
        renderApp();
        history.push('/');
    }
});

