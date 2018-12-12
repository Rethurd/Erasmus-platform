import React from 'react';

class HelpPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className='helpPost' onClick={()=>{
                this.props.handleSelectPost(this.props.postData);
            }}>
                <p>{this.props.postData.name}</p>
                <p>{this.props.postData.description}</p>
                <p>{this.props.postData.datePosted.format('DD-MM-YYYY')}</p>
                <p>Post Id: {this.props.postData.postId}</p>

            </div>
         );
    }
}
 
export default HelpPost;