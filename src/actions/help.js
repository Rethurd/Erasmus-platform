import database from '../firebase/firebase';
import moment from 'moment';
import {isEmpty,arrayToObject} from '../resources/functions';

export const addPostToDatabase = (postData)=>{
    return (dispatch)=>{
        //format the data
        postData.datePosted=postData.datePosted.unix();
        postData.dateUpdated=postData.dateUpdated.unix();
        const commentsObject = arrayToObject(postData.comments, "participantId");
        postData.comments=commentsObject;
        return database.ref('helpPosts').push(postData).then((ref)=>{
            const eventLocalFormat = {
                ...postData,
                postId:ref.key,
                datePosted:moment(postData.datePosted*1000),
                dateUpdated:moment(postData.dateUpdated*1000),
                comments:[]
            }
            dispatch(addPost(eventLocalFormat));
        })
    }
}

export const addPost = (postData) =>({
    type:'ADD_POST',
    postData

});

export const deletePost = (helpPostId)=>({
    type:'DELETE_POST',
    helpPostId
})

export const deletePostFromDatabase = (helpPostId)=>{
    return (dispatch) =>{
        return database.ref(`helpPosts/${helpPostId}`).remove().then(()=>{
            dispatch(deletePost(helpPostId));
        })
    }
}

export const editPost = (postData)=>({
    type:'EDIT_POST',
    postData
});

export const editPostInDatabase = (postData)=>{
    return (dispatch)=>{
        const unchangedPostData = Object.assign({},postData); 
        const thisPostId = postData.postId;
        postData.datePosted=postData.datePosted.unix();
        postData.dateUpdated=postData.dateUpdated.unix();
        const commentsObject = arrayToObject(postData.comments, "commentId");
        postData.comments=commentsObject;
        const {postId, ...postDataToSave} = postData;
        return database.ref(`helpPosts/${thisPostId}`).update(postDataToSave).then(()=>{
            dispatch(editPost(unchangedPostData));
        })
    }
}

export const setHelpPosts = (posts) =>({
    type:'SET_HELP_POSTS',
    posts
})

export const getHelpPostsFromDatabase = () =>{
    return (dispatch)=>{
        return database.ref('helpPosts').once('value').then((allPosts)=>{
            const helpPostsArray = [];

            allPosts.forEach((singlePost)=>{
                const commentsArray=[];
                if(!!singlePost.val().comments){
                    const comments = singlePost.val().comments;
                    for (var singleComment in comments) {
                        if (comments.hasOwnProperty(singleComment)) {
                            comments[singleComment] = {
                                ...comments[singleComment],
                                commentId:singleComment
                            }
                            commentsArray.push(comments[singleComment]);
                        }
                    }
                }
                    const modifiedPost = {
                        ...singlePost.val(),
                        postId:singlePost.key,
                        comments:commentsArray,
                        datePosted:moment(singlePost.val().datePosted*1000),
                        dateUpdated:moment(singlePost.val().dateUpdated*1000)

                    }
                    helpPostsArray.push(modifiedPost);
                });
                
                dispatch(setHelpPosts(helpPostsArray));
            
        });
    };
};

export const addComment = (helpPostId,comment) =>({
    type:'ADD_COMMENT',
    helpPostId,
    comment
    
});

export const addCommentToDatabase = (helpPostId, comment)=>{
    return (dispatch)=>{
        comment.date = comment.date.unix();
        return database.ref(`helpPosts/${helpPostId}/comments`).push(comment).then((ref)=>{
            const modifiedComment = {
                ...comment,
                date:comment.date,
                commentId:ref.key
            }
            dispatch(addComment(helpPostId, modifiedComment));
        });
    };
};

export const deleteComment = (helpPostId, commentId)=>({
    type:'DELETE_COMMENT',
    helpPostId,
    commentId
});

export const deleteCommentFromDatabase = (helpPostId, commentId)=>{
    return (dispatch)=>{
        return database.ref(`helpPosts/${helpPostId}/comments/${commentId}`).remove().then(()=>{
            dispatch(deleteComment(helpPostId,commentId));
        });
    };
};