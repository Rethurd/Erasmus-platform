import database from '../firebase/firebase';
import moment from 'moment';
const arrayToObject = (array, keyField) =>
   array.reduce((obj, item) => {
     obj[item[keyField]] = item
     return obj
   }, {});

const isEmpty = (obj) =>{
    for(let singleParticipant in obj) {
        if(obj.hasOwnProperty(singleParticipant))
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
            //TO DO: spread the object like in getEvents, jut do the spread BEFORE changes.

            // change format so it fits the assumptions
            const changeDate = moment(event.date*1000);
            if(isEmpty(event.participants))
                event.participants=[];
            event.eventId=ref.singleParticipant;
            event.date = changeDate;
            dispatch(addEvent(event));
        });
    }
}

export const addMultipleEvents = (eventsToAdd)=>({
type:'ADD_MULTIPLE_EVENTS',
eventsToAdd
});


export const getEventsFromDatabase = () =>{
    return(dispatch)=>{
        return database.ref('events').once('value').then((allEvents)=>{
            const eventsToSetArray=[];
            allEvents.forEach((event)=>{
                const participantsArray = [];
                if(!!event.val().participants){
                    
                    const participants = event.val().participants;
                    for (var singleParticipant in participants) {
                        if (participants.hasOwnProperty(singleParticipant)) {
                            participantsArray.push(participants[singleParticipant]);
                        }
                    }
                }   
                // const participants = !!event.val().participants ? event.val().participants : [];
                const modifiedEvent = {
                    ...event.val(),
                    date:moment(event.val().date*1000),
                    eventId:event.key,
                    participants:participantsArray
                    
                }
                eventsToSetArray.push(modifiedEvent);
            });
            dispatch(addMultipleEvents(eventsToSetArray));
        })
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