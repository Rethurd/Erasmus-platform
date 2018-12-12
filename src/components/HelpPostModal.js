import React from 'react';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from 'react-redux';
import { addCommentToDatabase, deleteCommentFromDatabase } from '../actions/help';
import moment from 'moment';
import {firebase} from '../firebase/firebase';

class HelpPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            helpPostId:this.props.postData.postId,
            content:'',
            date:moment(),
            author:'',
            authorId:''
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
            //after adding author:
            this.props.addCommentToDatabase(this.state.helpPostId,this.state).then(()=>{
                // after adding the comment, rerender the modal with a new comment
                this.props.onRequestClose();
                this.props.rerenderAfterComment(this.state.helpPostId);
            });
        });
    };

   checkIfCommentBelongsToUser = (authorId) =>{
        const user = firebase.auth().currentUser;
        return user.uid==authorId;
   };

    render() { 
        return ( 
            <Modal 
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel="Selected HelpPost">
                <h3>{this.props.postData.name}</h3>
                <p>{this.props.postData.description}</p>
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
                            <IconButton  onClick={()=>{
                            const postId = this.state.helpPostId;
                            this.props.deleteCommentFromDatabase(postId,singleComment.commentId).then(()=>{
                                this.props.onRequestClose();
                                this.props.rerenderAfterComment(this.state.helpPostId);
                            });
                        }}> <DeleteIcon /> </IconButton>
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
    deleteCommentFromDatabase: (helpPostId, commentId)=>dispatch(deleteCommentFromDatabase(helpPostId,commentId))
})

export default connect(undefined,mapDispatchToProps)(HelpPostModal);