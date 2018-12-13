import React from 'react';
import Modal from 'react-modal';
import uuid from 'uuid';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import {addInfoPostToDatabase} from '../actions/info';
import {connect} from 'react-redux';
import {firebase} from '../firebase/firebase';

class AddInfoPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoPostId:uuid(),
            name:'',
            description:'',
            createdBy:'',
            createdById:'',
            creationDate:moment(),
            nameEmptyError:undefined,
            descriptionEmptyError:undefined
          }
    }

    handleOnSubmit = (e) =>{
        e.preventDefault();
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
            let user = firebase.auth().currentUser;
           
            this.setState(()=>({createdBy:user.displayName,createdById:user.uid}),()=>{
                const { descriptionEmptyError,nameEmptyError,...postData}=this.state;
                this.props.onRequestClose();  
                this.props.addInfoPostToDatabase(postData);
            })
        };
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
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Add new Info Post Modal"
                ariaHideApp={false}
            >
                <h3>Add new Information/Announcement post</h3>

                 <form onSubmit={this.handleOnSubmit}>
                    <div>
                    {this.state.nameEmptyError==undefined ? null: <p>{this.state.nameEmptyError}</p>}
                        <TextField 
                            label="Post name"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />
                    </div>
                        
                    <div>
                        {this.state.descriptionEmptyError==undefined ? null: <p>{this.state.descriptionEmptyError}</p>}
                        <TextField 
                            label="Description of the post"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                            multiline
                            rows={4}
                        />
                    </div>
                    <button>Add post!</button>
                </form>

            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch) =>({
    addInfoPostToDatabase: (postData)=>dispatch(addInfoPostToDatabase(postData))
})

export default connect(null,mapDispatchToProps)(AddInfoPostModal);