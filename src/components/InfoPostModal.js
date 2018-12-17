import React from 'react';
import Modal from 'react-modal';
import {firebase} from '../firebase/firebase';
import {connect} from 'react-redux';
import {deleteInfoPostFromDatabase,editInfoPostInDatabase} from '../actions/info';
import TextField from '@material-ui/core/TextField';

class InfoPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ...props.postData,
            editMode:false,
            descriptionEmptyError:undefined,
            nameEmptyError:undefined
         }  
    }

    handleEditPost = () =>{
        this.setState(()=>({editMode:true}));
    }
    handleSaveChanges = () =>{
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
            const {editMode,descriptionEmptyError,nameEmptyError,...postData} = this.state;
            this.props.editInfoPostInDatabase(postData).then(()=>{
                this.props.onRequestClose();
                this.props.rerenderAfterChange(this.state.infoPostId);
            });
        }
    }

    handleDeletePost = () =>{
        this.props.deleteInfoPostFromDatabase(this.props.postData.infoPostId)
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
    render() { 
        return ( 
            <Modal
                isOpen ={this.props.isOpen}
                contentLabel="Selected Info Post"
                ariaHideApp={false}
                onRequestClose={this.props.onRequestClose}
                >
                <p>This is my InfoPost Modal</p>
                {this.state.editMode ? <h3>
                    {this.state.nameEmptyError==undefined ? null: <p>{this.state.nameEmptyError}</p>}
                    <TextField value={this.state.name} onChange={this.handleNameChange}/>
                    </h3> 
                :
                 <h3>{this.props.postData.name}</h3> }
                {this.state.editMode ?
                    <div>
                        {this.state.descriptionEmptyError==undefined ? null: <p>{this.state.descriptionEmptyError}</p>}
                        <TextField value={this.state.description} onChange={this.handleDescriptionChange} multiline rows={5}/> 
                    </div>
                  :
                   <p>{this.props.postData.description}</p> }
                {this.props.isUserAdmin ? <button onClick={this.handleDeletePost}>Delete</button> : null}
                {this.props.isUserAdmin ? 
                    this.state.editMode ?  <button onClick={this.handleSaveChanges}>Save</button> 
                        : <button onClick={this.handleEditPost}>Edit</button> 
                    : 
                    null}
            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch) =>({
    deleteInfoPostFromDatabase: (infoPostId) =>dispatch(deleteInfoPostFromDatabase(infoPostId)),
    editInfoPostInDatabase: (postData)=>dispatch(editInfoPostInDatabase(postData))
})

export default connect(null,mapDispatchToProps)(InfoPostModal);