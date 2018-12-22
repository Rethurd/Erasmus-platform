import React from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {addRatingToDatabasePost,deleteRatingFromDatabasePost, updateRatingOfPostInDatabase,changeRatingsSumInDatabase, deleteToDoPostFromDatabase, editToDoPostInDatabase} from '../actions/toDo';
import {firebase} from '../firebase/firebase';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


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
                        editMode:false,
                        descriptionEmptyError:undefined,
                        nameEmptyError:undefined
                       
                     }
                 }
                 else if(this.props.toDoPostData.reviews[index].liked==0){
                    this.state = { 
                        ...this.props.toDoPostData,
                        currentUserLiked:false,
                        currentUserDisliked:true,
                        reviewId:this.props.toDoPostData.reviews[index].reviewId,
                        editMode:false,
                        descriptionEmptyError:undefined,
                        nameEmptyError:undefined
                     }
                }
             }
             
         }
         if(leftAReview==false){
            this.state = { 
                ...this.props.toDoPostData,
                currentUserLiked:false,
                currentUserDisliked:false,
                editMode:false,
                descriptionEmptyError:undefined,
                nameEmptyError:undefined
             }
         }
    }

    checkIfPostBelongsToUser = () =>{
       
        const user = firebase.auth().currentUser;   
        return user.uid==this.state.createdById;
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

    handleNameChange = (e)=>{
        const name = e.target.value;
        this.setState(()=>({name}));
    }
    handleDescriptionChange = (e)=>{
        const description = e.target.value;
        this.setState(()=>({description}));
    }
    handleTypeChange = (e) =>{
        this.setState(()=>({type:e.target.value}));
    };
    handleDeletePost = () =>{
        this.props.deleteToDoPostFromDatabase(this.state.toDoPostId);
        this.props.onRequestClose();
    }

    handleEditPost = () =>{
        this.setState(()=>({editMode:true}));
    }

    handleSaveChanges = ()=>{
        if(this.state.name==''){
            this.setState(()=>({nameEmptyError:'The post name cannot be empty!'}));
        }else{
            this.setState(()=>({nameEmptyError:undefined}));
        }
        if(this.state.description==''){
            this.setState(()=>({descriptionEmptyError:'The post description cannot be empty!'}));
        }else{
            this.setState(()=>({descriptionEmptyError:undefined}));
        }
        if (this.state.name!='' && this.state.description!=''){
            const {currentUserLiked,currentUserDisliked,editMode,descriptionEmptyError,nameEmptyError,reviewId,...postData} = this.state;
            this.props.editToDoPostInDatabase(postData).then(()=>{
                this.props.onRequestClose();
                // this.props.rerenderAfterComment(this.state.helpPostId);
            });
        }
        
    }

    render() { 
        return ( 
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                ariaHideApp={false}>
                <div>Recommendation</div>
                {this.state.editMode ? <h3>
                    {this.state.nameEmptyError==undefined ? null: <p>{this.state.nameEmptyError}</p>}
                    <TextField value={this.state.name} onChange={this.handleNameChange}/>
                    </h3> 
                :
                 <h3>{this.props.toDoPostData.name}</h3> }
                 {this.state.editMode ?
                    <div>
                        {this.state.descriptionEmptyError==undefined ? null: <p>{this.state.descriptionEmptyError}</p>}
                        <TextField value={this.state.description} onChange={this.handleDescriptionChange} multiline rows={5}/> 
                    </div>
                  :
                   <p>{this.props.toDoPostData.description}</p> }
                 {this.state.editMode ? 
                    <Select
                        value={this.state.type}
                        onChange={this.handleTypeChange}
                        displayEmpty
                        name="type"
                    >
                        <MenuItem value={'Restaurant'}>Restaurant</MenuItem>
                        <MenuItem value={'Club/Pub/Bar'}>Club/Pub/Bar</MenuItem>
                        <MenuItem value={'Museum'}>Museum</MenuItem>
                        <MenuItem value={'City/Location'}>City/Location</MenuItem>
                        <MenuItem value={'Nature'}>Nature</MenuItem>
                        <MenuItem value={'Entertainment'}>Entertainment</MenuItem>
                        <MenuItem value={'Other'}>Other</MenuItem>
                    </Select>
                    :
                    <p>Type: {this.state.type}</p>}
                <p>Date Posted: {this.props.toDoPostData.creationDate.format('DD-MM-YYYY')}</p>
                <p>Recommended by : {this.props.toDoPostData.ratingsPositive}</p>
                <p>Not recommended by: {this.props.toDoPostData.ratingsNegative}</p>
                {/* <p>Current user liked: {this.state.currentUserLiked.toString()}</p>
                <p>Current user disliked: {this.state.currentUserDisliked.toString()}</p> */}
                <button onClick={this.handleLikeButtonClicked} >Thumbs up!</button>
                <button onClick={this.handleDislikeButtonClicked} >Thumbs down!</button>
                <div>
                {this.checkIfPostBelongsToUser() ? <button onClick={this.handleDeletePost}>Delete</button> : null}
                {this.checkIfPostBelongsToUser() ? 
                    this.state.editMode ?  <button onClick={this.handleSaveChanges}>Save</button> 
                        : <button onClick={this.handleEditPost}>Edit</button> 
                    : 
                    null}
                </div>
                
            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch)=>({
    addRatingToDatabasePost: (postId, review) =>dispatch(addRatingToDatabasePost(postId,review)),
    deleteToDoPostFromDatabase: (postId) =>dispatch(deleteToDoPostFromDatabase(postId)),
    editToDoPostInDatabase: (postData) =>dispatch(editToDoPostInDatabase(postData)),
    deleteRatingFromDatabasePost: (postId,reviewId) =>dispatch(deleteRatingFromDatabasePost(postId,reviewId)),
    updateRatingOfPostInDatabase: (postId,reviewId,newRating) =>dispatch(updateRatingOfPostInDatabase(postId,reviewId,newRating)),
    changeRatingsSumInDatabase : (postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive) =>dispatch(changeRatingsSumInDatabase(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive))
})

export default connect(null,mapDispatchToProps)(ToDoPostModal);