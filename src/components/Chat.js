import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import database, {firebase} from '../firebase/firebase';
import moment from 'moment';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            message:'',
            messageList:[]
         }

    }

    componentDidMount(){
        this.getMessagesFromDatabase();
    }

    getMessagesFromDatabase = () =>{
        database.ref('messages').on('value',(allMessages)=>{
            const messageList=[];
            allMessages.forEach((singleMessage)=>{
                console.log(singleMessage)
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
        const user = firebase.auth().currentUser.displayName;
        const messageObject = {
            user,
            dateSent:moment().unix(),
            message:this.state.message
        }
        database.ref(`messages`).push(messageObject).then(()=>{
            this.setState(()=>({message:''}));
        });
    }

    renderMessages = () =>{
        return this.state.messageList.map((singleMessage)=>{
            return(
            <li key={singleMessage.messageId}>
                <div>
                    <p>{singleMessage.user}</p>
                    <p>{moment(singleMessage.dateSent*1000).format('DD-MM HH:mm')}</p>
                </div>
                <div>
                    {singleMessage.message}
                </div>
            </li>
            )
        });
        
    }
    render() { 
        return ( 
            <div>
                <ul >
                    {this.renderMessages()}
                </ul>
                <TextField 
                    multiline={true}
                    rows={3}
                    autoFocus={true}
                    placeholder="Message..."
                    value={this.state.message}
                    onChange={this.handleMessageChange}
                />
                <Button variant="outlined" onClick={this.handleSendMessage}>
                    Send
                </Button>
            </div>
         );
    }
}
 
 
export default Chat;