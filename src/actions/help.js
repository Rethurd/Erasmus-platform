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
            console.log(eventLocalFormat);
            dispatch(addPost(eventLocalFormat));
        })
    }
}

export const addPost = (postData) =>({
    type:'ADD_POST',
    postData

})

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