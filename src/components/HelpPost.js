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
                <p className="helpPost__name">{this.props.postData.name.length>=20 ? `${this.props.postData.name.substring(0,20)}...` : this.props.postData.name}</p>
                <div className="helpPost__descriptionContainer">
                    <p className="helpPost__description">{this.props.postData.description}</p>

                </div>
                <div className="helpPost__footer">
                    <p className="helpPost__datePosted" >{this.props.postData.datePosted.format('DD-MM-YYYY')}</p>
                    <p className="helpPost__author" >{this.props.postData.createdBy}</p>
                </div>
                

            </div>
         );
    }
}
 
export default HelpPost;