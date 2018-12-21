import React from 'react';
import {connect} from 'react-redux';
import AddInfoPostModal from './AddInfoPostModal';

class ToDoPage extends React.Component {
    constructor(props) {
        super(props);
        console.log('ToDoPage constructor ran');
        this.state = { 
            isAddNewModalOpen:false
         }
    }

    openAddPostModal = () =>{
        this.setState(()=>({isAddNewModalOpen:true}));
    }
    closeAddPostModal = () =>{
        this.setState(()=>({isAddNewModalOpen:false}));
    }


    render() { 
        return ( 
            <div>
             <p>This is a ToDo Page component</p>

                 {this.state.isAddNewModalOpen ?<AddInfoPostModal isOpen={this.state.isAddNewModalOpen} onRequestClose={this.closeAddPostModal}/>  : null}
                 <button onClick={this.openAddPostModal}>asd</button>
            </div>
         );
    }
}
 
const mapStateToProps = (state) =>({
    infoPosts:state.infoPosts
});

export default connect(mapStateToProps)(ToDoPage);