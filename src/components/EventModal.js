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
            <h3>{props.eventData.description}</h3>
            <div>This event will happen on: {moment(props.eventData.date).format('DD-MM-YYYY')}</div>
        </Modal>
     );
}
 
export default EventModal;