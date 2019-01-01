import {firebase,googleAuthProvider} from '../firebase/firebase';

export const login = (uid)=>({
    type:'LOGIN',
    uid
});

export const startLogin = () =>{
    return () =>{
        return firebase.auth().signInWithPopup(googleAuthProvider).then(()=>{
            console.log('123');
            window.location.reload(); //workaround to calendar rendering the same events AGAIN after relog
            
        });
    };
};

export const logout =()=>({
    type:'LOGOUT'
});

export const startLogout = () =>{
    // return ()=>{
    firebase.auth().signOut();
    // };
};

