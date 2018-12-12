import React from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {addPostToDatabase} from '../actions/help';
import {firebase} from '../firebase/firebase';
import moment from 'moment';

class AddHelpPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name:'',
            description:'',
            datePosted:moment(),
            dateUpdated:moment(),
            createdBy:'',
            createdById:'',
            comments:[],
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
                this.props.addPostToDatabase(postData);
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
            contentLabel="Add new help post modal">
                <h3>Add new help post</h3>
                <form onSubmit={this.handleOnSubmit}>
                    <div>
                    {this.state.nameEmptyError==undefined ? null: <p>Post name cannot be empty</p>}
                        <TextField 
                            label="Post name"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />
                    </div>
                        
                    <div>
                        {this.state.descriptionEmptyError==undefined ? null: <p>Post description cannot be empty</p>}
                        <TextField 
                            label="Description of the problem"
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
    addPostToDatabase: (postData)=>dispatch(addPostToDatabase(postData))
})

export default connect(null,mapDispatchToProps)(AddHelpPostModal);