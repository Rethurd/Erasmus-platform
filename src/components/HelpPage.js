import React from 'react';
import {connect} from 'react-redux';
import HelpPost from './HelpPost';
import HelpPostModal from './HelpPostModal';

class HelpPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            selectedPost:undefined,
            isModalOpen:false
        }
    }

    handleSelectPost = (selectedPost) =>{
        this.setState(()=>({selectedPost, isModalOpen:true}));
    };
    handleCloseModal = ()=>{
        this.setState(()=>({
            selectedPost:undefined,
            isModalOpen:false
        }));
    };

    render() { 
        console.log(this.props.helpPosts);
        return ( 
            <div>
                <p>This is the help page component!</p>
                
                {this.props.helpPosts.map((singlePost)=>{
                    return <HelpPost handleSelectPost={this.handleSelectPost} postData={singlePost}/>
                })}
                {this.state.selectedPost==undefined ? null : 
                <HelpPostModal 
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.handleCloseModal}
                    postData = {this.state.selectedPost}
                    
                />}
            </div>
         );
    }
}

const mapStateToProps = (state) =>({
        helpPosts:state.helpPosts
})

export default connect(mapStateToProps)(HelpPage);