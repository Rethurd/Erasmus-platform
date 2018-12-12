const defaultHelpPostsState = [];
const helpPostsReducer = (state = defaultHelpPostsState, action) => {
    switch(action.type){
        case 'ADD_POST':
            return [...state,action.postData];
        default:
            return state;
    }
}
 
export default helpPostsReducer;