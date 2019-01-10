import React from 'react';
import classNames from 'classnames';
class InfoPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="infoPost" onClick={()=>{this.props.handleOpenModal(this.props.postData)}} >
                <h3 className="infoPost__title">{this.props.postData.name.length>=27 ? `${this.props.postData.name.substring(0,27)}...`: this.props.postData.name}</h3>
                <div className="descriptionContainer" >
                    <div className={classNames("descriptionContainer__text","infoDescription__scrollBar")} >
                       
                              {this.props.postData.description }
                        
                    </div>
                </div>
                <div className="infoPost__footer">
                        <p>{this.props.postData.createdBy}</p>
                        <p>{this.props.postData.creationDate.format('DD-MM-YY HH:mm')}</p>
                </div>
            </div>
         );
    }
}
 
export default InfoPost;