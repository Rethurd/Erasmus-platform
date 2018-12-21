import React from 'react';
import {connect} from 'react-redux';
import ToDoPost from './ToDoPost';
import getToDoPosts from '../selectors/getToDoPosts';
import {isEmpty} from '../resources/functions';
import AddToDoPostModal from './AddToDoPostModal';
import ToDoPostModal from './ToDoPostModal';
import getToDoPostById from '../selectors/getToDoPostById';

class ToDoPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            sortByValue:'rating',
            isAddNewModalOpen:false,
            isModalOpen:false,
            selectedToDoPost:{}
            
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
    
    render() { 
        return ( 
            <div>
                <div>
                    <select onChange={this.handleSortByChange}>
                        <option value="rating">Ratings</option>
                        <option value="date">Date posted</option>
                    </select>
                </div>
            
                <p>This is the ToDo page component!</p>
                <button onClick={this.openAddPostModal}>Add a new recommendation!</button>
                {this.renderToDoPosts()}
                {this.state.isAddNewModalOpen ? <AddToDoPostModal isOpen={this.state.isAddNewModalOpen} onRequestClose={this.closeAddPostModal}/> : null}
                {isEmpty(this.state.selectedToDoPost) ? null :
                 <ToDoPostModal isOpen={this.state.isModalOpen} onRequestClose={this.closePostModal} toDoPostData={this.state.selectedToDoPost}/>}
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    toDoPosts:state.toDoPosts
});


export default connect(mapStateToProps)(ToDoPage);