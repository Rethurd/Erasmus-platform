import React from 'react';

const defaultInfoPostsState = [];
const InfoPostsReducer = (state = defaultInfoPostsState,action) => {
    switch(action.type){
        case 'ADD_INFO_POST':
            return [...state,action.postData];
        case 'DELETE_INFO_POST':
            const newStateDelete = state.filter((singlePost)=>singlePost.infoPostId!=action.infoPostId);
            return newStateDelete;
        case 'SET_INFO_POSTS':
            const newState = [];
            action.posts.forEach((post)=>{
                newState.push(post);
            })
            return newState;
        case 'EDIT_INFO_POST':
            const uneditedInfoPosts = state.filter((singlePost)=> singlePost.infoPostId!=action.postData.infoPostId);
            const infoPostToEdit = {
                ...action.postData
            };
            uneditedInfoPosts.push(infoPostToEdit);
            return uneditedInfoPosts;
            
        default: 
            return state;
    }
}
 
export default InfoPostsReducer;