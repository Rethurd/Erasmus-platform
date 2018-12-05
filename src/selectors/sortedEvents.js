

const sortedEvents = (events) =>{
    return events.sort((event1,event2)=>event1.date.unix()<event2.date.unix() ? -1 : 1);
}

export default sortedEvents;