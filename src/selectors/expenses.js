import moment from 'moment';

export default  (expenses,{text,sortBy,startDate,endDate}) =>{
    return expenses.filter((expense)=>{
        const createdAtMoment = moment(expense.createdAt);
        const startDateMatch= startDate ? startDate.isSameOrBefore(createdAtMoment,'day') : true   //will always be true for non-numbers, if it was made at 10 and startDate is 1, it good
        const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment,'day') : true    // if it was made at 10 and endDate is 50, its good
       
        const textMatch = expense.description.toLowerCase().includes(text.toLowerCase());

        return startDateMatch && endDateMatch && textMatch;
    }).sort((a,b)=>{  // od najpozniejszych do najwczesniejszych
        if(sortBy==='date'){
            return a.createdAt<b.createdAt ? 1 : -1; // -21<-1
        }
        if(sortBy==='amount'){
            return a.amount<b.amount ? 1 : -1;
        }

    })
};
