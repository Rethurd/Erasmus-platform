import React from 'react';
import {connect} from 'react-redux';
import ToDoPost from './ToDoPost';
class ToDoPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            
        };
    };
    render() { 
        return ( 
            <div>
                This is the ToDo page component!
                {this.props.toDoPosts.map((singlePost)=>{
                    return <ToDoPost key={singlePost.toDoPostId} toDoPostData={singlePost}/>
                })}
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    toDoPosts:state.toDoPosts
})


export default connect(mapStateToProps)(ToDoPage);