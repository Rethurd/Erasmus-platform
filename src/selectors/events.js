

const eventsSelector = (events,date) =>{
    const eventsAtThisDay = [];
    events.forEach(event => {
        if(event.date.format('DD-MM-YYY')===date.format('DD-MM-YYY'))
        {
            eventsAtThisDay.push(event);
        }
    });
    return eventsAtThisDay;
}

export default eventsSelector;