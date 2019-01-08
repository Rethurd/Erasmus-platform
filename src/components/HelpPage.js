import React from 'react';
import {connect} from 'react-redux';
import HelpPost from './HelpPost';
import HelpPostModal from './HelpPostModal';
import AddHelpPostModal from './AddHelpPostModal';
import getHelpPostById from '../selectors/getHelpPostById';
import {Pager} from 'react-bootstrap';
import classNames from 'classnames';
import database, {firebase} from '../firebase/firebase';
import getHelpPosts from '../selectors/getHelpPosts';
class HelpPage extends React.Component {
    constructor(props){
        super(props);
        const user = firebase.auth().currentUser;
        let isUserAdmin=false;
        this.state={
            dummyRerenderValue:true,
            selectedPost:undefined,
            isPostModalOpen:false,
            isAddPostModalOpen:false,
            currentPage:1,
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
    rerenderAfterChange = (postId)=>{
        const selectedPost = getHelpPostById(this.props.helpPosts,postId);
        this.setState(()=>({
            isPostModalOpen:true,
            selectedPost,
        }));
    }
    handleNextPage = ()=>{
        this.setState((state)=>({
            currentPage:state.currentPage+1
        }));
    }
    handlePreviousPage = ()=>{
        this.setState((state)=>({
            currentPage:state.currentPage-1
        }));
    }

    render() { 
        return ( 
            <div>
                <h1 className="page__title">Help section</h1>
                <div className="helpPage__posts">
                    {this.props.helpPosts.map((singlePost)=>{
                        return <HelpPost key={singlePost.postId} handleSelectPost={this.handleSelectPost} postData={singlePost}/>
                    }).splice(6*(this.state.currentPage-1),6)}
                </div>
                <Pager className="helpPage__pagination">
                    {this.state.currentPage==1 ? <Pager.Item href="#" className="helpPage__pagination__button" disabled onClick={this.handlePreviousPage}>&larr; Previous</Pager.Item> : <Pager.Item href="#" className="helpPage__pagination__button"  onClick={this.handlePreviousPage}>&larr; Previous</Pager.Item>}
                    {Math.ceil(this.props.helpPosts.length/6)==this.state.currentPage ? <Pager.Item className="helpPage__pagination__button" href="#" disabled onClick={this.handleNextPage}>Next &rarr; </Pager.Item> : <Pager.Item  className="helpPage__pagination__button" href="#" onClick={this.handleNextPage}>Next &rarr;</Pager.Item>}
                </Pager>
                {this.state.selectedPost==undefined ? null : 
                <HelpPostModal 
                    isOpen={this.state.isPostModalOpen}
                    onRequestClose={this.handleClosePostModal}
                    postData = {this.state.selectedPost}
                    rerenderAfterComment={this.rerenderAfterChange}
                    isUserAdmin= {this.state.isUserAdmin}
                />}
                
                {this.state.isAddPostModalOpen ? <AddHelpPostModal 
                    isOpen = {this.state.isAddPostModalOpen}
                    onRequestClose = {this.handleCloseAddPostModal}
                    
                />: null}
                <div className="btnNewHelpPost__container"><button className={classNames("btn", "btnNewHelpPost")} onClick={this.handleOpenAddPostModal}>Add new post!</button></div>

                
            </div>
         );
    }
}

const mapStateToProps = (state) =>({
        helpPosts:getHelpPosts(state.helpPosts)
})

export default connect(mapStateToProps)(HelpPage);