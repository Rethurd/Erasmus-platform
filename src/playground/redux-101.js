import {createStore} from 'redux';


const add = ({a,b},c) =>{   //destructuring
    return a+b+c;
}

console.log(add({a:1,b:12},100));

// Action-generators - functions that return action objects
const incrementCount = ({incrementBy=1}={}) =>({
    type:'INCREMENT',
    incrementBy
});
            
const decrementCount = ({decrementBy=1} = {} ) => ({
    type:'DECREMENT',
    decrementBy
});

const setCount = ({count}) =>({
    type:'SET',
    count
});

const resetCount = ()=>({
    type:'RESET'
});

//Reducers
//1. Reducers are pure functions: output determined by the input, cannot interact with anything outside its scope 
//2. Never change state or action directly

let a=10;
const add = (b)=>{
    return a+b; // not a pure function because it takes 'a' from outside itself
}

const countReducer = (state = {count:0},action)=>{
    switch(action.type){
        case 'INCREMENT':
            return {
                count:state.count+action.incrementBy
            };
        case 'DECREMENT':
            return {count:state.count-action.decrementBy};
        case 'RESET':
            return {count:0};
        case 'SET':
            return{ count:action.count};
        default:
            return state;
    };
}

const store = createStore(countReducer);

const unsubscribe = store.subscribe(()=>{
    console.log(store.getState());
})

// store.dispatch({
//     type:'INCREMENT',
//     incrementBy:5
// });
store.dispatch(incrementCount({incrementBy:5}));


store.dispatch(decrementCount());
store.dispatch(decrementCount({decrementBy:10}));
store.dispatch(setCount({count:'asd'})); // this way you can pass a string?

store.dispatch(setCount({count:100}));
store.dispatch(resetCount());


// Actions - object that gets sent to the store, such as:
// walk, stop_walking, sit, work, stop_working...
