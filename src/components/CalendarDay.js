import React from 'react';
import moment from 'moment';

class CalendarDay extends React.Component {
    constructor(props){
        super(props);
    }

    printEvents = ()=> this.props.events.map((event)=><p key={event.name+event.description}>{event.name}</p>);  
    

    render() { 
        return ( 
            <td onClick={()=>{console.log(this.props.day.format('D MM'))}}>
                 {this.props.day.format('D')}
                 {
                     this.props.events.length==0 ? null : this.printEvents()
                 }
            </td>
         );
    }
}
 
export default CalendarDay;