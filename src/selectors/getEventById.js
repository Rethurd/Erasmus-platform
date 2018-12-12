const getEventById = (events, eventId)=>{
    return events.find((singleEvent)=>singleEvent.eventId==eventId)
}

export default getEventById;