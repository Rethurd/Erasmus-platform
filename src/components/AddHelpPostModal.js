import React from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {addPostToDatabase} from '../actions/help';
import {firebase} from '../firebase/firebase';
import moment from 'moment';
import classNames from 'classnames';
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
            contentLabel="Add new help post modal"
            ariaHideApp={false}
            className={classNames("addPostModal","addPostModal--help")}>
                <form className={classNames("addPostForm","addPostForm--help")} onSubmit={this.handleOnSubmit}>
                    <div className={classNames("addPostModal__name","addPostModal__name--help")}>
                    {this.state.nameEmptyError==undefined ? null: <p>{this.state.nameEmptyError}</p>}
                        <TextField 
                            label="Post name"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            required
                            multiline
                            rowsMax={3}
                        />
                    </div>
                        
                    <div className={classNames("addPostModal__description","addPostModal__description--help")}>
                        {this.state.descriptionEmptyError==undefined ? null: <p>{this.state.descriptionEmptyError}</p>}
                        <TextField 
                            label="Description of the problem"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                            multiline
                            required
                            rows={20}
                        />
                    </div>
                    <div className={classNames("addPostModal__buttonContainer","addPostModal__buttonContainer--help")}>
                         <button className={classNames("btn","btnAddPost","btnAddPost--help")}>Add post!</button>
                    </div>

                </form>
                
            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch) =>({
    addPostToDatabase: (postData)=>dispatch(addPostToDatabase(postData))
})

export default connect(null,mapDispatchToProps)(AddHelpPostModal);