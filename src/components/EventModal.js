import Modal from 'react-modal';
import React from 'react';
import {connect} from 'react-redux';
import {addParticipantToDatabase, removeParticipantFromDatabase, deleteEventFromDatabase, editEventInDatabase} from '../actions/events'; 
import {firebase} from '../firebase/firebase';
import isParticipating from '../selectors/isParticipating';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {MuiPickersUtilsProvider } from 'material-ui-pickers';
import {DateTimePicker} from 'material-ui-pickers';
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
    render(){
        return (
            <Modal 
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Selected Event"
                
            >

                <h1>{this.state.editMode ? <input type="text" value={this.state.name} onChange={this.handleEventNameChange}></input> : this.state.name}</h1>
                <h3>Description: {this.state.editMode ? <textarea value={this.state.description} onChange={this.handleEventDescriptionChange} /> : this.state.description} </h3>
                <p>Event Id: {this.state.eventId}</p>
                Even starts: {this.state.editMode ?
                 <MuiPickersUtilsProvider  utils={MomentUtils}>
                  <DateTimePicker  value={this.state.date} onChange={this.handleDateChange} />
                 </MuiPickersUtilsProvider> 
                :
                 this.state.date.format('DD-MM-YYYY HH:mm')}
                
                
                <p>Location:  {this.state.editMode ? <input type="text" value={this.state.location} onChange={this.handleEventLocationChange}></input>: this.state.location} </p>
                <p>Event created by:{ this.state.createdBy!=null ? this.state.createdBy : 'Unknown'}</p>
                <p>Creator uid:{this.state.createdById}</p>
                <p>Participants: {this.state.participants.map((participant)=>{return(<span key={participant.participantId}>{participant.participantData.name}</span>)})}</p>
                <button onClick={()=>{
                    // e.stopPropagation();
                const user = this.isUserParticipating();
                this.props.onRequestClose();
                // if already participating
                if(!user){
                    const existingUserUid = firebase.auth().currentUser.uid;
                    this.props.removeParticipantFromDatabase(this.state.eventId,existingUserUid);                   
                }else{
                    const userData = {
                        name:user.displayName,
                        email: user.email
                    }
                    this.props.addParticipantToDatabase(this.state.eventId,user.uid,userData);
                }
                    //call dispatch with state.eventId and user id and user name
                }}>{!!this.isUserParticipating() ? 'Join the event!' : 'Leave the event!'}</button>
                {this.isUserTheCreator() ? <button onClick={()=>{
                    //delete the event
                    this.props.onRequestClose();
                    this.props.deleteEventFromDatabase(this.state.eventId);

                }}>Delete the event</button> : null }
                {this.isUserTheCreator() ? <button onClick={()=>{
                    //delete the event
                    if(this.state.editMode){
                        this.props.onRequestClose();
                        const {editMode,descriptionEmptyError,nameEmptyError,...eventData} = this.state;
                        this.props.editEventInDatabase(eventData);
                    }
                    else{
                        this.setState({
                        editMode:true
                        });
                    }
                    

                }}>{this.state.editMode ? 'Save' : 'Edit'}</button> : null }
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