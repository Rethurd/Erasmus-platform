import React from 'react';
import {connect} from 'react-redux';
import ToDoPost from './ToDoPost';
import getToDoPosts from '../selectors/getToDoPosts';
import AddToDoPostModal from './AddToDoPostModal';
class ToDoPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            sortByValue:'rating',
            isModalOpen:false
        };
    };

    handleSortByChange = (e) =>{
        if(e.target.value=='rating'){
            this.setState(()=>({sortByValue:'rating'}))
        }
        else if(e.target.value=='date'){
            this.setState(()=>({sortByValue:'date'}))
        }
        console.log(e.target.value);
    }

    openAddPostModal = () =>{
        this.setState(()=>({isModalOpen:true}));
    }
    closeAddPostModal = () =>{
        this.setState(()=>({isModalOpen:false}));
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
            
                This is the ToDo page component!
                <button onClick={this.openAddPostModal}>Add a new recommendation!</button>
                {getToDoPosts(this.props.toDoPosts,this.state.sortByValue).map((singlePost)=>{
                    return <ToDoPost key={singlePost.toDoPostId} toDoPostData={singlePost}/>
                })}
                <AddToDoPostModal isOpen={this.state.isModalOpen} onRequestClose={this.closeAddPostModal}/>

            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    toDoPosts:state.toDoPosts
})


export default connect(mapStateToProps)(ToDoPage);