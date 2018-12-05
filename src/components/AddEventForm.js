import React from 'react';
import {connect} from 'react-redux';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {MuiPickersUtilsProvider } from 'material-ui-pickers';
import {DateTimePicker} from 'material-ui-pickers';
import {addEvent} from '../actions/events';
import {firebase} from '../firebase/firebase';
import uuid from 'uuid';


// put this on a separate page and redirect after adding?
class AddEventForm extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            'eventId':uuid(),
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
    handleDateDescriptionChange = (date)=>{
        // const date = e.format('MM-DD-YYYY HH:mm');
        this.setState(()=>({date}));

    }
    handleOnSubmit = (e) =>{
        e.preventDefault(); // so the page doesnt refresh
                if(this.state.name==''){
                    this.setState(()=>({nameEmptyError:'The event name cannot be empty!'}));
                }else{
                    this.setState(()=>({nameEmptyError:undefined}));
                }
                if(this.state.description==''){
                    this.setState(()=>({descriptionEmptyError:'The event description cannot be empty!'}));
                }else{
                    this.setState(()=>({descriptionEmptyError:undefined}));
                }
                if (this.state.name!='' && this.state.description!=''){
                    let user = firebase.auth().currentUser;
                    //setState takes time to update, so I add the event only after the state has changed
                    this.setState(()=>({createdBy:user.displayName,createdById:user.uid}),()=>{
                        //omitting properties from the state using ES7 object spread operator
                        const { descriptionEmptyError,nameEmptyError,...eventData}=this.state;
                        this.props.addEvent(eventData);
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
            <form onSubmit={this.handleOnSubmit}>  
            <MuiPickersUtilsProvider  utils={MomentUtils}>
                <DateTimePicker  value={this.state.date} onChange ={this.handleDateDescriptionChange} />
            </MuiPickersUtilsProvider>
            <div>
                <div>{this.state.nameEmptyError}</div>
                <input type="text" value={this.state.name} onChange={this.handleEventNameChange} placeholder="event name"></input>
            </div>
            <div>
                <input type="text" value={this.state.location}  onChange={this.handleEventLocationChange} placeholder="starting location"></input>
            </div>
            <div>
                <div>{this.state.descriptionEmptyError}</div>
                <textarea placeholder="description..." value={this.state.description} onChange={this.handleEventDescriptionChange} ></textarea>
            </div>
            <button >Submit</button>

        </form> );
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        addEvent: (event) =>dispatch(addEvent(event))
    }
}

export default connect(undefined,mapDispatchToProps)(AddEventForm);