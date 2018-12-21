import React from 'react';
import moment from 'moment';
import database,{firebase} from '../firebase/firebase';
import {connect} from 'react-redux';
import {addRatingToDatabasePost} from '../actions/toDo'

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
            <div onClick={()=>{this.props.openPostModal(this.props.toDoPostData.toDoPostId)}}>
                <h3>{this.props.toDoPostData.name}</h3>
                <p>{this.props.toDoPostData.description}</p>
                <p>Date Posted: {this.props.toDoPostData.creationDate.format('DD-MM-YYYY')}</p>
                <p>Recommended by : {this.props.toDoPostData.ratingsPositive}</p>
                <p>Not recommended by: {this.props.toDoPostData.ratingsNegative}</p>

                {/* if user hasnt liked OR disliked the post */}
                {/* {(this.state.thisUserDisliked==false && this.state.thisUserLiked==false) ? 
                <div>
                    <button onClick={this.handleAddPositiveReview}>Thumbs up</button>
                    <button onClick={this.handleAddNegativeReview}>Thumbs down</button>
                </div> : null}
                {this.state.thisUserDisliked==true ? 
                    <div>
                    <button onClick={this.handleChangeNegativeToPositiveReview}>Change - to +</button>
                    <button onClick={this.handleCancelNegativeReview}>Cancel negative</button>
                </div>
                 : null}
                 {this.state.thisUserLiked==true ? 
                    <div>
                    <button onClick={this.handleCancelPositiveReview}>Cancel Positive</button>
                    <button onClick={this.handleChangePositiveToNegativeReview}>Change + to - </button>
                </div>
                 : null} */}


                {/* <p>Average rating: {(this.props.toDoPostData.ratings.reduce((a,b)=>{
                    return a+b;
                },0)/this.props.toDoPostData.ratings.length).toFixed(2)}</p> */}
                {/*  if admin/owner, display delete and edit buttons here */}
            </div>
         );
    }
}
 
// this made the Post component unable to update together with connect
// const mapDispatchToProps = (dispatch)=>({
//     addRatingToDatabasePost: (toDoPostId,review) => dispatch(addRatingToDatabasePost(toDoPostId,review))
// })
export default ToDoPost;