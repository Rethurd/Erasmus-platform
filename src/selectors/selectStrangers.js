const selectStrangers = (allUsers, currentFriends) =>{
    if(currentFriends.length==0){
        return allUsers;
    }
    const nonFriends = [];
    allUsers.forEach((singleUser)=>{
        const isFound = currentFriends.find((singleFriend)=> {
            return singleFriend.friendId==singleUser.userId;
        
        });
        if(isFound==undefined){
            nonFriends.push(singleUser)
        }
    })
    return nonFriends;
}

export default selectStrangers;