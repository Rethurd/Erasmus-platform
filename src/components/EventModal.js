import React from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {addParticipantToDatabase, removeParticipantFromDatabase, deleteEventFromDatabase, editEventInDatabase} from '../actions/events'; 
import {firebase} from '../firebase/firebase';
import isParticipating from '../selectors/isParticipating';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {MuiPickersUtilsProvider } from 'material-ui-pickers';
import {DateTimePicker} from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';


class EventModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            ...this.props.eventData,
            'editMode':false,
            'descriptionEmptyError':undefined,
            'nameEmptyError':undefined,
            
        }
    }   

     isUserParticipating = () =>{
        const user = firebase.auth().currentUser;
        return isParticipating(this.props.eventData.participants,user.uid) ?  false : user;
    }	
    isUserTheCreator = () =>{
        const user = firebase.auth().currentUser;
        return user.uid==this.props.eventData.createdById;
    }

    handleEventNameChange = (e) =>{
        const name = e.target.value
        this.setState(()=>({name}));
    }
    handleEventLocationChange = (e)=>{
        
        const location = e.target.value
        this.setState(()=>({location}));
    }
    handleEventDescriptionChange = (e)=>{
        const description = e.target.value
        this.setState(()=>({description}));
    }
    handleDateChange = (date)=>{
        // const date = e.format('MM-DD-YYYY HH:mm');
        this.setState(()=>({date}));
    }

    handleEditEvent = () =>{
        if(this.state.editMode){
            if(this.state.name==''){
            this.setState(()=>({nameEmptyError:'The event name cannot be empty!'}));
            }else{
                this.setState(()=>({nameEmptyError:undefined}));
            }
            if(this.state.description==''){
                this.setState(()=>({descriptionEmptyError:'The event description cannot be empty!'}));
            }else{
                this.setState(()=>({descriptionEmptyError:undefined}));
            }
            if (this.state.name!='' && this.state.description!=''){
            this.props.onRequestClose();
            const {editMode,descriptionEmptyError,nameEmptyError,...eventData} = this.state;
            this.props.editEventInDatabase(eventData).then(()=>{
                   this.props.onRequestClose();
                   this.props.rerenderAfterChange(this.state.eventId);
              });
            }
        }
        else{
            this.setState(()=>({editMode:true}));
        }
    };
    handleDeleteEvent = ()=>{
        //delete the event
        this.props.onRequestClose();
        this.props.deleteEventFromDatabase(this.state.eventId);
    };
    
    render(){
        return (
            <Modal 
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Selected Event"
                ariaHideApp={false}
                className="eventModal"
            >
                {/* <div>{this.state.nameEmptyError}</div> */}
                {this.state.editMode ? 
                <div className="eventModal__name">
                    <TextField required className="eventModal__name--edit" multiline rowsMax={3} value={this.state.name} onChange={this.handleEventNameChange}></TextField> 
                </div>
                :
                    this.state.name.length>40 ? 
                    <div className="eventModal__name">{this.state.name.substring(0,40)}...</div>
                    :
                    <div className="eventModal__name">{this.state.name}</div>}
                <div className="eventModal__date__container">
                    <span>Even starts:</span> 
                    {this.state.editMode ?
                        <MuiPickersUtilsProvider  utils={MomentUtils}>
                        <DateTimePicker  value={this.state.date} onChange={this.handleDateChange} className="eventModal__date--edit" />
                        </MuiPickersUtilsProvider> 
                    :
                        <div className="eventModal__date">{this.state.date.format('DD-MM-YYYY HH:mm')}</div>}

                </div>

                <div className="eventModal__location__container">
                    <span>Location:</span>  
                    {this.state.editMode ? 
                        <TextField className="eventModal__location--edit" value={this.state.location} onChange={this.handleEventLocationChange}></TextField>
                        :
                        <div className="eventModal__location"> {this.state.location} </div>} 
                </div>

                {/* <div>{this.state.descriptionEmptyError}</div> */}
                <div>
                    {this.state.editMode ? <TextField required multiline rows={20} value={this.state.description} 
                    onChange={this.handleEventDescriptionChange} className="eventModal__description--edit" /> : <div className="eventModal__description">{this.state.description}</div>}
                </div>
                
               
                
                
                
                
                <div className="eventModal__participants__container">
                    <div className="eventModal__participants__header">Participants: </div>
                    <div className="eventModal__participants__grid">
                    {this.state.participants.map((participant)=>
                    {return(
                        <span key={participant.participantId}>
                            {participant.participantData.name}
                        </span>)
                    })}
                    </div>
                </div>

                <div className="eventModal__participationButton__container">
                    <button  ref={participateBtn => { this.participateBtn = participateBtn; }}  className={classNames("btn","btn--participate")} onClick={()=>{
                        // e.stopPropagation();
                        this.participateBtn.setAttribute("disabled","disabled");
                    const user = this.isUserParticipating();
                    // if already participating
                    if(!user){
                        const existingUserUid = firebase.auth().currentUser.uid;
                        this.props.removeParticipantFromDatabase(this.state.eventId,existingUserUid).then(()=>{
                            this.props.onRequestClose();
                            this.props.rerenderAfterChange(this.state.eventId);
                        });                   
                    }else{
                        const userData = {
                            name:user.displayName,
                            email: user.email
                        }
                        this.props.addParticipantToDatabase(this.state.eventId,user.uid,userData).then(()=>{
                            this.props.onRequestClose();
                            this.props.rerenderAfterChange(this.state.eventId);
                        });
                    }
                        
                    }}>{!!this.isUserParticipating() ? 'Join the event!' : 'Leave the event!'}</button>
                </div>
                <div className="eventModal__buttons">
                    {(this.isUserTheCreator() || this.props.isUserAdmin) ? <button  className={classNames("btn","btn-danger")} onClick={this.handleDeleteEvent}>Delete the event</button> : null }
                    {(this.isUserTheCreator() || this.props.isUserAdmin)  ? 
                        this.state.editMode ? 
                            <button  className={classNames("btn","btn-success")} onClick={this.handleEditEvent}>Save</button>
                            :
                            <button  className={classNames("btn","btn-primary")} onClick={this.handleEditEvent}>Edit</button>
                         : 
                         null }
                </div>
            </Modal>
             );
        }
}
 
const mapDispatchToProps = (dispatch) =>{
    return{
        addParticipantToDatabase: (eventId,participantId,participantData) => dispatch(addParticipantToDatabase(eventId,participantId,participantData)),
        removeParticipantFromDatabase: (eventId,participantId)=> dispatch(removeParticipantFromDatabase(eventId,participantId)),
        deleteEventFromDatabase: (eventId) => dispatch(deleteEventFromDatabase(eventId)),
        editEventInDatabase: (eventData) => dispatch(editEventInDatabase(eventData))
    }
}
export default connect(null,mapDispatchToProps)(EventModal);