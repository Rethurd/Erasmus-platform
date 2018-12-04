import React from 'react';
import {connect} from 'react-redux';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {MuiPickersUtilsProvider } from 'material-ui-pickers';
import {DateTimePicker} from 'material-ui-pickers';
import {addEvent} from '../actions/events';


// put this on a separate page and redirect after adding?
class AddEventForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            'name':'',
            'description':'',
            'date':moment(),
            // 'participants':
            'location':''
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
    render() { 
        return ( 
            <form onSubmit={(e)=>{
                e.preventDefault(); // so the page doesnt refresh
                this.props.addEvent(this.state);
                this.setState(()=>({
                    'name':'',
                    'description':'',
                    'date':moment(),
                    // 'participants':
                    'location':''
                }))
            }}>  
            <MuiPickersUtilsProvider  utils={MomentUtils}>
                <DateTimePicker  value={this.state.date} onChange ={this.handleDateDescriptionChange} />
            </MuiPickersUtilsProvider>
            <input type="text" value={this.state.name} onChange={this.handleEventNameChange} placeholder="event name"></input>
            <input type="text" value={this.state.location}  onChange={this.handleEventLocationChange} placeholder="starting location"></input>
            <textarea placeholder="description..." value={this.state.description} onChange={this.handleEventDescriptionChange} ></textarea>
            <button >Submit</button>

        </form> );
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        addEvent: (expense) =>dispatch(addEvent(expense))
    }
}

export default connect(undefined,mapDispatchToProps)(AddEventForm);