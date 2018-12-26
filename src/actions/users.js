 import database,{firebase} from '../firebase/firebase';
 import {arrayToObject, isEmpty} from '../resources/functions';

 export const addFriend = (userId, friend)=>({
    type:'ADD_FRIEND',
    userId,
    friend
})

export const removeFriend = (userId, friendID)=>({
    type:'ADD_FRIEND',
    userId,
    friendID
});


export const addFriendToDatabase = (userId, friend)=>{
    return (dispatch)=>{
        return database.ref(`users/${userId}/friends`).push(friend).then((ref)=>{
            // dispatch(addFriend(userId, friend));
        });
    };
};

export const deleteComment = (helpPostId, commentId)=>({
    type:'DELETE_COMMENT',
    helpPostId,
    commentId
});

export const deleteCommentFromDatabase = (helpPostId, commentId)=>{
    return (dispatch)=>{
        return database.ref(`helpPosts/${helpPostId}/comments/${commentId}`).remove().then(()=>{
            dispatch(deleteComment(helpPostId,commentId));
        });
    };
};

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

