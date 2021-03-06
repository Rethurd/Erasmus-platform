import database from '../firebase/firebase';
import moment from 'moment';
import {isEmpty, arrayToObject} from '../resources/functions';
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
            event.eventId=ref.key;
            event.date = changeDate;
            dispatch(addEvent(event));
        });
    }
}

export const deleteEvent = (eventId)=>({
    type:'DELETE_EVENT',
    eventId
});

export const deleteEventFromDatabase = (eventId)=>{
    return (dispatch)=>{
        return database.ref(`events/${eventId}`).remove().then(()=>{
            dispatch(deleteEvent(eventId));
        });
    };
};

export const editEvent = (eventData)=>({
    type:'EDIT_EVENT',
    eventData
});

export const editEventInDatabase = (eventData)=>{
    return (dispatch)=>{

        // the format of the data changes when saving to DB, and we need the original, but assigning it creates a reference instead of cloning it
        const unchangedEventData = Object.assign({},eventData); 

        eventData.date=eventData.date.unix();
        const participantsObject = arrayToObject(eventData.participants, "participantId");
        eventData.participants=participantsObject;
        return database.ref(`events/${eventData.eventId}`).update(eventData).then(()=>{
            dispatch(editEvent(unchangedEventData));
        });
    };
};

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
                // if there are participants in the event
                if(!!event.val().participants){
                    //convert the object to an array of participants                    
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

export const addParticipantToDatabase = (eventId,participantId,participantData)=>{
    return(dispatch)=>{
        const newParticipant = {
            participantId,
            participantData
        }
        const participantToAdd=arrayToObject([newParticipant],'participantId');
        //dont have to check if it's already in there, because we validate it in EventModal
        return database.ref(`events/${eventId}/participants`).update(participantToAdd).then(()=>{
            dispatch(addParticipant(eventId,participantId,participantData));
        });
    }
}

export const removeParticipant = (eventId,participantId)=>({
type:'REMOVE_PARTICIPANT',
eventId,
participantId
});

export const removeParticipantFromDatabase = (eventId,participantId) =>{
    return (dispatch)=>{
        return database.ref(`events/${eventId}/participants/${participantId}`).remove().then(()=>{
            dispatch(removeParticipant(eventId,participantId));
        });
    };
};