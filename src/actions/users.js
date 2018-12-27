 import database,{firebase} from '../firebase/firebase';
 import {arrayToObject, isEmpty} from '../resources/functions';




export const addFriendToDatabase = (userId, friend)=>{
    return ()=>{
        return database.ref(`users/${userId}/friends`).push(friend).then((ref)=>{
            // return friendshipId in the promise so it can be used in StrangerCard
            return ref.key;
        });
    };
};

export const removeFriendFromDatabase = (userId,friendshipId)=>{
    return ()=>  database.ref(`users/${userId}/friends/${friendshipId}`).remove();
}

export const addUsersToStore = (users)=>({
    type:'ADD_USERS_TO_STORE',
    users
})
export const getUsersFromDatabase = ()=>{
    const currentUserId = firebase.auth().currentUser.uid;
    return (dispatch) =>{
        return database.ref('users').once('value',(allUsers)=>{
            const users=[];
            allUsers.forEach((user)=>{
                // dont add if same id as current
                if(user.val().userId!=currentUserId){
                    //format the friends object to Array
                    const friendsArray = [];
                    if(!!user.val().friends){
                        const friends = user.val().friends;
                            for (var singleFriend in friends) {
                                if (friends.hasOwnProperty(singleFriend)) {
                                    friends[singleFriend] = {
                                        ...friends[singleFriend],
                                        friendId:singleFriend
                                }
                                friendsArray.push(friends[singleFriend]);
                            }
                        }
                    }
                    const modifiedUser = {...user.val(),friends:friendsArray};
                    users.push(modifiedUser);
                }
            });
            dispatch(addUsersToStore(users));
        });
    }
}

