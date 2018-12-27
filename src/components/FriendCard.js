import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {removeFriendFromDatabase} from '../actions/users';
import {firebase} from '../firebase/firebase';
const FriendCard = (props) => {
    
    const handleRemoveFriend = () =>{
        const userId = firebase.auth().currentUser.uid;
        props.removeFriendFromDatabase(userId,props.userData.friendshipId).then(()=>{
            props.removeFriend(props.userData.friendId);
        });
    }

    return ( 
        <div className="friendCard">
            <div className="friendPhoto"><img className="friendPhoto--img" src="..\resources\graphics\default-profile.png" alt="Default photo"/></div>
            <div className={classNames("friendName")}>{props.userData.friendName}</div>
            <div onClick={handleRemoveFriend}><i className={classNames("fa fa-times")} aria-hidden="true"></i></div>
        </div>
     );
}
 

const mapDispatchToProps = (dispatch)=>({
    removeFriendFromDatabase : (userId, friendshipId) => dispatch(removeFriendFromDatabase(userId,friendshipId))
})
export default connect(null,mapDispatchToProps)(FriendCard);