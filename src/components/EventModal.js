import Modal from 'react-modal';
import React from 'react';
import moment from 'moment';
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
        </Modal>
     );
}
 
export default EventModal;