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
            this.props.events.map((singleEvent)=> 
            <div className='singleEvent' onClick={(e)=>{
                e.stopPropagation(); // this is to prevent ' EVENT BUBBLING' - dont want to trigger the 'onClick' of the table cell
                // e.preventDefault();
                this.props.getEvent(singleEvent);
            }}
            key={singleEvent.name+singleEvent.description}>
            {singleEvent.name.length>15 ? `${singleEvent.name.substring(0,15)}...`: singleEvent.name}
        </div>));
    };
    

    render() { 
        return ( 
            <div className="calendarDay" onClick={()=>{
                    this.props.getEventsOfDay(this.props.day);
                }}>
                 <span className="calendarDay__number">{this.props.day.format('D')}</span>
                 {
                     this.props.events.length==0 ? null : this.printEvents()
                 }

            </div>
            
         );
    }
}
 
export default CalendarDay;