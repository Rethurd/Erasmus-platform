import React from 'react';
import classNames from 'classnames';
const FriendCard = (props) => {
    return ( 
        <div className="friendCard">
            <div className="friendPhoto"><img className="friendPhoto--img" src="..\resources\graphics\default-profile.png" alt="Default photo"/></div>
            <div className={classNames("friendName")}>{props.userData.friendName}</div>
            <div><i className={classNames("fa fa-times")} aria-hidden="true"></i></div>
        </div>
     );
}
 
export default FriendCard;