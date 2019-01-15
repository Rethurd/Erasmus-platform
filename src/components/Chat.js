import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import database, {firebase} from '../firebase/firebase';
import moment from 'moment';
import classNames from 'classnames';
// import {Jumbotron} from 'react-bootstrap';
// import BSButton from 'react-bootstrap/lib/Button'

class Chat extends React.Component {
    constructor(props) {
        super(props);
        const userID=firebase.auth().currentUser.uid;
        this.state = { 
            message:'',
            messageList:[],
            userID
         }

    }

    componentDidMount(){
        this.getMessagesFromDatabase();
        this.chatBottom.scrollIntoView();
    }

    componentDidUpdate(){
        this.chatBottom.scrollIntoView();
    }

    getMessagesFromDatabase = () =>{
        database.ref('messages').limitToLast(500).on('value',(allMessages)=>{
            const messageList=[];
            allMessages.forEach((singleMessage)=>{
                const message = {
                    ...singleMessage.val(),
                    messageId:singleMessage.key
                }
                messageList.push(message);
            });
            this.setState(()=>({messageList}));
        });
    };

    handleMessageChange = (e) =>{
        const message = e.target.value;
        this.setState(()=>({message}));
    }
    handleSendMessage = () =>{
        if(this.state.message!=''){
            const user = firebase.auth().currentUser;
            const messageObject = {
                user:user.displayName,
                userID:user.uid,
                dateSent:moment().unix(),
                message:this.state.message
            }
            database.ref(`messages`).push(messageObject).then(()=>{
                this.setState(()=>({message:''}));
            });
        }
        
    }

    renderMessages = () =>{
        return this.state.messageList.map((singleMessage)=>{
            if(singleMessage.userID==this.state.userID){
                return(
                    <li key={singleMessage.messageId} className="chatMessage--currentUsers">
                        <div className="chatMessage__header">
                            <p>{singleMessage.user}</p>
                            <p>{moment(singleMessage.dateSent*1000).format('DD-MM HH:mm')}</p>
                        </div>
                        <div className="chatMessage__message">
                            {singleMessage.message}
                        </div>
                    </li>
                    
                    )
            }else{
                return(
                    <li key={singleMessage.messageId} className="chatMessage">
                        <div className="chatMessage__header">
                            <p>{singleMessage.user}</p>
                            <p>{moment(singleMessage.dateSent*1000).format('DD-MM HH:mm')}</p>
                        </div>
                        <div className="chatMessage__message">
                            {singleMessage.message}
                        </div>
                    </li>
                    
                    )
            }
            
        });
        
    }
    render() { 
        return ( 
            <div className="chatBox">
                <div>
                    <div className="chatHeader">Chat</div>
                    <ul className={classNames("chatList","chatBox__scrollbar")}>
                        {this.renderMessages()}
                        <li className="chatMessage--hidden" ref={(el)=>{
                            this.chatBottom=el;
                        }}></li>
                    </ul>
                    <div className="messageBox">
                        <TextField 
                            multiline={true}
                            rows={3}
                            autoFocus={true}
                            placeholder="Message..."
                            value={this.state.message}
                            onChange={this.handleMessageChange}
                            className="chatInput"
                        />
                            <Button variant="outlined" onClick={this.handleSendMessage} className="chatSendButton">
                                Send
                            </Button>
                        
                    </div>
                </div>
            </div>
         );
    }
}
 
 
export default Chat;