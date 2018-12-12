const defaultHelpPostsState = [];
const helpPostsReducer = (state = defaultHelpPostsState, action) => {
    switch(action.type){
        case 'ADD_POST':
            return [...state,action.postData];
        case 'SET_HELP_POSTS':
            const newState = [];
            action.posts.forEach((post)=>{
                newState.push(post);
            })
            return newState;
        default:
            return state;
    }
}
 
export default helpPostsReducer;