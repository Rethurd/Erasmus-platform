const expensesReducerDefaultState=[];

export default (state = expensesReducerDefaultState,action)=>{ //action is the FUNCTION

    switch(action.type){
        case 'ADD_EXPENSE':
            return [...state,action.expense];
        case 'REMOVE_EXPENSE':
            return state.filter((expense)=> expense.id!=action.id); // returns a NEW array instead of changing from old 
        case 'EDIT_EXPENSE':
            return state.map((expense)=>{
                if(expense.id===action.id){
                    return{
                        ...expense, 
                        ...action.updates //override the ones that were passed
                    }
                }else{
                    return expense; // no change (dont have to write the else at all)
                }
            });
        case 'SET_EXPENSES':
            return action.expenses;
        default:
            return state;
    }
};
