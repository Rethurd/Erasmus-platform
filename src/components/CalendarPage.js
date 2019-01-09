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
import database, {firebase} from '../firebase/firebase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class CalendarPage extends React.Component {
    constructor(props){
        super(props);
        const user = firebase.auth().currentUser;
        let isUserAdmin=false;
        this.state = {
            contextDate:moment().startOf('month'),
            today:moment(),
            selectedDay:moment(),
            selectedEvent:{},
            isModalOpen:false,
            formOpen:true,
            isUserAdmin,
            displayEvents:'all',
            userFriendsId:[],
            loading:true
        }
        database.ref('adminList').once('value').then((allAdmins)=>{
            return allAdmins.forEach((singleAdmin)=>{
                if(singleAdmin.val().adminID==user.uid){
                    this.setState(()=>({isUserAdmin:true}));
                }
            });
        }).then(()=>{
            const userId = firebase.auth().currentUser.uid;
            const friendsArray=[];
    
            database.ref(`users/${userId}`).once('value',(userSnapshot)=>{
                if(!!userSnapshot.val().friends){
                    const friends = userSnapshot.val().friends;
                    for (var singleFriend in friends) {
                        if (friends.hasOwnProperty(singleFriend)) {
                            friends[singleFriend] = {
                            ...friends[singleFriend],
                            friendshipId:singleFriend
                            }
                            friendsArray.push(friends[singleFriend]);
                        }
                    }
                }
            }).then(()=>{
                const userFriendsId = friendsArray.map(singleFriend=>singleFriend.friendId);
                this.setState(()=>({userFriendsId,loading:false}));
            });
        });
        
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
        const todaysEvents = eventsSelector(this.props.events,this.state.selectedDay,this.state.userFriendsId,this.state.displayEvents);
        if(todaysEvents.length==0){
            return <div className="noEvents"> There's no events happening on that day, try creating your own!</div>
        }
        return todaysEvents.map((singleEvent)=>{
            return(
                <div className="eventsToday__singleEvent" onClick={()=>{this.getEvent(singleEvent)}} key={uuid()}>
                    {singleEvent.name.length>22 ?
                     <div><span>Name:</span> <div>{`${singleEvent.name.substring(0,22)}...`}</div></div> 
                     :
                      <div><span>Name:</span> <div>{singleEvent.name}</div></div>}
                     <div><span>Location:</span> <div>{singleEvent.location}</div></div>
                     <div><span>Description:</span> <div className="eventsToday__description">{singleEvent.description}</div></div>
                    
                </div>
            )
        });
        
    }
    goThroughDays = (datesArray) =>{
        
        let firstMonthIndex = parseInt(this.getFirstMonthDay().format('D'));
        const lastMonthIndex = parseInt(this.getLastMonthDay().format('D'));
        let dayData;
        const userId = firebase.auth().currentUser.uid;
        for (firstMonthIndex; firstMonthIndex <=lastMonthIndex; firstMonthIndex++) {
            dayData = moment(this.getFirstMonthDay().add(firstMonthIndex-1,'days'));
            const eventsToAdd = eventsSelector(this.props.events,dayData,this.state.userFriendsId,this.state.displayEvents);
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
            this.setState(()=>({formOpen:false}));
        }else{
            toggleContent.style.maxHeight='320px';
            this.setState(()=>({formOpen:true}));
        }
        
    }
    handleDisplayEvents = (e) =>{
        this.setState(()=>({displayEvents:e.target.value}));
    }
    render() { 
        if(!this.state.loading){

            
        }
        return ( 
            <div style={{ marginBottom:'100px' }} >
                {this.state.loading ? 
                <div style={{ marginBottom:'800px' }} >
                     <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>:
                <div>
                    <h1 className="page__title">Calendar</h1>
                    <div className="calendarPage__container">
                        <div className="calendar">
                            <div className="calendar__header">
                                <button className={classNames("btn","calendar__btn")} onClick={this.previousMonth}>&lt;</button>
                                    <span className="calendar__date"> {this.state.contextDate.format('MMMM')}-{this.state.contextDate.format('YYYY')} </span>
                                <button className={classNames("btn","calendar__btn")}  onClick={this.nextMonth}>&gt;</button>
                            </div>
                            <div className="calendar__filterContainer">
                                <span>Display: </span>
                                <Select value={this.state.displayEvents} onChange={this.handleDisplayEvents}>
                                    <MenuItem value="all">All events</MenuItem>
                                    <MenuItem value="friends">Friends participating</MenuItem>
                                </Select>

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
                        <div className="calendar__eventsToday__container">
                            <h2>Events happening on: {this.state.selectedDay.format('DD-MM-YYYY')}</h2>
                            {this.getEventsOfDay()}
                        </div>
                    </div>
                    
                    
                    
                    {isEmpty(this.state.selectedEvent)? null : <EventModal
                        isOpen={this.state.isModalOpen}
                        onRequestClose = {this.turnModalOff}
                        eventData={this.state.selectedEvent}
                        rerenderAfterChange={this.rerenderAfterChange}
                        isUserAdmin = {this.state.isUserAdmin}
                    /> }
                </div>}
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