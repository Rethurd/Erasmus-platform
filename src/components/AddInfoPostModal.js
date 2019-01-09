import React from 'react';
import Modal from 'react-modal';
import uuid from 'uuid';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import {addInfoPostToDatabase} from '../actions/info';
import {connect} from 'react-redux';
import {firebase} from '../firebase/firebase';
import classNames from 'classnames';

class AddInfoPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                className={classNames("modal modal--info modal--addInfo")}
            >

                 <form className="addInfoPost__form" onSubmit={this.handleOnSubmit}>
                    <div className="infoPost__name__container" >
                   
                        <TextField 
                            label="Post name"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            className="infoModal__name--new"
                            multiline
                            rowsMax={3}
                            required
                            placeholder="..."
                            autoFocus
                        />
                    </div>
                        
                    <div className="infoPost__description__container"  >
                      
                        <TextField 
                            label="Description of the post"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                            multiline
                            rows={25}
                            className={classNames("infoModalDescription__scrollBar infoModal__description--new")}
                            required
                        />
                    </div>
                    {/* <div className="infoModal__errors--new">
                        {this.state.nameEmptyError==undefined ? null: <p className="infoModal__name__error">{this.state.nameEmptyError}</p>}
                        {this.state.descriptionEmptyError==undefined ? null: <p className="infoModal__description__error">{this.state.descriptionEmptyError}</p>}
                    </div> */}
                    <div style={{paddingBottom:'10px'}} className={classNames("text-center")}><button className={classNames("btn", "btn-success","addInfoPost__btn")}>Add post!</button></div>
                </form>

            </Modal>
         );
    }
}
 
const mapDispatchToProps = (dispatch) =>({
    addInfoPostToDatabase: (postData)=>dispatch(addInfoPostToDatabase(postData))
})

export default connect(null,mapDispatchToProps)(AddInfoPostModal);