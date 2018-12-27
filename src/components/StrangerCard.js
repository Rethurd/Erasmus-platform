import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {addFriendToDatabase} from '../actions/users';
import {firebase} from '../firebase/firebase';
class StrangerCard  extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

     handleAddFriend = () =>{
        this.btn.setAttribute("disabled", "disabled");
        const friend = {
            friendEmail:this.props.userData.userEmail,
            friendId:this.props.userData.userId,
            friendName:this.props.userData.userName
        }
        const userId = firebase.auth().currentUser.uid;
        this.props.addFriendToDatabase(userId,friend).then((friendshipId)=>{
            const friendWithFriendshipId={
                ...friend,
                friendshipId
            }
            this.props.addFriend(friendWithFriendshipId);
        });
    }
    render(){
        return (
    
            <div className="strangerCard">
                <div className="strangerPhoto"><img className="strangerPhoto--img" src="..\resources\graphics\default-profile.png" alt="Default photo"/></div>
                <div className={classNames("strangerName")}>{this.props.userData.userName}</div>
                <div><button 
                ref={btn => { this.btn = btn; }} 
                 onClick={this.handleAddFriend} className={classNames("btn","btn-success")}>Add friend</button></div>
            </div>
        );
    }
    
}
 
const mapDispatchToProps= (dispatch)=>({
    addFriendToDatabase: (userId, friend)=>dispatch(addFriendToDatabase(userId,friend))
});

export default connect(null,mapDispatchToProps)(StrangerCard);