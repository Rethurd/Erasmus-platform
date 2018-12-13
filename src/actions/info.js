import database from '../firebase/firebase';
import moment from 'moment';

export const addInfoPost = (postData) =>({
    type:'ADD_INFO_POST',
    postData
});

export const addInfoPostToDatabase = (postData)=>{
    return (dispatch)=>{
        //format the data
        postData.creationDate=postData.creationDate.unix();
        return database.ref('infoPosts').push(postData).then((ref)=>{
            const infoPostLocalFormat = {
                ...postData,
                infoPostId:ref.key,
                creationDate:moment(postData.creationDate*1000),
            }
            dispatch(addInfoPost(infoPostLocalFormat));
        })
    }
}

export const deleteInfoPost = (infoPostId)=>({
    type:'DELETE_INFO_POST',
    infoPostId
})

export const deleteInfoPostFromDatabase = (infoPostId)=>{
    return (dispatch) =>{
        return database.ref(`infoPosts/${infoPostId}`).remove().then(()=>{  
            dispatch(deleteInfoPost(infoPostId));
        })
    }
}

export const setInfoPosts = (posts) =>({
    type:'SET_INFO_POSTS',
    posts
})

export const getInfoPostsFromDatabase = () =>{
    return (dispatch)=>{
        return database.ref('infoPosts').once('value').then((allInfoPosts)=>{
            const infoPostsArray = [];
            allInfoPosts.forEach((singlePost)=>{
                    const modifiedPost = {
                        ...singlePost.val(),
                        infoPostId:singlePost.key,
                        creationDate:moment(singlePost.val().creationDate*1000),
                    }
                    console.log(modifiedPost);
                    infoPostsArray.push(modifiedPost);
                });
                dispatch(setInfoPosts(infoPostsArray));
        });
    };
};
