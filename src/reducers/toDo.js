import react from 'react';
const defaultToDoPostsState = [];

const ToDoReducer = (state = defaultToDoPostsState,action) => {
    switch(action.type){
        case 'ADD_TO_DO_POST':
            return [...state,action.toDoPostData];
        case 'DELETE_TO_DO_POST':
            const newStateDelete = state.filter((singlePost)=>singlePost.toDoPostId!=action.toDoPostId);
            return newStateDelete;
        case 'EDIT_TO_DO_POST':
            const uneditedPosts = state.filter((singlePost)=> singlePost.toDoPostId!=action.postData.toDoPostId);
            const postToEdit = {
                ...action.postData
            };
            uneditedPosts.push(postToEdit);
            return uneditedPosts;
        case 'SET_TO_DO_POSTS':
            const newState = [];
            action.posts.forEach((post)=>{
                newState.push(post);
            })
            return newState;
        case 'ADD_RATING_TO_POST':
            const contextPost = state.filter((singlePost)=>singlePost.toDoPostId==action.postId);
            const otherPosts = state.filter((singlePost)=>singlePost.toDoPostId!=action.postId);
            const singleContextPost = contextPost[0]
            singleContextPost.reviews.push(action.review);
            otherPosts.push(singleContextPost);
            return otherPosts;
        case 'DELETE_RATING_FROM_POST':
            const deleteRatingPost = state.filter((singlePost)=>singlePost.toDoPostId==action.postId);
            const noDeletePosts = state.filter((singlePost)=>singlePost.toDoPostId!=action.postId);
            const singleDeleteRatingPost = deleteRatingPost[0];
            singleDeleteRatingPost.reviews = singleDeleteRatingPost.reviews.filter((singleReview)=>singleReview.reviewId!=action.reviewId)
            noDeletePosts.push(singleDeleteRatingPost);
            return noDeletePosts;
        case 'UPDATE_RATING_OF_POST':
            const updateRatingPost = state.filter((singlePost)=>singlePost.toDoPostId==action.postId);
            const noUpdatePosts = state.filter((singlePost)=>singlePost.toDoPostId!=action.postId);
            const singleUpdateRatingsPost = updateRatingPost[0];
            const reviewToUpdate = singleUpdateRatingsPost.reviews.filter((singleReview)=>singleReview.reviewId==action.reviewId)[0];
            const otherReviews = singleUpdateRatingsPost.reviews.filter((singleReview)=>singleReview.reviewId!=action.reviewId);
            reviewToUpdate.liked=action.newRating;
            otherReviews.push(reviewToUpdate);
            singleUpdateRatingsPost.reviews = otherReviews;
            noUpdatePosts.push(singleUpdateRatingsPost);
            return noUpdatePosts;
        case 'INCREASE_RATINGS_POSITIVE':
            const ratingsPost = state.filter((singlePost)=>singlePost.toDoPostId==action.postId);
            const otherRatingsPosts = state.filter((singlePost)=>singlePost.toDoPostId!=action.postId);
            const singleRatingsPost = ratingsPost[0];
            singleRatingsPost.ratingsPositive++;
            otherRatingsPosts.push(singleRatingsPost);
            return otherRatingsPosts;
        case 'CHANGE_RATINGS_SUM':
            const postToChangeRatingsIn = state.filter((singlePost)=>singlePost.toDoPostId==action.postId);
            const postsWithoutRatingsChanged = state.filter((singlePost)=>singlePost.toDoPostId!=action.postId);
            const singlePostToChangeRatingsIn = postToChangeRatingsIn[0];
            
            if(action.swapPositiveToNegative==true){
                singlePostToChangeRatingsIn.ratingsPositive--;
                singlePostToChangeRatingsIn.ratingsNegative++;
            }
            else if(action.swapNegativeToPositive==true){
                singlePostToChangeRatingsIn.ratingsPositive++;
                singlePostToChangeRatingsIn.ratingsNegative--;
            }
            else if(action.swapPositiveToNegative==false && action.swapNegativeToPositive==false)
            {
                if(action.positiveOrNegative=='POSITIVE'){

                    action.addOrSubstract=='ADD' ? singlePostToChangeRatingsIn.ratingsPositive++ : singlePostToChangeRatingsIn.ratingsPositive--;
                }else{
    
                    action.addOrSubstract=='ADD' ? singlePostToChangeRatingsIn.ratingsNegative++ : singlePostToChangeRatingsIn.ratingsNegative--;
                }
            }
            postsWithoutRatingsChanged.push(singlePostToChangeRatingsIn);

            return postsWithoutRatingsChanged;
        default:
            return state;
    }
}
 
export default ToDoReducer;