
const isParticipating = (participants,userID) =>{
    
    
    for (let index = 0; index < participants.length; index++) {
        if(participants[index].participantId==userID){
            return true;
        }
    }
    return false;
    
    
}

export default isParticipating;