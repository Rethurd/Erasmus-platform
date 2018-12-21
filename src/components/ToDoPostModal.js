import React from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {increaseRatingsPositive, addRatingToDatabasePost,deleteRatingFromDatabasePost, updateRatingOfPostInDatabase,changeRatingsSumInDatabase} from '../actions/toDo';
import {firebase} from '../firebase/firebase';

class ToDoPostModal extends React.Component {
    constructor(props) {
        super(props);
        
        let leftAReview = false;
         for (let index = 0; index < this.props.toDoPostData.reviews.length; index++) {
             if(this.props.toDoPostData.reviews[index].authorId==firebase.auth().currentUser.uid){
                 leftAReview = true;
                 if(this.props.toDoPostData.reviews[index].liked==1){
                     this.state = { 
                        ...this.props.toDoPostData,
                        currentUserLiked:true,
                        currentUserDisliked:false,
                        reviewId:this.props.toDoPostData.reviews[index].reviewId,
                       
                     }
                 }
                 else if(this.props.toDoPostData.reviews[index].liked==0){
                    this.state = { 
                        ...this.props.toDoPostData,
                        currentUserLiked:false,
                        currentUserDisliked:true,
                        reviewId:this.props.toDoPostData.reviews[index].reviewId
                     }
                }
             }
             
         }
         if(leftAReview==false){
            this.state = { 
                ...this.props.toDoPostData,
                currentUserLiked:false,
                currentUserDisliked:false
             }
         }
    }

    handleIncreaseRatingsPositive = ()=>{
        this.props.increaseRatingsPositive(this.state.toDoPostId);
        this.props.onRequestClose();
    }

    handleLikeButtonClicked = () =>{
        if(this.state.currentUserDisliked){
            //change the review from negative to positive
            this.props.updateRatingOfPostInDatabase(this.props.toDoPostData.toDoPostId,this.state.reviewId,1).then(()=>{
                this.props.changeRatingsSumInDatabase(this.props.toDoPostData.toDoPostId,'POSITIVE','ADD',false,true);
            });
        }
        else if(this.state.currentUserLiked){
            //delete review ('unlike')
            this.props.deleteRatingFromDatabasePost(this.props.toDoPostData.toDoPostId,this.state.reviewId).then(()=>{
                this.props.changeRatingsSumInDatabase(this.props.toDoPostData.toDoPostId,'POSITIVE','SUBTRACT',false,false);
            });;
        }else{
            //add positive review
            const userId = firebase.auth().currentUser.uid;
            const review ={
                authorId:userId,
                liked:1
            }
            this.props.addRatingToDatabasePost(this.props.toDoPostData.toDoPostId,review).then(()=>{
                this.props.changeRatingsSumInDatabase(this.props.toDoPostData.toDoPostId,'POSITIVE','ADD',false,false)
            });
            
        }
        this.props.onRequestClose();   


    }

    handleDislikeButtonClicked = () =>{
        if(this.state.currentUserLiked){
            //change the review from positive to negative
            this.props.updateRatingOfPostInDatabase(this.props.toDoPostData.toDoPostId,this.state.reviewId,0).then(()=>{
                this.props.changeRatingsSumInDatabase(this.props.toDoPostData.toDoPostId,'POSITIVE','ADD',true,false);
            });;
        }
        else if(this.state.currentUserDisliked){
            //delete review ('cancel dislike')
            this.props.deleteRatingFromDatabasePost(this.props.toDoPostData.toDoPostId,this.state.reviewId).then(()=>{
                this.props.changeRatingsSumInDatabase(this.props.toDoPostData.toDoPostId,'NEGATIVE','SUBTRACT',false,false);
            });;
        }else{
            //add negative review
            const userId = firebase.auth().currentUser.uid;
            const review ={
                authorId:userId,
                liked:0
            }
            this.props.addRatingToDatabasePost(this.props.toDoPostData.toDoPostId,review).then(()=>{
                this.props.changeRatingsSumInDatabase(this.props.toDoPostData.toDoPostId,'NEGATIVE','ADD',false,false);
            });;
        }
        this.props.onRequestClose(); 
    }

    render() { 
        return ( 
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                ariaHideApp={false}>
                <div>Recommendation</div>
                <h3>{this.props.toDoPostData.name}</h3>
                <p>{this.props.toDoPostData.description}</p>
                <p>Date Posted: {this.props.toDoPostData.creationDate.format('DD-MM-YYYY')}</p>
                <p>Recommended by : {this.props.toDoPostData.ratingsPositive}</p>
                <p>Not recommended by: {this.props.toDoPostData.ratingsNegative}</p>
                <p>Current user liked: {this.state.currentUserLiked.toString()}</p>
                <p>Current user disliked: {this.state.currentUserDisliked.toString()}</p>
                <button onClick={this.handleLikeButtonClicked} >Thumbs up!</button>
                <button onClick={this.handleDislikeButtonClicked} >Thumbs down!</button>
            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch)=>({
    increaseRatingsPositive: (toDoPostId) => dispatch(increaseRatingsPositive(toDoPostId)),
    addRatingToDatabasePost: (postId, review) =>dispatch(addRatingToDatabasePost(postId,review)),
    deleteRatingFromDatabasePost: (postId,reviewId) =>dispatch(deleteRatingFromDatabasePost(postId,reviewId)),
    updateRatingOfPostInDatabase: (postId,reviewId,newRating) =>dispatch(updateRatingOfPostInDatabase(postId,reviewId,newRating)),
    changeRatingsSumInDatabase : (postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive) =>dispatch(changeRatingsSumInDatabase(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive))
})

export default connect(null,mapDispatchToProps)(ToDoPostModal);