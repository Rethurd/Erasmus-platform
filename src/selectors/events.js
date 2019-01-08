const eventsSelector = (events,date,userFriendsId,displayEvents) =>{
    const eventsAtThisDay = [];
    if(displayEvents!='all'){  
        events.forEach(event => {
            if(event.date.format('DD-MM-YYYY')===date.format('DD-MM-YYYY'))
            {
                // check if one of friends is participating
                if(event.participants!=null){
                    for (let index = 0; index < event.participants.length; index++) {
                        if(userFriendsId.includes(event.participants[index].participantId)){
                            eventsAtThisDay.push(event);
                            //break, otherwise adds one instance for each friend
                            break; 
                        }   
                    }
                }
                
            }
        });
    }else{
        events.forEach(event => {
            if(event.date.format('DD-MM-YYYY')===date.format('DD-MM-YYYY'))
            {
                eventsAtThisDay.push(event);
            }
        });
    }
    return eventsAtThisDay;
}

export default eventsSelector;