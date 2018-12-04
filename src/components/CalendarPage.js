import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import CalendarDay from './CalendarDay';
import eventsSelector from '../selectors/events';

class CalendarPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            contextDate:moment().startOf('month'),
            today:moment()
        }
    }
    
    getFirstMonthDay = () => this.state.contextDate.startOf('month');    
    getLastMonthDay = () => this.state.contextDate.endOf('month');    

    //get rid of or check the parameters
    goThroughDays = (datesArray,startDate,endDate) =>{
        
        let firstMonthIndex = parseInt(this.getFirstMonthDay().format('D'));
        const lastMonthIndex = parseInt(this.getLastMonthDay().format('D'));
        let dayData;
        for (firstMonthIndex; firstMonthIndex <=lastMonthIndex; firstMonthIndex++) {
            dayData = moment(this.getFirstMonthDay().add(firstMonthIndex-1,'days'));
            const eventsToAdd = eventsSelector(this.props.events,dayData);
            datesArray.push(<CalendarDay key={firstMonthIndex} day={dayData} events={eventsToAdd}/>);
        }
        return datesArray;
    };
    previousMonth = () =>{
        this.setState((state)=>({ contextDate:state.contextDate.subtract(1,'month') }));
    }
    nextMonth = () =>{
        this.setState((state)=>({ contextDate:state.contextDate.add(1,'month') }));
    }
    printWeekDays=()=>{
        // moment.updateLocale('en', {
        //     week: {
        //       dow: 1,
        //     },
        //   });
        const weekdays = moment.weekdays();
        const removed = weekdays.splice(0,1);
        weekdays.push(removed[0]);
        const weekdaysToTable= weekdays.map((weekday)=> <td key={weekday}>{weekday}</td>);
        return weekdaysToTable;
    };
    printMonth=()=>{
        let thisMonth=[];
        const emptyDaysAtStartOfMonth = this.getFirstMonthDay().format('dddd')=='Sunday'? 6: parseInt(this.state.contextDate.format('e'))-1;
        const emptyDaysAtEndOfMonth = this.getLastMonthDay().format('dddd')=='Sunday'? 0: 7-parseInt(this.state.contextDate.format('e'));
        //first add days from the previous month
        const previousDay = this.getFirstMonthDay();
        const emptyDaysToReverse= []
        for (let index = 0; index < emptyDaysAtStartOfMonth; index++) {
            previousDay.subtract(1,'days');
            emptyDaysToReverse.push(<td className='grayed-out-date'>{previousDay.format('D')}</td>)
        }
        emptyDaysToReverse.reverse();
        thisMonth =thisMonth.concat(emptyDaysToReverse);
        this.state.contextDate.add(emptyDaysAtStartOfMonth,'days');
        
        const startDate = this.getFirstMonthDay();
        const endDate = this.getLastMonthDay();
        //fill in with the actual days in month
        thisMonth = this.goThroughDays(thisMonth,startDate,endDate);
        const thisModifiedMonth = [];
        let week = [];
        //Divide the days in the month into weeks so I can later add them to different rows
        for (let index = 1; index < thisMonth.length+1; index++) {
            
            week.push(thisMonth[index-1]);
            if(index%7==0 || index==thisMonth.length){
                if(index==thisMonth.length){
                    //add the days from the next month
                    for (let emptySpacesCount = 0; emptySpacesCount < emptyDaysAtEndOfMonth; emptySpacesCount++) {
                        week.push(<td className="grayed-out-date">{emptySpacesCount+1}</td>);
                    }
                }
                thisModifiedMonth.push(week);
                week=[];
                
            }   
        }
        return thisModifiedMonth.map((week)=><tr>{week}</tr>);
        
    }
   
    render() { 
        return ( 
            <div>
                <p>This is the calendar component!</p>
                <div>
                    <button onClick={this.previousMonth}>&lt;</button>
                    {this.state.contextDate.format('MMMM')}-{this.state.contextDate.format('YYYY')}
                    <button onClick={this.nextMonth}>&gt;</button>
                </div>
                <table >
                    <thead>
                        <tr>
                            {this.printWeekDays()}                          
                        </tr>
                    </thead>
                    <tbody>
                        {this.printMonth()} 
                    </tbody>
                </table>
                
            </div>
         );
    }
}
 
const mapStateToProps = (state) =>{
    return{
        events:state.events
    }
}

export default connect(mapStateToProps)(CalendarPage);