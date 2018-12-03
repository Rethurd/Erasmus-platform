import React from 'react';
import moment from 'moment';

class CalendarDay extends React.Component {
    constructor(props){
        super(props);
    }
    render() { 
        return ( <td>{this.props.day.format('D')}</td> );
    }
}
 
export default CalendarDay;