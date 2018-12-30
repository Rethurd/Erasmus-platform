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

class ToDoPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            sortByValue:'rating',
            isAddNewModalOpen:false,
            isModalOpen:false,
            selectedToDoPost:{},
            filtersOpen:false
            
        };
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
    testCollapse = () =>{
        let thing = document.getElementById("TDP_dataManagement");
        if(this.state.filtersOpen){
            thing.style.maxHeight=0;
            thing.style.padding=0;
            this.setState(()=>({filtersOpen:false}));
        }else{
            thing.style.maxHeight='200px';
            thing.style.padding='1.5rem';
            this.setState(()=>({filtersOpen:true}));
        }
        
    }
    render() { 
        return ( 
            <div className="toDoPage">
                <h1 className="page__title">What to do during your Erasmus ?</h1>
                <div className="center-container">
                    <button onClick={this.testCollapse} className={classNames("btn","toDoPage__collapsible__button")}>Filter results</button>
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
                    {this.renderToDoPosts()}

                </div>
                {this.state.isAddNewModalOpen ? <AddToDoPostModal isOpen={this.state.isAddNewModalOpen} onRequestClose={this.closeAddPostModal}/> : null}
                {isEmpty(this.state.selectedToDoPost) ? null :
                 <ToDoPostModal isOpen={this.state.isModalOpen} onRequestClose={this.closePostModal} toDoPostData={this.state.selectedToDoPost}/>}
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    toDoPosts:selectToDoPosts(state.toDoPosts,state.toDoFilters)
});


export default connect(mapStateToProps)(ToDoPage);