
export const addEvent = (event) =>({
type:'ADD_EVENT',
event
});

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