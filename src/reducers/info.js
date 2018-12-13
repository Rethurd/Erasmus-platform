import React from 'react';

const defaultInfoPostsState = [];
const InfoPostsReducer = (state = defaultInfoPostsState,action) => {
    switch(action.type){
        case 'ADD_INFO_POST':
            return [...state,action.postData];
        default: 
            return state;
    }
}
 
export default InfoPostsReducer;