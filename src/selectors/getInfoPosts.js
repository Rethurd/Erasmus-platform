import moment from 'moment';

const getInfoPosts = (state) => {
    
    return state.sort((a,b)=>{
        
        if(moment(a.creationDate).isBefore(moment(b.creationDate))){
            return 1;
        }
        if(moment(a.creationDate).isAfter(moment(b.creationDate))){
            return -1;
        }
        return 0;
    });
}
export default getInfoPosts;