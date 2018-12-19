import database from '../firebase/firebase';
import moment from 'moment';
import {isEmpty, arrayToObject} from '../resources/functions';


export const addToDoPost = (toDoPostData) =>({
    type:'ADD_TO_DO_POST',
    toDoPostData
});