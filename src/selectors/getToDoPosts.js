import moment from 'moment';

const getToDoPosts = (state,sortBy) => {
    if(sortBy=='date'){
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
    else if(sortBy=='rating'){
        return state.sort((a,b)=>{
            if(a.ratingsPositive>b.ratingsPositive){
                return -1;
            }
            if(a.ratingsPositive<b.ratingsPositive){
                return 1;
            }
            else{
                if(a.ratingsNegative<b.ratingsNegative){
                    return -1;
                }
                if(a.ratingsNegative>b.ratingsNegative){
                    return 1;
                }
                return 0;
            }
            
        });
    }
}
 
export default getToDoPosts;