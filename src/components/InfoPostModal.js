import React from 'react';
import Modal from 'react-modal';
class InfoPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <Modal
                isOpen ={this.props.isOpen}
                contentLabel="Selected Info Post"
                ariaHideApp={false}
                onRequestClose={this.props.onRequestClose}
                >
                <p>This is my InfoPost Modal</p>
                <h3>{this.props.postData.name}</h3>
                <p>{this.props.postData.description}</p>

            </Modal>
         );
    }
}
 


export default InfoPostModal;