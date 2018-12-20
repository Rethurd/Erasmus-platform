import database from '../firebase/firebase';
import moment from 'moment';


export const addToDoPost = (toDoPostData) =>({
    type:'ADD_TO_DO_POST',
    toDoPostData
});

export const addToDoPostToDatabase = (toDoPostData) =>{

    return (dispatch)=>{
        toDoPostData.creationDate = toDoPostData.creationDate.unix();
        return database.ref('toDoPosts').push(toDoPostData).then((ref)=>{
            const postModified = {
                ...toDoPostData,
                toDoPostId:ref.key,
                creationDate:moment(toDoPostData.creationDate*1000)
            }
            dispatch(addToDoPost(postModified));
        });
    }
};