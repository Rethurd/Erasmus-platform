import {createStore, combineReducers} from 'redux';
import uuid from 'uuid';

//Expenses Reducer
const addExpense = (
        {
            description='',
            note='',
            amount=0,
            createdAt=0
        } = {}
    ) => ({
    type:'ADD_EXPENSE',
    expense:{
        id:uuid(),
        description,
        note,
        amount,
        createdAt
    }
})

const removeExpense = ({id}={}) =>({
    type:'REMOVE_EXPENSE',
    id
});

const editExpense = (id, updates) =>({
    type:'EDIT_EXPENSE',
    id,
    updates
});


const expensesReducerDefaultState=[];

const expensesReducer = (state = expensesReducerDefaultState,action)=>{

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
        
        default:
            return state;
    }
};

const setTextFilter = (text='') =>({
    type:'SET_TEXT_FILTER',
    text
});

const sortByAmount = () =>({
    type:'SORT_BY_AMOUNT'
})
const sortByDate = () =>({
    type:'SORT_BY_DATE'
})

const setStartDate = (startDate=undefined) => ({  // no need to write the =undefined but doesnt matters
    type:'SET_START_DATE',
    startDate
});
const setEndDate = (endDate=undefined) => ({
    type:'SET_END_DATE',
    endDate
});

//Filters Reducer
const filtersReducerDefaultState={
    text:'',
    sortBy:'date',
    startDate:undefined,
    endDate:undefined
}

const filtersReducer = (state = filtersReducerDefaultState,action)=>{
    switch(action.type){
        case 'SET_TEXT_FILTER':
        return{
          ...state,
          text:action.text  
        };
        case 'SORT_BY_DATE':
            return{
                ...state,
                sortBy:'date'
            }
        case 'SORT_BY_AMOUNT':
            return{
                ...state,
                sortBy:'amount'
            }
        case 'SET_START_DATE':
            return{
                ...state,
                startDate:action.startDate
            }
        case 'SET_END_DATE':
            return{
                ...state,
                endDate:action.endDate
            }
        default:
            return state;
    }
}

//timestamps (miliseconds)
// January 1st 1970 (unix epoch) = 0
//33400 - 33.4 seconds after january 1st 1970

// Get visible expenses
const getVisibleExpenses = (expenses,{text,sortBy,startDate,endDate}) =>{
    return expenses.filter((expense)=>{
        const startDateMatch= typeof startDate!== 'number' || expense.createdAt>=startDate;   //will always be true for non-numbers, if it was made at 10 and startDate is 1, it good
        const endDateMatch = typeof endDate!== 'number' || expense.createdAt <=endDate;     // if it was made at 10 and endDate is 50, its good
       
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
}

//Store creation

const store = createStore(combineReducers({
        expenses:expensesReducer,
        filters:filtersReducer
    })
);
store.subscribe(()=>{
    const state = store.getState();
    const visibleExpenses = getVisibleExpenses(state.expenses,state.filters);
    console.log(visibleExpenses);
})
// it runs through both reducers, but filters just returns the state without any changes

const expenseOne = store.dispatch(addExpense({description:'Rent',amount:1000,createdAt:-21000})); 
const expenseTwo = store.dispatch(addExpense({description:'Coffee',amount:300,createdAt:-1000})); 

store.dispatch(sortByAmount());
// store.dispatch(removeExpense({id:expenseOne.expense.id}));

// store.dispatch(editExpense(expenseTwo.expense.id,{amount:500}));
// store.dispatch(setTextFilter('rent'));
// store.dispatch(setTextFilter());

// store.dispatch(sortByAmount());
// store.dispatch(sortByDate());

// store.dispatch(setStartDate(-2000));  // 125
store.dispatch(setTextFilter('COfF'));
// store.dispatch(setStartDate());     // undefined
// store.dispatch(setEndDate(1250));     


const demoState = {
    expenses:[{
        id:'pasodas',
        description:  'January Rent',
        note:'This was the final payment for that address',
        amount: 54500,
        createdAt:0
    }],
    filters:{
        text:'rent',
        sortBy:'amount', // date or amount
        startDate: undefined,
        endDate: undefined
    }
};
