
export const addEvent = (event) =>({
type:'ADD_EVENT',
event
});

export const addParticipant = (eventId,participantId,participantName)=>({
type:'ADD_PARTICIPANT',
eventId,
participantId,
participantName
});