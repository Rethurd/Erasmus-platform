// const person = {
    
//     age:22,
//     location:{
//         city:'Warsaw',
//         temp:5
//     }
// }

// const {name:firstName='Anonymous',age} = person;
// // const name = person.name;
// // const age = person.age;

// console.log(`${firstName} is ${age} year(s) old.`);

// const{city,temp: temperature} = person.location;

// if(city && temperature)
//     console.log(`It's ${temperature} in ${city}`);


// const book = {
//     title:'Ego is the enemy',
//     author:'Ryan Holiday',
//     publisher:{
//         name:'Penguin'
//     }

// }
// const {name:publisherName = 'Self-Published'} = book.publisher;
// console.log(publisherName);



// Array destructuring

const address=['1299 S Juniper Street','Philadelphia','Pennsilvania','19147'];

const [,city,state='New York'] = address;

console.log(`You are in ${city} ${state}.`);

const menu = ['Coffee (hot)','$2.00','$2.50','$2.75'];
const [drink, ,mediumPrice] = menu;
console.log(`A medium ${drink} costs ${mediumPrice}`);