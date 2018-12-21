import database from '../firebase/firebase';
import moment from 'moment';
import {isEmpty,arrayToObject} from '../resources/functions';

export const addToDoPost = (toDoPostData) =>({
    type:'ADD_TO_DO_POST',
    toDoPostData
});

export const addToDoPostToDatabase = (toDoPostData) =>{

    return (dispatch)=>{
        toDoPostData.creationDate = toDoPostData.creationDate.unix();
        const reviewsObject = arrayToObject(toDoPostData.reviews);
        toDoPostData.reviews=reviewsObject;
        return database.ref('toDoPosts').push(toDoPostData).then((ref)=>{
            const postModified = {
                ...toDoPostData,
                toDoPostId:ref.key,
                creationDate:moment(toDoPostData.creationDate*1000),
                reviews:[]
            }
            dispatch(addToDoPost(postModified));
        });
    }
};

export const setToDoPosts = (posts) =>({
    type:'SET_TO_DO_POSTS',
    posts
})

export const getToDoPostsFromDatabase = () =>{
    return (dispatch)=>{
        return database.ref('toDoPosts').once('value').then((allToDoPosts)=>{
            const toDoPostsArray = [];
            allToDoPosts.forEach((singlePost)=>{
                    const reviewsArray=[];
                    if(!!singlePost.val().reviews){
                        const reviews = singlePost.val().reviews;
                        for (var singleReview in reviews) {
                            if (reviews.hasOwnProperty(singleReview)) {
                                reviews[singleReview] = {
                                    ...reviews[singleReview],
                                    reviewId:singleReview
                                }
                                reviewsArray.push(reviews[singleReview]);
                            }
                        }
                    }
                    const modifiedPost = {
                        ...singlePost.val(),
                        toDoPostId:singlePost.key,
                        creationDate:moment(singlePost.val().creationDate*1000),
                        reviews:reviewsArray
                    }
                    toDoPostsArray.push(modifiedPost);
                });
                dispatch(setToDoPosts(toDoPostsArray));
        });
    };
};

export const addRatingToPost = (postId,review)=>({
    type:'ADD_RATING_TO_POST',
    postId,
    review
});

export const addRatingToDatabasePost = (postId, review)=>{
    return(dispatch)=>{
        return database.ref(`toDoPosts/${postId}/reviews`).push(review).then((ref)=>{
            const reviewWithId={
                ...review,
                reviewId:ref.key
            }
            dispatch(addRatingToPost(postId,reviewWithId));
        });
    }
};

export const deleteRatingFromPost = (postId,reviewId)=>({
    type:'DELETE_RATING_FROM_POST',
    postId,
    reviewId
});

export const deleteRatingFromDatabasePost = (postId, reviewId)=>{
    return (dispatch)=>{
        return database.ref(`toDoPosts/${postId}/reviews/${reviewId}`).remove().then(()=>{
            dispatch(deleteRatingFromPost(postId,reviewId));
        });
    }
};

export const increaseRatingsPositive = (postId)=>({
    type:'INCREASE_RATINGS_POSITIVE',
    postId
});

export const changeRatingsSum=(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive) =>({
    type:'CHANGE_RATINGS_SUM',
    postId,
    positiveOrNegative,
    addOrSubstract,
    swapPositiveToNegative,
    swapNegativeToPositive
});

export const changeRatingsSumInDatabase = (postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive) =>{
    return(dispatch)=>{
        // console.log('changeRatingsSum');
        // console.log('positiveOrNegative',positiveOrNegative);
        // console.log('addOrSubtract',addOrSubstract);
        // console.log('postId',postId);
        if(swapPositiveToNegative==true){
            return database.ref(`toDoPosts/${postId}/ratingsNegative`).transaction(function(currentRating) {
                return currentRating + 1;
            }).then(()=>{
                database.ref(`toDoPosts/${postId}/ratingsPositive`).transaction(function(currentRating) {
                    return currentRating - 1;
                }).then(()=>{
                    dispatch(changeRatingsSum(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive));
                });
            });
        }else if (swapNegativeToPositive==true){
            return database.ref(`toDoPosts/${postId}/ratingsNegative`).transaction(function(currentRating) {
                return currentRating - 1;
            }).then(()=>{
                database.ref(`toDoPosts/${postId}/ratingsPositive`).transaction(function(currentRating) {
                    return currentRating + 1;
                }).then(()=>{
                    dispatch(changeRatingsSum(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive));
                });
            });
        }else if(swapPositiveToNegative==false && swapNegativeToPositive==false){
            if(positiveOrNegative=='POSITIVE'){

                if(addOrSubstract=='ADD') 
                    return database.ref(`toDoPosts/${postId}/ratingsPositive`).transaction(function(currentRating) {
                        return currentRating + 1;
                    }).then(()=>{
                        dispatch(changeRatingsSum(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive));
                    }) 
                else{
                    return database.ref(`toDoPosts/${postId}/ratingsPositive`).transaction(function(currentRating) {
                        return currentRating - 1;
                    }).then(()=>{
                        dispatch(changeRatingsSum(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive));
                    });
                }     
            }else{
                if(addOrSubstract=='ADD'){
                    return database.ref(`toDoPosts/${postId}/ratingsNegative`).transaction(function(currentRating) {
                        return currentRating + 1;
                    }).then(()=>{
                        dispatch(changeRatingsSum(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive));
                    }) 
                } 
                else{
                    return database.ref(`toDoPosts/${postId}/ratingsNegative`).transaction(function(currentRating) {
                        return currentRating - 1;
                    }).then(()=>{
                        dispatch(changeRatingsSum(postId,positiveOrNegative,addOrSubstract,swapPositiveToNegative,swapNegativeToPositive));
                    });
                }
                

            }
        }
       
    }
}
        
    


export const updateRatingOfPost = (postId,reviewId,newRating)=>({
    type:'UPDATE_RATING_OF_POST',
    postId,
    reviewId,
    newRating
});

export const updateRatingOfPostInDatabase = (postId,reviewId,newRating) =>{
    return (dispatch)=>{
        return database.ref(`toDoPosts/${postId}/reviews/${reviewId}`).update({liked:newRating}).then(()=>{
            dispatch(updateRatingOfPost(postId,reviewId,newRating));
        });
    };
};