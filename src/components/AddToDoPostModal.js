import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {connect} from 'react-redux';
import {firebase} from '../firebase/firebase';
import {addToDoPostToDatabase} from '../actions/toDo';
import classNames from 'classnames';

class AddToDoPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name:'',
            description:'',
            type:'Other',
            createdBy:'',
            createdById:'',
            creationDate:moment(),
            ratingsPositive:0,
            ratingsNegative:0,
            reviews:[],
            nameEmptyError:undefined,
            descriptionEmptyError:undefined
         }
    }

    handleTypeChange = (e) =>{
        this.setState(()=>({type:e.target.value}));
    };
    handleNameChange = (e)=>{
        const name = e.target.value;
        this.setState(()=>({name}));
    }
    handleDescriptionChange = (e)=>{
        const description = e.target.value;
        this.setState(()=>({description}));
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
                this.props.addToDoPostToDatabase(postData);
            })
        };
    }

    render() { 
        return ( 
            <Modal
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel="Add new ToDo Post"
            ariaHideApp={false}
            className={classNames("addPostModal","addPostModal--toDo")}>
                 <form className={classNames("addPostForm","addPostForm--toDo")} onSubmit={this.handleOnSubmit}>
                    <div className={classNames("addPostModal__name","addPostModal__name--toDo")} >
                    {this.state.nameEmptyError==undefined ? null: <p>{this.state.nameEmptyError}</p>}
                        <TextField 
                            label="Name"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            className="addPostModal__name"
                            required
                            multiline
                            rowsMax={3}
                        />
                    </div>
                        
                    <div className={classNames("addPostModal__description","addPostModal__description--toDo")} >
                        {this.state.descriptionEmptyError==undefined ? null: <p>{this.state.descriptionEmptyError}</p>}
                        <TextField 
                            label="Description"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                            multiline
                            rows={20}
                            required
                        />
                    </div>

                    <div className="addPostModal__select__container"> 
                        <span>Type:</span>
                        <Select
                            value={this.state.type}
                            onChange={this.handleTypeChange}
                            displayEmpty
                            name="type"
                            className="addPostModal__select"
                        >
                            <MenuItem value={'Restaurant'}>Restaurant</MenuItem>
                            <MenuItem value={'Club/Pub/Bar'}>Club/Pub/Bar</MenuItem>
                            <MenuItem value={'Museum'}>Museum</MenuItem>
                            <MenuItem value={'City/Location'}>City/Location</MenuItem>
                            <MenuItem value={'Nature'}>Nature</MenuItem>
                            <MenuItem value={'Entertainment'}>Entertainment</MenuItem>
                            <MenuItem value={'Other'}>Other</MenuItem>
                        </Select>
                    </div>
                   
                    <div className="addPostModal__buttonContainer">
                        <button className={classNames("btn","btnAddPost","btnAddPost--toDo")}>Submit</button>
                    </div>
                </form>

            </Modal>
         );
    }
}
 
const mapDispatchToProps=(dispatch)=>({
    addToDoPostToDatabase: (postData) => dispatch(addToDoPostToDatabase(postData))
});

export default connect(null,mapDispatchToProps)(AddToDoPostModal);