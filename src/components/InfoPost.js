import React from 'react';

class InfoPost extends React.Component {
    constructor(props) {
        console.log("InfoPost created");
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div onClick={()=>{this.props.handleOpenModal(this.props.postData)}}>
            <h3>{this.props.postData.name}</h3>
            <p>{this.props.postData.description}</p>
            </div>
         );
    }
}
 
export default InfoPost;