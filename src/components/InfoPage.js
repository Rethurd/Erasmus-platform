import React from 'react';
import {connect} from 'react-redux';
import InfoPost from './InfoPost';
import {isEmpty} from '../resources/functions';
import InfoPostModal from './InfoPostModal';
import AddInfoPostModal from './AddInfoPostModal';
import database, {firebase} from '../firebase/firebase';
import getInfoPostById from '../selectors/getInfoPostById';

class InfoPage extends React.Component {
    constructor(props){
        super(props);
        const user = firebase.auth().currentUser;
        let isUserAdmin=false;
        this.state={
            isModalOpen:false,
            selectedInfoPost:{},
            isAddPostModalOpen:false,
            userId:user.uid,
            isUserAdmin
        }
        database.ref('adminList').once('value').then((allAdmins)=>{
            return allAdmins.forEach((singleAdmin)=>{
                if(singleAdmin.val().adminID==user.uid){
                    this.setState(()=>({isUserAdmin:true}));
                }
            });
        });
        
    }
    handleOpenModal = (selectedInfoPost) =>{
        this.setState(()=>({isModalOpen:true,selectedInfoPost}));
    }

    handleCloseModal = () =>{
        this.setState(()=>({isModalOpen:false,selectedInfoPost:{}}));
    }

    handleOpenNewPostModal = () =>{
        this.setState(()=>({isAddPostModalOpen:true}));
    }
    handleCloseNewPostModal = () =>{
        this.setState(()=>({isAddPostModalOpen:false}));
    }

    rerenderAfterChange = (infoPostId)=>{
        const selectedInfoPost = getInfoPostById(this.props.infoPosts,infoPostId);
        this.setState(()=>({
            isModalOpen:true,
            selectedInfoPost,
        }));
    }

    render() { 
        return ( 
            <div>
                This is the info page component!
                <div>
                    {this.props.infoPosts.map((singlePostData)=>{
                        return <InfoPost handleOpenModal={this.handleOpenModal} key={singlePostData.infoPostId} postData={singlePostData}/>
                    })}
                </div>
                {isEmpty(this.state.selectedInfoPost) ? null: <InfoPostModal rerenderAfterChange={this.rerenderAfterChange} isUserAdmin={this.state.isUserAdmin} isOpen={this.state.isModalOpen} postData={this.state.selectedInfoPost} onRequestClose={this.handleCloseModal}/>}
                    {/* Show the button only to admins */}
                {this.state.isUserAdmin ? <button onClick={this.handleOpenNewPostModal}>Create new</button> : null }
                {this.state.isAddPostModalOpen ? <AddInfoPostModal  isOpen={this.state.isAddPostModalOpen} onRequestClose={this.handleCloseNewPostModal}/>: null}
            
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    infoPosts:state.infoPosts
});
export default connect(mapStateToProps)(InfoPage);