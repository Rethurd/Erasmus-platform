import React from 'react';
import {connect} from 'react-redux';
import ToDoPost from './ToDoPost';
import getToDoPosts from '../selectors/getToDoPosts';
import {isEmpty} from '../resources/functions';
import AddToDoPostModal from './AddToDoPostModal';
import ToDoPostModal from './ToDoPostModal';
import getToDoPostById from '../selectors/getToDoPostById';
import ToDoFilters from './ToDoFilters';
import selectToDoPosts from '../selectors/selectToDoPosts';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';
import Collapsible from 'react-collapsible';
import {Pager} from 'react-bootstrap';
import database, {firebase} from '../firebase/firebase';

class ToDoPage extends React.Component {
    constructor(props){
        super(props);
        const user = firebase.auth().currentUser;
        let isUserAdmin=false;
        this.state={
            sortByValue:'rating',
            isAddNewModalOpen:false,
            isModalOpen:false,
            selectedToDoPost:{},
            filtersOpen:false,
            currentPage:1,
            isUserAdmin,
            loading:true
        };
        database.ref('adminList').once('value').then((allAdmins)=>{
            
            const admins = Object.values(allAdmins.val());
            for (let index = 0; index < admins.length; index++) {
                if(admins[index].adminID==user.uid){
                    this.setState(()=>({isUserAdmin:true}));
                    break;
                }
            }
            this.setState(()=>({loading:false}));
        });
    };

    handleSortByChange = (e) =>{
        if(e.target.value=='rating'){
            this.setState(()=>({sortByValue:'rating'}))
        }
        else if(e.target.value=='date'){
            this.setState(()=>({sortByValue:'date'}))
        }
    }

    openAddPostModal = () =>{
        this.setState(()=>({isAddNewModalOpen:true}));
    }
    closeAddPostModal = () =>{
        this.setState(()=>({isAddNewModalOpen:false}));
    }

    openPostModal = (toDoPostId) =>{
        const selectedToDoPost = getToDoPostById(this.props.toDoPosts,toDoPostId);
        this.setState(()=>({isModalOpen:true,selectedToDoPost}));
    }
    closePostModal = () =>{
        this.setState(()=>({isModalOpen:false,selectedToDoPost:{}}));
    }
    renderToDoPosts = () =>{
        return getToDoPosts(this.props.toDoPosts,this.state.sortByValue).map((singlePost)=>{
            return <ToDoPost openPostModal={this.openPostModal} key={singlePost.toDoPostId} toDoPostData={singlePost} />
        });
    }
    handleToggleCollapsible = () =>{
        let toggleContent = document.getElementById("TDP_dataManagement");
        if(this.state.filtersOpen){
            toggleContent.style.maxHeight=0;
            toggleContent.style.padding=0;
            this.setState(()=>({filtersOpen:false}));
        }else{
            toggleContent.style.maxHeight='200px';
            toggleContent.style.padding='1.5rem';
            this.setState(()=>({filtersOpen:true}));
        }
        
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
            <div style={{ marginBottom:'180px' }} >
            {this.state.loading ? 
                <div style={{ marginBottom:'800px' }} >
                     <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
                :
                <div className="toDoPage">
                
                    <h1 className="page__title">What to do during your Erasmus ?</h1>
                    <div className="center-container">
                        <button onClick={this.handleToggleCollapsible} className={classNames("btn","toDoPage__collapsible__button")}>Filter results</button>
                    </div>
                    <div id="TDP_dataManagement" className="toDoPage__dataManagement">
                        <div className="toDoPage__sorting">
                            <p>Sort by:</p>
                            <Select value={this.state.sortByValue} onChange={this.handleSortByChange}>
                                <MenuItem value="rating">Ratings</MenuItem>
                                <MenuItem value="date">Date posted</MenuItem>
                            </Select>
                        </div>
                        <ToDoFilters/>
                    </div>
                    
                    <div className="toDoPage__btnContainer">
                        <button className={classNames("btn","btnNewToDoPost")} onClick={this.openAddPostModal}>Add a new recommendation!</button>
                    </div>
                    <div className="toDoPage__allPosts">
                        {this.renderToDoPosts().splice(5*(this.state.currentPage-1),5)}

                    </div>
                    <Pager className="infoPage__pagination">
                        {this.state.currentPage==1 ? <Pager.Item href="#" className="toDoPage__pagination__button" disabled onClick={this.handlePreviousPage}>&larr; Previous</Pager.Item> : <Pager.Item href="#" className="toDoPage__pagination__button"  onClick={this.handlePreviousPage}>&larr; Previous</Pager.Item>}
                        {Math.ceil(getToDoPosts(this.props.toDoPosts,this.state.sortByValue).length/5)==this.state.currentPage ? <Pager.Item className="toDoPage__pagination__button" href="#" disabled onClick={this.handleNextPage}>Next &rarr; </Pager.Item> : <Pager.Item  className="toDoPage__pagination__button" href="#" onClick={this.handleNextPage}>Next &rarr;</Pager.Item>}
                    </Pager>
                    {this.state.isAddNewModalOpen ? <AddToDoPostModal isOpen={this.state.isAddNewModalOpen} onRequestClose={this.closeAddPostModal}/> : null}
                    {isEmpty(this.state.selectedToDoPost) ? null :
                    <ToDoPostModal isOpen={this.state.isModalOpen} onRequestClose={this.closePostModal} toDoPostData={this.state.selectedToDoPost} isUserAdmin={this.state.isUserAdmin}/>}
                </div>}
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    toDoPosts:selectToDoPosts(state.toDoPosts,state.toDoFilters)
});


export default connect(mapStateToProps)(ToDoPage);