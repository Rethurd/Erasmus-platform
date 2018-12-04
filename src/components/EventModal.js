import Modal from 'react-modal';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {addParticipant} from '../actions/events'; 
import {firebase} from '../firebase/firebase';

const EventModal = (props) => {
    return (
        <Modal 
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            contentLabel="Selected Event"
        >

            <h1>{props.eventData.name}</h1>
            <h3>Description: {props.eventData.description}</h3>
            <p>Even starts:{props.eventData.date.format('DD-MM-YYYY HH:mm')}</p>
            <p>Location:{props.eventData.location}</p>
            <p>Event created by:{ props.eventData.createdBy!=null ? props.eventData.createdBy : 'Unknown'}</p>
            <p>User uid:{props.eventData.createdById}</p>
            <p>Participants: {props.eventData.participants.map((participant)=>{return(<span>{participant}</span>)})}</p>
            <button onClick={()=>{
                // here we should check whether the user is already one of the participants and dispatch 'remove participant' if clicked
                //how to do it:
                //define a selector, pass the event uuid to it (which we have) and the user id (which we also have) and check if he already is in there or no
                const user = firebase.auth().currentUser;
                props.onRequestClose();
                props.addParticipant(props.eventData.eventId,user.uid,user.displayName);

                //call dispatch with props.eventData.eventId and user id and user name
            }}>Join the event!</button>
        </Modal>
     );
}
 
const mapDispatchToProps = (dispatch) =>{
    return{
        addParticipant: (eventId,participantId,participantName) => dispatch(addParticipant(eventId,participantId,participantName))
    }
}
export default connect(null,mapDispatchToProps)(EventModal);