const defaultToDoPostsState = [];

const toDoReducer = (state = defaultToDoPostsState,action) => {
    switch(action.type){
        case 'ADD_TO_DO_POST':
            return [...state,action.toDoPostData];
        default:
            return state;
    }
}
 
export default toDoReducer;