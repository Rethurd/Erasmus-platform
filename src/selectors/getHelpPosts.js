import moment from 'moment';

const getHelpPosts = (state) => {
    
    return state.sort((a,b)=>{
        
        if(moment(a.dateUpdated).isBefore(moment(b.dateUpdated))){
            return 1;
        }
        if(moment(a.dateUpdated).isAfter(moment(b.dateUpdated))){
            return -1;
        }
        return 0;
    });
}
export default getHelpPosts;