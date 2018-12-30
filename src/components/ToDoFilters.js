import React from 'react';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { changeTypeFilter, changeTextFilter } from '../actions/toDoFilters';


class ToDoFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ...this.props.toDoFilters
         }
    }

    handleTypeChange = (e) =>{
        this.props.changeTypeFilter(e.target.value);

    }

    handleSearch=(e)=>{
        this.props.changeTextFilter(e.target.value);
    }
    render() { 
        return (
            
        <div className="toDoPage__filtering">
            <p>Filter by:</p>
            <div className="filtering__type">
                <p>Type:</p>
                <Select
                        value={this.props.toDoFilters.type}
                        onChange={this.handleTypeChange}
                        displayEmpty
                        name="type"
                    >
                        <MenuItem value={'ALL'}>All types</MenuItem>
                        <MenuItem value={'Restaurant'}>Restaurant</MenuItem>
                        <MenuItem value={'Club/Pub/Bar'}>Club/Pub/Bar</MenuItem>
                        <MenuItem value={'Museum'}>Museum</MenuItem>
                        <MenuItem value={'City/Location'}>City/Location</MenuItem>
                        <MenuItem value={'Nature'}>Nature</MenuItem>
                        <MenuItem value={'Entertainment'}>Entertainment</MenuItem>
                        <MenuItem value={'Other'}>Other</MenuItem>
                </Select>
            </div>
            <div className="filtering__text">
                <p>Text:</p>
                <TextField 
                    label="Search"
                    value={this.props.toDoFilters.text}
                    onChange={this.handleSearch}
                />
            </div>
           
        </div> );
    }
}
 
const mapStateToProps =(state)=>({
    toDoFilters: state.toDoFilters
});

const mapDispatchToProps = (dispatch)=>({
    changeTypeFilter: (filterType)=>dispatch(changeTypeFilter(filterType)),
    changeTextFilter: (text)=>dispatch(changeTextFilter(text))
})

export default connect(mapStateToProps,mapDispatchToProps)(ToDoFilters);