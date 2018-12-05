

const eventsSelector = (events,date) =>{
    const eventsAtThisDay = [];
    events.forEach(event => {
        if(event.date.format('DD-MM-YYYY')===date.format('DD-MM-YYYY'))
        {
            eventsAtThisDay.push(event);
        }
    });
    return eventsAtThisDay;
}

export default eventsSelector;