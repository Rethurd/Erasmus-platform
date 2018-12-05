import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom'
import EventModal from './EventModal';

class CalendarDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen:false,
            selectedEvent:{}
        }
    }

    //check if object is empty - to render Modal only if there is a selected event
     isEmpty = (obj) =>{
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    toggleModal = () =>{
        this.setState((state)=>{
            return{
                isModalOpen:!state.isModalOpen
            }
        });
    };

    printEvents = ()=> this.props.events.map((singleEvent)=>
    <p className='singleEvent' onClick={(e)=>{
            e.stopPropagation(); // this is to prevent 'EVENT BUBBLING' - dont want to trigger the 'onClick' of the table cell
            // e.preventDefault();
            this.toggleModal();
            this.setState(()=>({selectedEvent:singleEvent }));
        }}
        key={singleEvent.name+singleEvent.description}>
        {singleEvent.name}
     </p>);    
    

    render() { 
        return ( 
            <td onClick={()=>{
                    console.log('clicked on td - get rid of this',this.props.day);
                    this.props.getEventsOfDay(this.props.day);
                }}>
                 {this.props.day.format('D')}
                 {
                     this.props.events.length==0 ? null : this.printEvents()
                 }
                 {
                    this.isEmpty(this.state.selectedEvent) ? null :  
                    <EventModal 
                        eventData = {this.state.selectedEvent}
                        isOpen={this.state.isModalOpen}
                        onRequestClose={this.toggleModal}
                    />
                 }
                
            </td>
            
         );
    }
}
 
export default CalendarDay;