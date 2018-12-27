const selectFriends = (friends,nameFilter) => {
    
    if(nameFilter==''){
        return friends;
    }else{
        return friends.filter((singleFriend)=>{
            return (singleFriend.friendName.toLowerCase().includes(nameFilter.toLowerCase()));
        })
    }

}

export default selectFriends;