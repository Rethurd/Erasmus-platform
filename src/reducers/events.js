const defaultEventsState = [];


const eventsReducer = (state = defaultEventsState,action) =>{

    switch(action.type){
        case 'ADD_EVENT':
            return [...state,action.event];
        case 'ADD_PARTICIPANT':
            const thisEvent = state.filter((singleEvent)=>singleEvent.eventId==action.eventId);
            const otherEvents = state.filter((singleEvent)=>singleEvent.eventId!=action.eventId);
            //thisEvent is an array with 1 object, we get it here:
            const thisEventSingle = thisEvent[0];
            //we add the participant
            const newParticipant = {
                participantId:action.participantId,
                participantData:{
                    ...action.participantData
                }
            }
            thisEventSingle.participants.push(newParticipant);
            //add the changed event back to the array
            otherEvents.push(thisEventSingle);
            return otherEvents;
            
        case 'REMOVE_PARTICIPANT':
            const thisEventRemove = state.filter((singleEvent)=> singleEvent.eventId==action.eventId);
            const otherEventsRemove = state.filter((singleEvent)=>singleEvent.eventId!=action.eventId);
            const thisEventSingleRemove = thisEventRemove[0];
            const thisEventParticipantsAfterRemoval = thisEventSingleRemove.participants.filter((singleParticipant)=>singleParticipant.participantId!=action.participantId);
            thisEventSingleRemove.participants=thisEventParticipantsAfterRemoval;
            otherEventsRemove.push(thisEventSingleRemove);
            return otherEventsRemove;

        default:
            return state;
    }
    

}

export default eventsReducer;