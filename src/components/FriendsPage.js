 import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import database,{firebase} from '../firebase/firebase';
import StrangerCard from './StrangerCard';
import FriendCard from './FriendCard';
import selectStrangers from '../selectors/selectStrangers'; 

class FriendsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            friends:[],
            userEmail:'',
            userName:''
        }
        const userId = firebase.auth().currentUser.uid;
        database.ref(`users/${userId}`).once('value',(userSnapshot)=>{
            const friendsArray = [];
                    if(!!userSnapshot.val().friends){
                        const friends = userSnapshot.val().friends;
                            for (var singleFriend in friends) {
                                if (friends.hasOwnProperty(singleFriend)) {
                                    friends[singleFriend] = {
                                        ...friends[singleFriend],
                                        friendshipId:singleFriend
                                }
                                friendsArray.push(friends[singleFriend]);
                            }
                        }
                    }
            this.setState(()=>({
                ...userSnapshot.val(),friends:friendsArray
            }));
            
        })  
    }

    addFriendToList = (friend) =>{
        this.setState((state)=>{
            const newFriendsList = state.friends;
            newFriendsList.push(friend);
            return{
                friends:newFriendsList
            }
        })
    }

    removeFriendFromList = (friendId) =>{
        this.setState((state)=>{
            const newFriendsList = state.friends.filter((singleFriend)=>{
                return singleFriend.friendId!=friendId;
            });
            return{
                friends:newFriendsList
            }
        })
    }
    render() { 
        
        return (
            
            <div>
            
                {/* some info about how many friends you have, etc. */}
                 <div className="friendsPage">
                    <div className="strangers">
                        <h3 className="strangers__heading">Find new friends!</h3>
                        <div className="strangers__grid">
                            {selectStrangers(this.props.users,this.state.friends).map((singleUser)=>{
                                return <StrangerCard addFriend={this.addFriendToList} key={singleUser.userId} friend="NO" userData={singleUser}></StrangerCard>
                            })}
                        </div>
                    </div>
                    <div className="friendsList"> 
                            <div className="friendsList__header">Friends Header</div>
                            <div className="friendsList__search">Search</div>
                            <div className="friendsList__list">
                                {this.state.friends.map((singleFriend)=>{
                                    return <FriendCard removeFriend={this.removeFriendFromList} key={singleFriend.userId} userData={singleFriend}/>
                                })}
                            </div>
                    </div>
                 </div>
                 <p>{this.state.userID}</p>
            </div> 
        );
    }
}
 
const mapStateToProps = (state) =>({
    users:state.users
}); 

const mapDispatchToProps = (dispatch) =>({

})

export default connect(mapStateToProps,mapDispatchToProps)(FriendsPage);