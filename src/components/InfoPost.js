import React from 'react';

class InfoPost extends React.Component {
    constructor(props) {
        console.log("InfoPost created");
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <p>This is an InfoPost Component</p>
         );
    }
}
 
export default InfoPost;