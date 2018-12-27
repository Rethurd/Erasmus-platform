const defaultUsersFiltersState = {
    text:'',
}

const usersFiltersReducer = (state=defaultUsersFiltersState,action) => {
    switch(action.type){
        case 'CHANGE_USERS_TEXT_FILTER':
        console.log('in users filter reducers');
            return {
                text:action.text
            }
        
        default:
            return state;
    }
}
 

export default usersFiltersReducer;