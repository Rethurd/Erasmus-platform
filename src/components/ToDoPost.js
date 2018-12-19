import React from 'react';
import moment from 'moment';
class ToDoPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <h3>{this.props.toDoPostData.name}</h3>
                <p>{this.props.toDoPostData.description}</p>
                <p>Date Posted: {this.props.toDoPostData.creationDate.format('DD-MM-YYYY')}</p>
                <p>Number of ratings: {this.props.toDoPostData.ratings.length}</p>
                <p>Average rating: {(this.props.toDoPostData.ratings.reduce((a,b)=>{
                    return a+b;
                },0)/this.props.toDoPostData.ratings.length).toFixed(2)}</p>
                {/*  if admin/owner, display delete and edit buttons here */}
            </div>
         );
    }
}
 
export 
default ToDoPost;