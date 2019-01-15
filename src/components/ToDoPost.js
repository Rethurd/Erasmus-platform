import React from 'react';
import classNames from 'classnames';

const ToDoPost = (props) => (
    <div className="toDoPost" onClick={()=>{props.openPostModal(props.toDoPostData.toDoPostId)}}>
        {props.toDoPostData.name.length>30 ? 
            <h3 className="toDoPost__name">{props.toDoPostData.name.substring(0,30)}...</h3> 
            :
            <h3 className="toDoPost__name">{props.toDoPostData.name}</h3>
        }
        <div className="toDoPost__reviews">
            <div className="toDoPost__recommended__container"> 
                <span className="toDoPost__recommended"><i className={classNames("fas fa-thumbs-up")}></i></span>
                <span>{props.toDoPostData.ratingsPositive}</span>
            </div>
            <div className="toDoPost__recommended__separator"><span>:</span></div>
            <div className="toDoPost__notRecommended__container"> 
                <span>{props.toDoPostData.ratingsNegative}</span>
                <span className="toDoPost__notRecommended"><i className={classNames("fas fa-thumbs-down")}></i></span>
            </div>
        </div>
        <div className="toDoPost__descriptionContainer">
            <h4 className="text-center">Description:</h4>
            <div className="toDoPost__description" >{props.toDoPostData.description}</div>
        </div>
        <div className="toDoPost__date" >Date Posted: {props.toDoPostData.creationDate.format('DD-MM-YYYY')}</div>
    </div>
);
   

 
// this made the Post component unable to update together with connect
// const mapDispatchToProps = (dispatch)=>({
//     addRatingToDatabasePost: (toDoPostId,review) => dispatch(addRatingToDatabasePost(toDoPostId,review))
// })
export default ToDoPost;