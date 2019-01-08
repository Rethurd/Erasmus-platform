import React from 'react';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from 'react-redux';
import { addCommentToDatabase, deleteCommentFromDatabase,deletePostFromDatabase,editPostInDatabase } from '../actions/help';
import moment from 'moment';
import {firebase} from '../firebase/firebase';
import classNames from 'classnames'; 

class HelpPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ...this.props.postData,
            helpPostId:this.props.postData.postId,
            content:'',
            date:moment(),
            author:'',
            authorId:'',
            editMode:false,
            errorEmptyComment:undefined,
            errorEmptyName:undefined,
            errorEmptyDescription:undefined
         }
    }

    handleCommentChange = (e) =>{
        const content = e.target.value;
        this.setState(()=>({content}));
    }

    handleAddComment = () =>{
        console.log(this.state.content);

        if(this.state.content==''){
            this.setState(()=>({errorEmptyComment:'The comment field cannot be empty'}));
        }
        else{
            const user = firebase.auth().currentUser;
            this.setState(()=>({
                author:user.displayName,
                authorId:user.uid
            }),()=>{
                const commentData = {
                    author:this.state.author,
                    authorId:this.state.authorId,
                    content:this.state.content,
                    date:this.state.date,
                    helpPostId:this.state.helpPostId,
                }
                //after adding author:
                this.props.addCommentToDatabase(this.state.helpPostId,commentData).then(()=>{
                    // after adding the comment, rerender the modal with a new comment
                    this.props.onRequestClose();
                    this.props.rerenderAfterComment(this.state.helpPostId);
                });
            });
        }
       
    };

    handleDeleteComment = (commentId)=>{
        const postId = this.state.helpPostId;
        this.props.deleteCommentFromDatabase(postId,commentId).then(()=>{
            this.props.onRequestClose();
            this.props.rerenderAfterComment(this.state.helpPostId);
        });
    }

    handleDeletePost = ()=>{
        this.props.onRequestClose();
        this.props.deletePostFromDatabase(this.state.helpPostId);

    }
    handleEditPost = ()=>{
        this.setState(()=>({editMode:true}));
    }

   checkIfCommentBelongsToUser = (authorId) =>{
        const user = firebase.auth().currentUser;
        return user.uid==authorId;
   };
   checkIfPostBelongsToUser = () =>{
       
        const user = firebase.auth().currentUser;   
        return user.uid==this.state.createdById;
    }

    handleNameChange = (e)=>{
        const name = e.target.value;
        this.setState(()=>({name}));
    }
    handleDescriptionChange = (e)=>{
        const description = e.target.value;
        this.setState(()=>({description}));
    }
    handleSaveChanges = ()=>{
        if(this.state.name==''){
            this.setState(()=>({errorEmptyName:'The post name cannot be empty!'}));
        }else{
            this.setState(()=>({errorEmptyName:undefined}));
        }
        if(this.state.description==''){
            this.setState(()=>({errorEmptyDescription:'The post description cannot be empty!'}));
        }else{
            this.setState(()=>({errorEmptyDescription:undefined}));
        }
        if (this.state.name!='' && this.state.description!=''){
            const {helpPostId,content,date,author,authorId,editMode,errorEmptyComment,errorEmptyDescription,errorEmptyName,...postData} = this.state;
            this.props.editPostInDatabase(postData).then(()=>{
                this.props.onRequestClose();
                this.props.rerenderAfterComment(this.state.helpPostId);
            });
        }
        
    }
    render() { 
        return ( 
            <Modal 
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel="Selected HelpPost"
            ariaHideApp={false}
            className="helpModal"
            >
                {this.state.editMode ? 
                <h3 className="helpPostModal__name">
                    {/* {this.state.nameEmptyError==undefined ? null: <p>{this.state.nameEmptyError}</p>} */}
                    <TextField required value={this.state.name} onChange={this.handleNameChange} multiline rowsMax={2} className="helpPostModal__name--edit"/>
                </h3> 
                :
                 
                 this.props.postData.name.length>=40 ? 
                 <h3 className="helpPostModal__name" >{this.props.postData.name.substring(0,40)}...</h3> 
                 :
                 <h3 className="helpPostModal__name" > {this.props.postData.name}</h3>
                }
                 {this.state.editMode ?
                    <div className="helpPostModal__description--container">
                        {/* {this.state.descriptionEmptyError==undefined ? null: <p className="helpPostModal__description">{this.state.descriptionEmptyError}</p>} */}
                        <TextField required value={this.state.description} onChange={this.handleDescriptionChange} multiline rows={20} className="helpPostModal__description--edit"/> 
                    </div>
                  :
                   <div className="helpPostModal__description--container" ><p className="helpPostModal__description" >{this.props.postData.description}</p></div> }
                <div className="helpPostModal__buttons">
                {(this.checkIfPostBelongsToUser() || this.props.isUserAdmin) ? <button onClick={this.handleDeletePost} className={classNames("btn btn-danger")}  >Delete</button> : null}
                {(this.checkIfPostBelongsToUser() || this.props.isUserAdmin) ? 
                    this.state.editMode ?  <button  className={classNames("btn","btn-success")} onClick={this.handleSaveChanges}>Save</button> 
                        : <button className={classNames("btn btn-primary")} onClick={this.handleEditPost}>Edit</button> 
                    : 
                    null}
                </div>
                
                

                <div className="helpPostModal__addComment">
                {this.state.errorEmptyComment==undefined ? null : <p className="commentEmptyError">{this.state.errorEmptyComment}</p> }
                    <div className="helpPostModal__commentField__container">
                        <TextField 
                                    placeholder="Comment..."
                                    value={this.state.comment}
                                    onChange={this.handleCommentChange}
                                    multiline
                                    rows={3}
                                    className="helpPostModal__commentField"
                        />
                    </div>

                    <div className="helpPostModal__sendCommentButton__container">
                        <Button className="helpPostModal__sendCommentButton" variant="outlined" onClick={this.handleAddComment}>
                            Send
                        </Button>
                    </div>
                    
                </div>
                <div className="helpPostModal__commentSection">
                {this.props.postData.comments.map((singleComment)=>{
                    return(
                        (this.checkIfCommentBelongsToUser(singleComment.authorId) || this.props.isUserAdmin) ? 
                        <div key={singleComment.commentId} className="helpPostModal__singleComment">
                            <div className="comment__header">
                                <div className="comment__date">
                                {moment(singleComment.date*1000).format('DD-MM-YYYY HH:mm:ss')}
                                </div>
                                <div className="comment__author"> {singleComment.author}</div>
                            </div>
                            <div className="comment__deleteButton">
                                    <IconButton  onClick={()=>this.handleDeleteComment(singleComment.commentId)}> <DeleteIcon /> </IconButton>
                            </div>
                            <div className="comment__content">{singleComment.content}</div>

                            
                        
                        </div> 
                        :
                        <div key={singleComment.commentId} className="helpPostModal__singleComment--noOwnership">
                            <div className="comment__header">
                                <div className="comment__date">
                                {moment(singleComment.date*1000).format('DD-MM-YYYY HH:mm:ss')}
                                </div>
                                <div className="comment__author"> {singleComment.author}</div>
                            </div>
                            <div className="comment__content">{singleComment.content}</div>

                            
                        
                        </div>
                    )
                }).reverse()}
                </div>
            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch) =>({
    addCommentToDatabase: (helpPostId, comment)=>dispatch(addCommentToDatabase(helpPostId, comment)),
    deleteCommentFromDatabase: (helpPostId, commentId)=>dispatch(deleteCommentFromDatabase(helpPostId,commentId)),
    deletePostFromDatabase: (helpPostId) =>dispatch(deletePostFromDatabase(helpPostId)),
    editPostInDatabase: (postData)=>dispatch(editPostInDatabase(postData))
})

export default connect(undefined,mapDispatchToProps)(HelpPostModal);