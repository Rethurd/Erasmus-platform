
const selectExpensesTotal = (expenses) =>{

    if(!expenses || expenses.length==0){
        return 0;
    }
    else{
        const expensesAmounts = expenses.map((expense)=>expense.amount);
        return expensesAmounts.reduce((prevVal,currentVal)=> prevVal+currentVal); 
    }
}

export default selectExpensesTotal;