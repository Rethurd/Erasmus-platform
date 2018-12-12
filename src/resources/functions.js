export const arrayToObject = (array, keyField) =>
   array.reduce((obj, item) => {
     obj[item[keyField]] = item
     return obj
   }, {});

export const isEmpty = (obj) =>{
    for(let singleParticipant in obj) {
        if(obj.hasOwnProperty(singleParticipant))
            return false;
    }
    return true;
};