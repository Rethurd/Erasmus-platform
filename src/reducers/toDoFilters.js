const defaultToDoFiltersReducerState = {
    text:'',
    type:'ALL'
}

const toDoFiltersReducer = (state=defaultToDoFiltersReducerState,action) => {
    switch(action.type){
        case 'CHANGE_TEXT_FILTER':
            return {
                ...state,
                text:action.text
            }
        case 'CHANGE_TYPE_FILTER':
            return {
                ...state,
                type:action.filterType
            }

        default:
            return state;
    }
}
 

export default toDoFiltersReducer;