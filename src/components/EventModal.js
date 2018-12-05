import Modal from 'react-modal';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {addParticipant} from '../actions/events'; 
import {firebase} from '../firebase/firebase';
import isParticipating from '../selectors/isParticipating';

class EventModal extends React.Component{

    constructor(props){
        super(props);
    }


     isUserParticipating = () =>{
        const user = firebase.auth().currentUser;
        return isParticipating(this.props.eventData.participantsID,user.uid) ?  false : user;
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
                <p>User uid:{this.props.eventData.createdById}</p>
                <p>Participants: {this.props.eventData.participants.map((participant)=>{return(<span key={participant}>{participant}</span>)})}</p>
                <button onClick={()=>{
                    // here we should check whether the user is already one of the participants and dispatch 'remove participant' if clicked
                    //how to do it:
                    //define a selector, pass the event uuid to it (which we have) and the user id (which we also have) and check if he already is in there or no
                    
                const user = this.isUserParticipating();
                console.log(user);
                // if already participating
                if(!user){
                    console.log('remove participant');                    
                }else{
                    this.props.onRequestClose();
                    console.log('add participant');
                    console.log(user.uid);
                    console.log(user.displayName);
                    this.props.addParticipant(this.props.eventData.eventId,user.uid,user.displayName);
                }

                    //call dispatch with props.eventData.eventId and user id and user name
                }}>Join the event!</button>
            </Modal>
             );
        }
}
 
const mapDispatchToProps = (dispatch) =>{
    return{
        addParticipant: (eventId,participantId,participantName) => dispatch(addParticipant(eventId,participantId,participantName))
    }
}
export default connect(null,mapDispatchToProps)(EventModal);