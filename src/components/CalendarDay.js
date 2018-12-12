import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom'
import EventModal from './EventModal';

class CalendarDay extends React.Component {
    constructor(props){
        super(props);   
    }
    printEvents = ()=> {
        return(
            this.props.events.map((singleEvent)=> <p className='singleEvent' onClick={(e)=>{
                e.stopPropagation(); // this is to prevent ' EVENT BUBBLING' - dont want to trigger the 'onClick' of the table cell
                // e.preventDefault();
                this.props.getEvent(singleEvent);
            }}
            key={singleEvent.name+singleEvent.description}>
            {singleEvent.name}
        </p>));
    };
    

    render() { 
        return ( 
            <td onClick={()=>{
                    this.props.getEventsOfDay(this.props.day);
                }}>
                 {this.props.day.format('D')}
                 {
                     this.props.events.length==0 ? null : this.printEvents()
                 }

            </td>
            
         );
    }
}
 
export default CalendarDay;