import React from 'react';
import Modal from 'react-modal';
import {firebase} from '../firebase/firebase';
import {connect} from 'react-redux';
import {deleteInfoPostFromDatabase} from '../actions/info';

class InfoPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }


    handleDeletePost = () =>{
        this.props.deleteInfoPostFromDatabase(this.props.postData.infoPostId)
        this.props.onRequestClose();
    }

    render() { 
        return ( 
            <Modal
                isOpen ={this.props.isOpen}
                contentLabel="Selected Info Post"
                ariaHideApp={false}
                onRequestClose={this.props.onRequestClose}
                >
                <p>This is my InfoPost Modal</p>
                <h3>{this.props.postData.name}</h3>
                <p>{this.props.postData.description}</p>
                <button onClick={this.handleDeletePost}>Delete</button>
            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch) =>({
    deleteInfoPostFromDatabase: (infoPostId) =>dispatch(deleteInfoPostFromDatabase(infoPostId)),
    // editInfoPostInDatabase: (postData)=>dispatch(editInfoPostInDatabase(postData))
})

export default connect(null,mapDispatchToProps)(InfoPostModal);