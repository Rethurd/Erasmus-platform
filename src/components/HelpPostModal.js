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
            editMode:false
         }
    }

    handleCommentChange = (e) =>{
        const content = e.target.value;
        this.setState(()=>({content}));
    }

    handleAddComment = () =>{
        const user = firebase.auth().currentUser;
        this.setState(()=>({
            author:user.displayName,
            authorId:user.uid
        }),()=>{
            const {name,description,editMode,...commentData} = this.state;
            //after adding author:
            this.props.addCommentToDatabase(this.state.helpPostId,commentData).then(()=>{
                // after adding the comment, rerender the modal with a new comment
                this.props.onRequestClose();
                this.props.rerenderAfterComment(this.state.helpPostId);
            });
        });
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
        return user.uid==this.state.helpPostId;
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
        const {helpPostId,content,date,author,authorId,editMode,...postData} = this.state;
        this.props.editPostInDatabase(postData).then(()=>{
            this.props.onRequestClose();
            this.props.rerenderAfterComment(this.state.helpPostId);
        });
    }
    render() { 
        return ( 
            <Modal 
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel="Selected HelpPost">
                {this.state.editMode ? <h3><TextField value={this.state.name} onChange={this.handleNameChange}/></h3> 
                :
                 <h3>{this.props.postData.name}</h3> }
                 {this.state.editMode ?
                   <TextField value={this.state.description} onChange={this.handleDescriptionChange} multiline rows={5}/> 
                  :
                   <p>{this.props.postData.description}</p> }
                <div>
                {this.checkIfPostBelongsToUser ? <button onClick={this.handleDeletePost}>Delete</button> : null}
                {this.checkIfPostBelongsToUser ? 
                    this.state.editMode ?  <button onClick={this.handleSaveChanges}>Save</button> 
                        : <button onClick={this.handleEditPost}>Edit</button> 
                    : 
                    null}
                </div>
                
                

                <div>
                <TextField 
                            placeholder="Comment..."
                            value={this.state.comment}
                            onChange={this.handleCommentChange}
                            multiline
                            rows={3}
                />
                <Button variant="outlined" onClick={this.handleAddComment}>
                    Send
                </Button>
                </div>
                {this.props.postData.comments.map((singleComment)=>{
                    
                    return(
                        <div key={singleComment.date+singleComment.content}>
                        <span >
                        {moment(singleComment.date*1000).format('DD-MM-YYYY HH:mm:ss')+' - ' +singleComment.author+': '+singleComment.content}
                        </span>
                        {this.checkIfCommentBelongsToUser(singleComment.authorId) ? 
                            <IconButton  onClick={()=>this.handleDeleteComment(singleComment.commentId)}> <DeleteIcon /> </IconButton>
                        : 
                        null}
                        
                        </div>
                    )
                }).reverse()}
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