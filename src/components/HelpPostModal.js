import React from 'react';
import Modal from 'react-modal';

class HelpPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <Modal 
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel="Selected HelpPost">
                <h3>{this.props.postData.name}</h3>
                <p>{this.props.postData.description}</p>
            </Modal>
         );
    }
}
 
export default HelpPostModal;