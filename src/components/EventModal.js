import Modal from 'react-modal';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {addParticipant, removeParticipant} from '../actions/events'; 
import {firebase} from '../firebase/firebase';
import isParticipating from '../selectors/isParticipating';

class EventModal extends React.Component{

    constructor(props){
        super(props);
    }


     isUserParticipating = () =>{
        const user = firebase.auth().currentUser;
        return isParticipating(this.props.eventData.participants,user.uid) ?  false : user;
    }	
    render(){
        return (
            <Modal 
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onRequestClose}
                contentLabel="Selected Event"
                
            >

                <h1>{this.props.eventData.name}</h1>
                <h3>Description: {this.props.eventData.description}</h3>
                <p>Even starts:{this.props.eventData.date.format('DD-MM-YYYY HH:mm')}</p>
                <p>Location:{this.props.eventData.location}</p>
                <p>Event created by:{ this.props.eventData.createdBy!=null ? this.props.eventData.createdBy : 'Unknown'}</p>
                <p>Creator uid:{this.props.eventData.createdById}</p>
                <p>Participants: {this.props.eventData.participants.map((participant)=>{return(<span key={participant.participantId}>{participant.participantData.name}</span>)})}</p>
                <button onClick={()=>{
                    // e.stopPropagation();
                const user = this.isUserParticipating();
                this.props.onRequestClose();
                // if already participating
                if(!user){
                    const existingUserUid = firebase.auth().currentUser.uid;
                    this.props.removeParticipant(this.props.eventData.eventId,existingUserUid);                   
                }else{
                    
                    console.log('add participant');
                    const userData = {
                        name:user.displayName,
                        email: user.email
                    }
                    this.props.addParticipant(this.props.eventData.eventId,user.uid,userData);
                }

                    //call dispatch with props.eventData.eventId and user id and user name
                }}>{!!this.isUserParticipating() ? 'Join the event!' : 'Leave the event!'}</button>
            </Modal>
             );
        }
}
 
const mapDispatchToProps = (dispatch) =>{
    return{
        addParticipant: (eventId,participantId,participantData) => dispatch(addParticipant(eventId,participantId,participantData)),
        removeParticipant: (eventId,participantId)=> dispatch(removeParticipant(eventId,participantId))
    }
}
export default connect(null,mapDispatchToProps)(EventModal);