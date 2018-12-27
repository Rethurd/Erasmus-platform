 import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import database,{firebase} from '../firebase/firebase';
import StrangerCard from './StrangerCard';
import FriendCard from './FriendCard';
import selectStrangers from '../selectors/selectStrangers'; 
import TextField from '@material-ui/core/TextField';
import { changeUsersTextFilter } from '../actions/usersFilters';
import selectUsers from '../selectors/selectUsers';
import selectFriends from '../selectors/selectFriends';

class FriendsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            friends:[],
            userEmail:'',
            userName:'',
            loading:true,
            filterText:'',
            friendsFilterText:''
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
                ...userSnapshot.val(),friends:friendsArray,
                loading:false
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
    handleSearch = (e) =>{
        const filterText = e.target.value;
        this.setState(()=>({filterText}));
        this.props.changeUsersTextFilter(filterText);

    }
    handleSearchFriends = (e) =>{
        const friendsFilterText = e.target.value;
        this.setState(()=>({friendsFilterText}));
    }
    render() { 
        
        return (
            
            <div>
                {this.state.loading ? 
                <div>
                     <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>: 
                <div>
                    <div className="friendsPage">
                    <div className="strangers">
                        <h3 className="strangers__heading">Find new friends!</h3>
                        <div className="strangers__search">
                            <p>Search by name:</p>
                            <TextField 
                                label="Search"
                                value={this.state.filterText}
                                onChange={this.handleSearch}
                            />
                        </div>
                        <div className="strangers__grid">
                            {selectStrangers(this.props.users,this.state.friends).map((singleUser)=>{
                                return <StrangerCard addFriend={this.addFriendToList} key={singleUser.userId} friend="NO" userData={singleUser}></StrangerCard>
                            })}
                        </div>
                    </div>
                    <div className="friendsList"> 
                            <div className="friendsList__header">Friends Header</div>
                            <div className="friendsList__search">
                            <TextField 
                                placeholder="Search..."
                                value={this.state.friendsFilterText}
                                onChange={this.handleSearchFriends}
                            />
                            </div>
                            <div className="friendsList__list">
                                {selectFriends(this.state.friends,this.state.friendsFilterText).map((singleFriend)=>{
                                    return <FriendCard removeFriend={this.removeFriendFromList} key={singleFriend.friendId} userData={singleFriend}/>
                                })}
                            </div>
                    </div>
                 </div>
                 <p>{this.state.userID}</p>
                 </div>
                }
                {/* some info about how many friends you have, etc. */}
                 
            </div> 
        );
    }
}
 
const mapStateToProps = (state) =>({
    users:selectUsers(state.users,state.usersFilters)
}); 

const mapDispatchToProps = (dispatch) =>({
    changeUsersTextFilter: (text) =>dispatch(changeUsersTextFilter(text))
})

export default connect(mapStateToProps,mapDispatchToProps)(FriendsPage);