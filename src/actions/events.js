import database from '../firebase/firebase';
import moment from 'moment';
const arrayToObject = (array, keyField) =>
   array.reduce((obj, item) => {
     obj[item[keyField]] = item
     return obj
   }, {});

const isEmpty = (obj) =>{
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};
// //have to do this when adding an event to firebase
// const peopleObject = arrayToObject(event.participants, "participantId");
// DBevent.participants=peopleObject;
// // database.ref('events').push(DBevent);

export const addEvent = (event) =>({
type:'ADD_EVENT',
event
});

export const startAddEvent = (event) =>{
    return(dispatch)=>{
        event.date=event.date.unix();
        const participantsObject = arrayToObject(event.participants, "participantId");
        event.participants=participantsObject;
        return database.ref('events').push(event).then((ref)=>{
            // change format so it fits the assumptions
            const changeDate = moment(event.date*1000);
            if(isEmpty(event.participants))
                event.participants=[];
            event.eventId=ref.key;
            event.date = changeDate;
            dispatch(addEvent(event));
        });
    }
}


export const addParticipant = (eventId,participantId,participantData)=>({
type:'ADD_PARTICIPANT',
eventId,
participantId,
participantData
});
export const removeParticipant = (eventId,participantId)=>({
type:'REMOVE_PARTICIPANT',
eventId,
participantId
});