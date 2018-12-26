const defaultUsersState = [];
const usersReducer = (state = defaultUsersState,action) => {

    switch(action.type){
        case('ADD_FRIEND'):
            // const thisUser = state.filter((singleUser)=>singleUser.userId==action.userId)[0];
            // const otherUsers = state.filter((singlePost)=> singlePost.postId!=action.helpPostId);
            // singleContextPost.comments.push(action.comment);
            // otherPosts.push(singleContextPost);
            return state;
        case('ADD_USERS_TO_STORE'):
            return action.users;
        default:
            return state;
    }
}

export default usersReducer