import React from 'react';
import {connect} from 'react-redux';
import InfoPost from './InfoPost';
import {isEmpty} from '../resources/functions';
import InfoPostModal from './InfoPostModal';
import AddInfoPostModal from './AddInfoPostModal';
import database, {firebase} from '../firebase/firebase';
import getInfoPostById from '../selectors/getInfoPostById';
import classNames from 'classnames';
import {Pager} from 'react-bootstrap';
import getInfoPosts from '../selectors/getInfoPosts';

class InfoPage extends React.Component {
    constructor(props){
        console.log('infoPage constructor ran');
        super(props);
        const user = firebase.auth().currentUser;
        let isUserAdmin=false;
        this.state={
            isModalOpen:false,
            selectedInfoPost:{},
            isAddPostModalOpen:false,
            userId:user.uid,
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
                <h1 className="page__title">Information / Announcements</h1>
                <div className="infoPage__allPosts">
                    {this.props.infoPosts.map((singlePostData)=>{
                        return <InfoPost handleOpenModal={this.handleOpenModal} key={singlePostData.infoPostId} postData={singlePostData}/>
                    }).splice(6*(this.state.currentPage-1),6)}
                </div>
                <Pager className="infoPage__pagination">
                    {this.state.currentPage==1 ? <Pager.Item href="#" className="infoPage__pagination__button" disabled onClick={this.handlePreviousPage}>&larr; Previous</Pager.Item> : <Pager.Item href="#" className="infoPage__pagination__button"  onClick={this.handlePreviousPage}>&larr; Previous</Pager.Item>}
                    {Math.ceil(this.props.infoPosts.length/6)==this.state.currentPage ? <Pager.Item className="infoPage__pagination__button" href="#" disabled onClick={this.handleNextPage}>Next &rarr; </Pager.Item> : <Pager.Item  className="infoPage__pagination__button" href="#" onClick={this.handleNextPage}>Next &rarr;</Pager.Item>}
                </Pager>
                {isEmpty(this.state.selectedInfoPost) ? null: <InfoPostModal rerenderAfterChange={this.rerenderAfterChange} isUserAdmin={this.state.isUserAdmin} isOpen={this.state.isModalOpen} postData={this.state.selectedInfoPost} onRequestClose={this.handleCloseModal}/>}
                    {/* Show the button only to admins */}
                {this.state.isUserAdmin ? <div className="btnNewInfoPost__container"><button className={classNames("text-center", "btn", "btnNewInfoPost")} onClick={this.handleOpenNewPostModal}>Create new</button></div> : null }
                {this.state.isAddPostModalOpen ? <AddInfoPostModal  isOpen={this.state.isAddPostModalOpen} onRequestClose={this.handleCloseNewPostModal}/>: null}
            
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    infoPosts:getInfoPosts(state.infoPosts)
});
export default connect(mapStateToProps)(InfoPage);