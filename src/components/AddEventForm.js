import React from 'react';
import {connect} from 'react-redux';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {MuiPickersUtilsProvider } from 'material-ui-pickers';
import {DateTimePicker} from 'material-ui-pickers';
import {startAddEvent, addParticipantToDatabase} from '../actions/events';
import {firebase} from '../firebase/firebase';
import uuid from 'uuid';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
// put this on a separate page and redirect after adding?
class AddEventForm extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            
            'name':'',
            'description':'',
            'date':moment(),
            'participants':[],
            'location':'',
            'descriptionEmptyError':undefined,
            'nameEmptyError':undefined,
            'createdBy':'Unknown',
            'createdById':undefined
        }
    }
    
    handleEventNameChange = (e) =>{
        const name = e.target.value
        this.setState(()=>({name}));
    }
    handleEventLocationChange = (e)=>{
        const location = e.target.value
        this.setState(()=>({location}));
    }
    handleEventDescriptionChange = (e)=>{
        const description = e.target.value
        this.setState(()=>({description}));
    }
    handleDateChange = (date)=>{
        // const date = e.format('MM-DD-YYYY HH:mm');
        this.setState(()=>({date}));

    }
    handleOnSubmit = (e) =>{
        e.preventDefault(); // so the page doesnt refresh
        let error1 = document.getElementById("CE_error1");
        let error2 = document.getElementById("CE_error2");
                if(this.state.name==''){
                    error1.style.setProperty("height","50px","important");
                    error1.style.setProperty("margin-bottom","15px","important");
                    this.setState(()=>({nameEmptyError:'The event name cannot be empty!'}));
                }else{
                    error1.style.setProperty("height","0px","important");
                    error1.style.setProperty("margin-bottom","0px","important");
                    this.setState(()=>({nameEmptyError:undefined}));
                }
                if(this.state.description==''){
                    error2.style.setProperty("height","50px","important");
                    error2.style.setProperty("margin-bottom","15px","important");
                    this.setState(()=>({descriptionEmptyError:'The event description cannot be empty!'}));
                }else{
                    error2.style.setProperty("height","0px","important");
                    error2.style.setProperty("margin-bottom","0px","important");
                    this.setState(()=>({descriptionEmptyError:undefined}));
                }
                if (this.state.name!='' && this.state.description!=''){
                    let user = firebase.auth().currentUser;
                    //setState takes time to update, so I add the event only after the state has changed
                    this.setState(()=>({createdBy:user.displayName,createdById:user.uid}),()=>{
                        //omitting properties from the state using ES7 object spread operator
                        const { descriptionEmptyError,nameEmptyError,...eventData}=this.state;
                        this.props.startAddEvent(eventData);
                        // this.props.addParticipantToDatabase(this.state.eventId,user.uid,{name:user.displayName,email:user.email}); - adding the organizer to the event - currently doesnt work
                        // if logged in then write display name, if not save 'Unknown'
                        // reset to default
                        this.setState(()=>({
                            'name':'',
                            'description':'',
                            'date':moment(),
                            // 'participants':
                            'location':'',
                            'descriptionEmptyError':undefined,
                            'nameEmptyError':undefined,
                            'createdBy':'Unknown'
                        }));
                    });             
                    
                    
                }
    }
    render() { 
        
        return ( 
            <form onSubmit={this.handleOnSubmit} className="createEvent__form"> 
            <div>
                <span>Date: </span>
                <MuiPickersUtilsProvider  utils={MomentUtils}>
                    <DateTimePicker  value={this.state.date} onChange ={this.handleDateChange} className="createEvent__date" />
                </MuiPickersUtilsProvider>
            </div> 
            
            <div  className="error__message" id="CE_error1">{this.state.nameEmptyError}</div>
            <div>
                <span>Name: </span><TextField value={this.state.name} onChange={this.handleEventNameChange} placeholder="Event name" className="textFieldInput"></TextField>
            </div>
            <div>
                <span>Location: </span><TextField className="textFieldInput" value={this.state.location}  onChange={this.handleEventLocationChange} placeholder="Starting location"></TextField>
            </div>
            <div id="CE_error2" className="error__message">{this.state.descriptionEmptyError}</div>
            <div className="createEvent__description__container">
                <span>Description: </span><TextField multiline rowsMax={3} placeholder="Description..." value={this.state.description} onChange={this.handleEventDescriptionChange} className={classNames("textFieldInput","textFieldInput--multiline")} ></TextField>
            </div>
            <div className="createEvent__btn__container">
                <button className={classNames("btn","createEvent__btn")}>Submit</button>

            </div>


        </form> );
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        startAddEvent: (event) =>dispatch(startAddEvent(event)),
        addParticipantToDatabase: (eventId,participantId,participantData) =>dispatch(addParticipantToDatabase(eventId,participantId,participantData))
    }
}

export default connect(undefined,mapDispatchToProps)(AddEventForm);