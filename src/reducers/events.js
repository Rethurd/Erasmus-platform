const defaultEventsState = [];


const eventsReducer = (state = defaultEventsState,action) =>{

    switch(action.type){
        case 'ADD_EVENT':
            return [...state,action.event];
        case 'ADD_PARTICIPANT':
            const thisEvent = state.filter((singleEvent)=>{
                return singleEvent.eventId==action.eventId;
            });
            const otherEvents = state.filter((singleEvent)=>{
                return singleEvent.eventId!=action.eventId;
            });
            //thisEvent is an array with 1 object, we get it here:
            const thisEventActual = thisEvent[0];
            //we add the participant
            thisEventActual.participants.push(action.participantName);
            thisEventActual.participantsID.push(action.participantId);
            //add the changed event back to the array
            otherEvents.push(thisEventActual);
            return otherEvents;
        default:
            return state;
    }
}

export default eventsReducer;