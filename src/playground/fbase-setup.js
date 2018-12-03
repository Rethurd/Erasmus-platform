import * as firebase from 'firebase';

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);
const database = firebase.database();

database.ref().set({ 
    someDataLabel:'some data',
    someNumberLabel:55
}).then(()=>{
    console.log('Data is saved!');
}).catch((error)=>{
    console.log('This failed',error);
});



















// const expenses = [{
//     description:'asd',
//     note:'',
//     amount:0,
//     createdAt:2
// },{
//     description:'bbb',
//     note:'',
//     amount:0,
//     createdAt:2
// },{
//     description:'ddd',
//     note:'',
//     amount:0,
//     createdAt:2
// }]


// //child_removed - a subsriber that listens - does something every time a child is removed
// database.ref('expenses').on('child_removed',(snapshot)=>{
//     console.log(snapshot.key,snapshot.val());
// });

// //child_changed 
// database.ref('expenses').on('child_changed',(snapshot)=>{
//     console.log(snapshot.key,snapshot.val());
// });

// //child_added
// database.ref('expenses').on('child_added',(snapshot)=>{
//     console.log(snapshot.key,snapshot.val());
    
// });


// database.ref('expenses').on('value',(snapshot)=>{
    
//         const expenses = [];
//         snapshot.forEach((childSnapshot)=>{
//             expenses.push({
//                 id:childSnapshot.key,
//                 ...childSnapshot.val()
//             })
//         });
//         console.log(expenses);
//     });



// database.ref('expenses').push(expenses[0]);
// database.ref('expenses').push(expenses[1]);
// database.ref('expenses').push(expenses[2]);
// database.ref('notes').remove();





// database.ref('notes/-LRm6M6GSos4O9q9Iy7-').remove();

// database.ref('notes').push({
//     title:'Course topics',
//     body:'Mathematics, Physics, Chemistry'
// });

// database.ref().on('value',(snapshot)=>{
//     console.log(snapshot.val().name,' is a ',snapshot.val().job.title,' at ',snapshot.val().job.company,'.');
// });

// setTimeout(()=>{
// database.ref('name').set('Monika');
// },3500)

// database.ref('location/city')
// .once('value')
// .then((snapshot)=>{
//     const val = snapshot.val();
//     console.log(val);
// }).catch((error)=>{
//     console.log('fetching data error: ',error);
// });

// database.ref().set({ 
//     name:'Kamil Grzegorek',
//     age:22,
//     stressLevel:9,
//     job:{
//         title:'Student',
//         company:'SGGW'
//     },
//     isSingle:false,
//     location:{
//         city:"Warsaw",
//         country:"Poland"
//     }
// }).then(()=>{
//     console.log('Data is saved!');
// }).catch((error)=>{
//     console.log('This failed',error);
// });

// database.ref().update({
//     stressLevel:8,
//     'job/company':'Apple',
//     'location/city':'Pułtusk'
// });

// database.ref('isSingle')
//     .remove().then(()=>{
//         console.log('isSingle removed');
//     }).catch(()=>{
//         console.log('did not remove isSingle');
//     });

// database.ref('isSingle').set(null);