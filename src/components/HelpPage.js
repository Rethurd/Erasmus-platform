import React from 'react';
import {connect} from 'react-redux';
import HelpPost from './HelpPost';
import HelpPostModal from './HelpPostModal';
import AddHelpPostModal from './AddHelpPostModal';
import getHelpPostById from '../selectors/getHelpPostById';

class HelpPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            dummyRerenderValue:true,
            selectedPost:undefined,
            isPostModalOpen:false,
            isAddPostModalOpen:false
        }
    }

    handleSelectPost = (selectedPost) =>{
        this.setState(()=>({selectedPost, isPostModalOpen:true}));
    };
    handleClosePostModal = ()=>{
        this.setState(()=>({
            selectedPost:undefined,
            isPostModalOpen:false
        }));
    };
    handleOpenAddPostModal = () =>{
        this.setState(()=>({
            isAddPostModalOpen:true
        }));
    };
    handleCloseAddPostModal = () =>{
        this.setState(()=>({
            isAddPostModalOpen:false
        }));
    };
    handleCommentAddedRerenderModal = (postId)=>{
        const selectedPost = getHelpPostById(this.props.helpPosts,postId);
        console.log(selectedPost);
        this.setState(()=>({
            isPostModalOpen:true,
            selectedPost,
        }));
    }
    

    render() { 
        return ( 
            <div>
                <p>This is the help page component!</p>
                
                {this.props.helpPosts.map((singlePost)=>{
                    return <HelpPost key={singlePost.postId} handleSelectPost={this.handleSelectPost} postData={singlePost}/>
                })}
                {this.state.selectedPost==undefined ? null : 
                <HelpPostModal 
                    isOpen={this.state.isPostModalOpen}
                    onRequestClose={this.handleClosePostModal}
                    postData = {this.state.selectedPost}
                    rerenderAfterComment={this.handleCommentAddedRerenderModal}
                />}
                
                {this.state.isAddPostModalOpen ? <AddHelpPostModal 
                    isOpen = {this.state.isAddPostModalOpen}
                    onRequestClose = {this.handleCloseAddPostModal}
                />: null}
                <button onClick={this.handleOpenAddPostModal}>Add new post!</button>

                
            </div>
         );
    }
}

const mapStateToProps = (state) =>({
        helpPosts:state.helpPosts
})

export default connect(mapStateToProps)(HelpPage);