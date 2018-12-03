import React from 'react';
import moment from 'moment';
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
        const fromDate = moment('2018-11-01');
        let firstMonthIndex = parseInt(this.getFirstMonthDay().format('D'));
        const lastMonthIndex = parseInt(this.getLastMonthDay().format('D'));
        for (firstMonthIndex; firstMonthIndex <=lastMonthIndex; firstMonthIndex++) {
            datesArray.push(<td key={firstMonthIndex}>{firstMonthIndex}</td>);
        }
        console.log(datesArray);
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
            console.log(previousDay.format('D'));
            emptyDaysToReverse.push(<td className='grayed-out-date'>{previousDay.format('D')}</td>)
        }
        emptyDaysToReverse.reverse();
        thisMonth =thisMonth.concat(emptyDaysToReverse);
        this.state.contextDate.add(emptyDaysAtStartOfMonth,'days');
        //fill in with the actual days in month
        const startDate = this.getFirstMonthDay();
        const endDate = this.getLastMonthDay();
        thisMonth = this.goThroughDays(thisMonth,startDate,endDate);
        
        const thisModifiedMonth = [];
        let week = [];
        for (let index = 1; index < thisMonth.length+1; index++) {
            
            week.push(thisMonth[index-1]);
            if(index%7==0 || index==thisMonth.length){
                if(index==thisMonth.length){
                    for (let emptySpacesCount = 0; emptySpacesCount < emptyDaysAtEndOfMonth; emptySpacesCount++) {
                        week.push(<td className="grayed-out-date">{emptySpacesCount+1}</td>);
                    }
                }
                thisModifiedMonth.push(week);
                week=[];
                
            }   
        }
        return thisModifiedMonth.map((week)=><tr>{week}</tr>);
        // this.state.contextDate.add('1','months');
        // console.log(this.getFirstMonthDay());
        // console.log(this.getLastMonthDay());
        
    }
    // printRest = () =>{
    //     const weeksArray = [];
    //     console.log(this.state.contextDate.format('e'));
    //     for (let index = 0; index < 7; index++) {
            
            
    //     }

    // }

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
                {/* {this.goThroughDays().map((date)=>{
                    return <p key={date}>{moment(date).format('MM-DD-YYYY')}</p>;
                })} */}
            </div>
         );
    }
}
 
export default CalendarPage;