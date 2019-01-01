import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import {connect} from 'react-redux';
import CalendarDay from './CalendarDay';
import eventsSelector from '../selectors/events';
import AddEventForm from './AddEventForm';
import sortedEvents from '../selectors/sortedEvents';
import uuid from 'uuid';
import EventModal from './EventModal';
import {isEmpty} from '../resources/functions';
import getEventById from '../selectors/getEventById';
import classNames from 'classnames';
class CalendarPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            contextDate:moment().startOf('month'),
            today:moment(),
            selectedDay:moment(),
            selectedEvent:{},
            isModalOpen:false,
            formOpen:true
        }
    }
    turnModalOn = ()=>{
        this.setState(()=>{
            return{
                isModalOpen:true
            }
        });
    }

    turnModalOff = () =>{
        this.setState(()=>{
            return{
                isModalOpen:false,
                selectedEvent:{}
            }
        });
    };

    rerenderAfterChange = (eventId)=>{
        const selectedEvent = getEventById(this.props.events,eventId);
        this.setState(()=>({
            isModalOpen:true,
            selectedEvent,
        }));
    }

    getEvent = (selectedEvent) =>{
        this.setState(()=>({
            isModalOpen:true,
            selectedEvent
        }));
    };

    getFirstMonthDay = () => this.state.contextDate.startOf('month');    
    getLastMonthDay = () => this.state.contextDate.endOf('month');    

    getEventsOfDay = (day) =>{
        //when the function gets called when rendering for the 1st time
        if(day==undefined)
            day=moment();
        //when we get a date from clicking on a calendar day
        else this.setState(()=>({selectedDay:moment(day)}));
        const todaysEvents = eventsSelector(this.props.events,this.state.selectedDay);
        return todaysEvents.map((singleEvent)=>{
            return(
                <div key={uuid()}>
                     <h4>{singleEvent.name}</h4>
                     <p>Description: {singleEvent.description}</p>
                     {/* <p>Participants: {singleEvent.participants.map((singleParticipant)=>{return <p key={uuid()}>{singleParticipant.participantData.name}</p>})}</p>  */}
                </div>
            )
        });
        
    }
    //get rid of or check the parameters
    goThroughDays = (datesArray,startDate,endDate) =>{
        
        let firstMonthIndex = parseInt(this.getFirstMonthDay().format('D'));
        const lastMonthIndex = parseInt(this.getLastMonthDay().format('D'));
        let dayData;
        for (firstMonthIndex; firstMonthIndex <=lastMonthIndex; firstMonthIndex++) {
            dayData = moment(this.getFirstMonthDay().add(firstMonthIndex-1,'days'));
            const eventsToAdd = eventsSelector(this.props.events,dayData);
            datesArray.push(<CalendarDay getEventsOfDay={this.getEventsOfDay} getEvent={this.getEvent} key={uuid()} day={dayData} events={eventsToAdd}/>);
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
        const weekdaysToTable= weekdays.map((weekday)=> <div className="weekDay" key={uuid()}>{weekday}</div>);
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
            emptyDaysToReverse.push(<div className="emptyDay"  key={uuid()}>{previousDay.format('D')}</div>)
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
                        week.push(<div className="emptyDay" key={uuid()} >{emptySpacesCount+1}</div>);
                    }
                }
                thisModifiedMonth.push(week);
                week=[];
                
            }   
        }
        return thisModifiedMonth;
        
    }
    handleToggleCreateEvent = () =>{
        let toggleContent = document.getElementById("createEvent__toggle");
        if(this.state.formOpen){
            toggleContent.style.maxHeight=0;
            toggleContent.style.padding=0;
            this.setState(()=>({formOpen:false}));
        }else{
            toggleContent.style.maxHeight='320px';
            toggleContent.style.padding='1.5rem';
            this.setState(()=>({formOpen:true}));
        }
        
    }
    render() { 
        return ( 
            <div>
                <h1 className="page__title">Calendar</h1>
                <div className="calendarPage__container">
                    <div className="calendar">
                        <div className="calendar__header">
                            <button className={classNames("btn","calendar__btn")} onClick={this.previousMonth}>&lt;</button>
                                <span className="calendar__date"> {this.state.contextDate.format('MMMM')}-{this.state.contextDate.format('YYYY')} </span>
                            <button className={classNames("btn","calendar__btn")}  onClick={this.nextMonth}>&gt;</button>
                        </div>
                        <div className="calendarTable__container">
                            <div className="calendarTable" >
                                <div className="calendar__weekDays"> 
                                    {this.printWeekDays()}                          
                                </div>
                                <div className="calendar__days">
                                    {this.printMonth()} 
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="calendar__addNewEvent">
                        <div className="center-container">
                             <button onClick={this.handleToggleCreateEvent} className={classNames("btn","calendarPage__collapsible__button")}>Create event</button>
                        </div>
                        <div className="createEvent__container" id="createEvent__toggle" >
                                <AddEventForm/>
                        </div>
                    </div>
                    <div className="calendar__todaysEvents">
                        <h2>Events happening on: {this.state.selectedDay.format('DD-MM-YYYY')}</h2>
                        {this.getEventsOfDay()}
                    </div>
                </div>
                
                
                
                {isEmpty(this.state.selectedEvent)? null : <EventModal
                    isOpen={this.state.isModalOpen}
                    onRequestClose = {this.turnModalOff}
                    eventData={this.state.selectedEvent}
                    rerenderAfterChange={this.rerenderAfterChange}
                /> }
            </div>
         );
    }
}
 
const mapStateToProps = (state) =>{
    return{
        events:sortedEvents(state.events)
    }
}

export default connect(mapStateToProps)(CalendarPage);