import React from 'react';
import {connect} from 'react-redux';
import InfoPost from './InfoPost';
import {isEmpty} from '../resources/functions';
import InfoPostModal from './InfoPostModal';
class InfoPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isModalOpen:false,
            selectedInfoPost:{}
        }
    }
    handleOpenModal = (selectedInfoPost) =>{
        this.setState(()=>({isModalOpen:true,selectedInfoPost}));
    }

    handleCloseModal = () =>{
        this.setState(()=>({isModalOpen:false,selectedInfoPost:{}}));
    }
    render() { 
        console.log(this.props.infoPosts);
        return ( 
            <div>
                This is the info page component!
                <div>
                    {this.props.infoPosts.map((singlePostData)=>{
                        return <InfoPost handleOpenModal={this.handleOpenModal} key={singlePostData.infoPostId} postData={singlePostData}/>
                    })}
                </div>
                {isEmpty(this.state.selectedInfoPost) ? null: <InfoPostModal isOpen={this.state.isModalOpen} postData={this.state.selectedInfoPost} onRequestClose={this.handleCloseModal}/>}
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    infoPosts:state.infoPosts
})
export default connect(mapStateToProps)(InfoPage);