// import validator from 'validator';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter , {history} from './routers/AppRouter';
import configureStore from './store/configureStore';
import {login,logout} from './actions/auth';
import sortedEvents from './selectors/sortedEvents';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import database, {firebase} from './firebase/firebase';
import { addEvent,startAddEvent, getEventsFromDatabase } from './actions/events';
import {addPost, getHelpPostsFromDatabase, addCommentToDatabase } from './actions/help';
import {addInfoPost,getInfoPostsFromDatabase} from './actions/info';
import moment from 'moment';
import uuid from 'uuid';
import { addToDoPost,addRatingToDatabasePost, getToDoPostsFromDatabase,changeRatingsSum } from './actions/toDo';

const store = configureStore();

// console.log(store.getState());

store.subscribe(()=>{
    const state = store.getState();

    console.log('store changed');
    console.log(state);
});

const infoPost = {
    infoPostId:uuid(),
    name:'first info post',
    description:'first info description',
    createdBy:'',
    createdById:'',
    creationDate:''

}

store.dispatch(addInfoPost(infoPost));

const helpPost = {
    postId:uuid(),
    name:'firstPost',
	description:'radom description',
	datePosted:moment()
}

const comment = {
    date:moment(),
    content:'this is my comment',
    author:'Kamil',
    commentId:'asdasd'
}

// store.dispatch(addPost(helpPost));
// store.dispatch(addCommentToDatabase('-LTY2Ei4jyG-jVZsDiYy',comment,'Kamil'));
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
ReactDOM.render(<p>Loading...</p>,document.getElementById('app'));



firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        console.log('uid',user.uid);
        store.dispatch(login(user.uid));
        store.dispatch(getHelpPostsFromDatabase());
        store.dispatch(getInfoPostsFromDatabase());
         store.dispatch(getToDoPostsFromDatabase()).then(()=>{
            const review = {
                authorId:'DWakg8YCU7WpwmExWJrNB4rsEMY2',
                liked:1
            }
            store.dispatch(changeRatingsSum('-LUARBxWluHbmI0E3Pnx','NEGATIVE','ADD',false,true));
            // store.dispatch(addRatingToDatabasePost('-LUAR4IWgqCVAxmINBPG',review));
        });
        store.dispatch(getEventsFromDatabase()).then(()=>{
            renderApp();
            // const admin = {
            //     'adminID':user.uid,
            //     'adminEmail':user.email
            // }
            // database.ref('adminList').push(admin);


            // sortedEvents(store.getState().events);
            if (history.location.pathname==='/'){
                history.push('/info');
            }
        });
    }else{
        store.dispatch(logout());
        renderApp();
        history.push('/');
    }
});




const singleParticipant = {
    participantId:'blablabla',
    participantData:{
        name:'Random user',
        email:'random@mail.com'
    }
}
const secondParticipant = {
    participantId:'blebleble',
    participantData:{
        name:'Another user',
        email:'randomuser2@mail.com'
    }
}



console.log(store.getState());
const event = {
    'eventId':uuid(),
    'date':moment(),
    'name':'Event with a participant',
    'description':'this will be such a fun event',
    'location':'My house',
    'participants':[singleParticipant,secondParticipant]
    
            
}
const event2 = {
    'eventId':uuid(),
    date:moment().add('days',1),
    name:'second event',
    description:'this will be less fun',
    location:'My house',
    'participants':[]
    
}
const event3 = {
    'eventId':uuid(),
    date:moment().format('X'),
    name:'third event',
    description:'this will be horrible',
    location:'My house',
    'participants':[]
    
}

// const DBevent = {
//     'date':moment(),
//     'eventId':uuid(),
//     'name':'Event with a participant',
//     'description':'this will be such a fun event',
//     'location':'My house',
//     'participants':[singleParticipant,secondParticipant]
        
// }

// console.log(event);

//checking unix moment
// console.log(DBevent.date);
// const unix = DBevent.date.unix();
// console.log(moment(unix));
// console.log(moment.unix(unix));
// console.log(moment(unix*1000));
// const test = new Date(unix*1000);
// console.log('will this work',moment(test).format('DD-MM-YYYY'));


// store.dispatch(startAddEvent(event));
// store.dispatch(startAddEvent(event2));

// const arrayToObject = (array, keyField) =>
//    array.reduce((obj, item) => {
//      obj[item[keyField]] = item
//      return obj
//    }, {})
// //have to do this when adding an event to firebase
// const peopleObject = arrayToObject(DBevent.participants, "participantId");
// DBevent.participants=peopleObject;
// database.ref('events').push(DBevent);

// const peopleObject2 = arrayToObject(event3.participants, "participantId");
// event3.participants=peopleObject2;
// database.ref('events').push(event3);

// const participantsToAdd = [singleParticipant,secondParticipant];
// const participantsToAddObject = arrayToObject(participantsToAdd,"participantId");
// database.ref(`events/-LSz09fN5HE2lV9eGuDO/participants`).update(participantsToAddObject);







//participants/{participantId}/participantData
// database.ref('events').push(DBevent);
// store.dispatch(addEvent(event));
// store.dispatch(addEvent(event2));
// // store.dispatch(addEvent(event3));
// console.log(store.getState());







// const toDoPost0 = {
//     toDoPostId:uuid(),
//     name:'third To Do Post',
//     description:'Fresher post but worst reviews',
//     createdBy:'',
//     createdById:'',
//     creationDate:moment().add('days',2),
//     ratingsPositive:3,
//     ratingsNegative:3
// }

// const toDoPost = {
//     toDoPostId:uuid(),
//     name:'first To Do Post',
//     description:' some desc',
//     createdBy:'',
//     createdById:'',
//     creationDate:moment(),
//     ratingsPositive:5,
//     ratingsNegative:2
// }

// const toDoPost2 = {
//     toDoPostId:uuid(),
//     name:'second To Do Post',
//     description:'Fresher post but worse reviews',
//     createdBy:'',
//     createdById:'',
//     creationDate:moment().add('days',1),
//     ratingsPositive:5,
//     ratingsNegative:1
// }


// store.dispatch(addToDoPost(toDoPost));
// store.dispatch(addToDoPost(toDoPost2));
// store.dispatch(addToDoPost(toDoPost0));
