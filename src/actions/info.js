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
                postId:ref.key,
                creationDate:moment(postData.creationDate*1000),
            }
            dispatch(addInfoPost(infoPostLocalFormat));
        })
    }
}
