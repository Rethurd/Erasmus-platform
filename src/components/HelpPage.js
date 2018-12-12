import React from 'react';
import {connect} from 'react-redux';
import HelpPost from './HelpPost';
import HelpPostModal from './HelpPostModal';
import AddHelpPostModal from './AddHelpPostModal';

class HelpPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
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
        }))
    }
    handleCloseAddPostModal = () =>{
        this.setState(()=>({
            isAddPostModalOpen:false
        }))
    }


    render() { 
        console.log(this.props.helpPosts);
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