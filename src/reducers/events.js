const defaultEventsState = [];

const eventsReducer = (state = defaultEventsState,action) =>{

    switch(action.type){
        case 'ADD_EVENT':
            return [...state,action.event];
        default:
            return state;
    }
}

export default eventsReducer;