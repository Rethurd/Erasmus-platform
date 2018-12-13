import React from 'react';
import {connect} from 'react-redux';
import InfoPost from './InfoPost';
class InfoPage extends React.Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() { 
        console.log(this.props.infoPosts);
        return ( 
            <div>
                This is the info page component!
                <div>
                    {this.props.infoPosts.map((singlePostData)=>{
                        return <InfoPost key={singlePostData.infoPostId} postData={singlePostData}/>
                    })}
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = (state)=>({
    infoPosts:state.infoPosts
})
export default connect(mapStateToProps)(InfoPage);