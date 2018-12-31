import React from 'react';
import database,{firebase} from '../firebase/firebase';
import classNames from 'classnames';

class ToDoPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            thisUserDisliked:false,
            thisUserLiked:false
            
         }
         database.ref(`toDoPosts/${this.props.toDoPostData.toDoPostId}/reviews`).once('value').then((allReviews)=>{
            allReviews.forEach((singleReview)=>{
                if(singleReview.val().authorId==firebase.auth().currentUser.uid){
                    if(singleReview.val().liked==1){
                        this.setState(()=>({thisUserLiked:true}));
                    }else if(singleReview.val().liked==0){
                        this.setState(()=>({thisUserDisliked:true}));
                    }
                }
            });
         });
    };

    handleAddNegativeReview = () =>{

    }
    handleAddPositiveReview = () =>{
        const userID = firebase.auth().currentUser.uid
        const review = {
            authorId:userID,
            liked:1
        }
        this.props.addRatingToDatabasePost(this.props.toDoPostData.toDoPostId,review)
    }
    handleChangePositiveToNegativeReview = () =>{

    }
    handleChangeNegativeToPositiveReview = () =>{
        
    }
    handleCancelPositiveReview = () =>{

    }
    handleCancelNegativeReview = () =>{
        
    }

    render() { 
        return ( 
            <div className="toDoPost" onClick={()=>{this.props.openPostModal(this.props.toDoPostData.toDoPostId)}}>
                {this.props.toDoPostData.name.length>30 ? <h3 className="toDoPost__name">{this.props.toDoPostData.name.substring(0,30)}...</h3> : <h3 className="toDoPost__name">{this.props.toDoPostData.name}</h3> }
                <div className="toDoPost__reviews">
                    <div className="toDoPost__recommended__container"> 
                        <span className="toDoPost__recommended"><i className={classNames("fas fa-thumbs-up")}></i></span><span>{this.props.toDoPostData.ratingsPositive}</span>
                    </div>
                    <div className="toDoPost__recommended__separator"><span>:</span></div>
                    <div className="toDoPost__notRecommended__container"> 
                        <span>{this.props.toDoPostData.ratingsNegative}</span><span className="toDoPost__notRecommended"><i className={classNames("fas fa-thumbs-down")}></i></span>
                    </div>
                </div>
                <div className="toDoPost__descriptionContainer">
                    <h4 className="text-center">Description:</h4>
                    <div className="toDoPost__description" >{this.props.toDoPostData.description}</div>
                </div>
                <div className="toDoPost__date" >Date Posted: {this.props.toDoPostData.creationDate.format('DD-MM-YYYY')}</div>
                
                

            
            </div>
         );
    }
}
 
// this made the Post component unable to update together with connect
// const mapDispatchToProps = (dispatch)=>({
//     addRatingToDatabasePost: (toDoPostId,review) => dispatch(addRatingToDatabasePost(toDoPostId,review))
// })
export default ToDoPost;