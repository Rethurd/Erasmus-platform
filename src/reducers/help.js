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
        case 'ADD_COMMENT':
            const contextPost = state.filter((singlePost)=>singlePost.postId==action.helpPostId);
            const otherPosts = state.filter((singlePost)=> singlePost.postId!=action.helpPostId);
            const singleContextPost = contextPost[0];
            singleContextPost.comments.push(action.comment);
            otherPosts.push(singleContextPost);
            return otherPosts;
        case 'DELETE_COMMENT':
            const contextPostDelete = state.filter((singlePost)=> singlePost.postId == action.helpPostId);
            const otherPostsDelete = state.filter((singlePost)=> singlePost.postId != action.helpPostId);
            const singleContextPostDelete = contextPostDelete[0];
            singleContextPostDelete.comments = singleContextPostDelete.comments.filter((singleComment)=>singleComment.commentId!=action.commentId)
            otherPostsDelete.push(singleContextPostDelete);
            return otherPostsDelete;
        default:
            return state;
        
    }
}
 
export default helpPostsReducer;