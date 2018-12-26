import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {addFriendToDatabase} from '../actions/users';
import {firebase} from '../firebase/firebase';
const StrangerCard = (props) => {

    const handleAddFriend = () =>{
        const friend = {
            friendEmail:props.userData.userEmail,
            friendId:props.userData.userId,
            friendName:props.userData.userName
        }
        const userId = firebase.auth().currentUser.uid;
        props.addFriendToDatabase(userId,friend).then(()=>{
            props.addFriend(friend);
        });
    }
    return (
    
        <div className="strangerCard">
            <div className="strangerPhoto"><img className="strangerPhoto--img" src="..\resources\graphics\default-profile.png" alt="Default photo"/></div>
            <div className={classNames("strangerName")}>{props.userData.userName}</div>
            <div><button onClick={handleAddFriend} className={classNames("btn","btn-success")}>Add friend</button></div>
        </div>
    );
}
 
const mapDispatchToProps= (dispatch)=>({
    addFriendToDatabase: (userId, friend)=>dispatch(addFriendToDatabase(userId,friend))
});

export default connect(null,mapDispatchToProps)(StrangerCard);