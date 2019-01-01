import React from 'react';
import {connect} from 'react-redux';
import {startLogin} from '../actions/auth';
import Modal from 'react-modal'
import database, {firebase} from '../firebase/firebase';

export class LoginPage extends React.Component{

    constructor(props){
        super(props)
        this.state={
            isModalOpen:false,
            email:'',
            fname:'',
            lname:'',
            password:'',
            fnameEmptyError:undefined,
            lnameEmptyError:undefined,
            isRegisterForm:false,
            registerError:undefined,
            loginError:undefined
        }
    }

     openModal = () =>{
        this.setState(()=>({isModalOpen:true}));
    };

     closeModal = () =>{
        this.setState(()=>({isModalOpen:false}));
    }

    handleEmailChange = (e)=>{
        const email = e.target.value;
        this.setState(()=>({email}));
    }
    handleLnameChange = (e)=>{
        const lname = e.target.value;
        this.setState(()=>({lname}));
    }
    handleFnameChange = (e)=>{
        const fname = e.target.value;
        this.setState(()=>({fname}));
    }
    handlePasswordChange = (e)=>{
        const password = e.target.value;
        console.log(password);
        this.setState(()=>({password}));
    }

    
    handleLoginRequest = (e) =>{
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(()=>{
            window.location.reload();
    //
        }).catch((error)=>{
            this.setState(()=>({loginError:error.message}));
        })
    }

    handleShowRegisterForm = ()=>{
        console.log('show register form');
        this.setState(()=>({isRegisterForm:true,email:'',password:''}));
    }

    handleShowLoginForm = ()=>{
        this.setState(()=>({isRegisterForm:false,email:'',password:''}));
    }

    handleRegisterRequest = (e) =>{
        e.preventDefault();
        if(this.state.fname==''){
            this.setState(()=>({fnameEmptyError:'The "first name" field cannot be empty!'}));
        }else{
            this.setState(()=>({fnameEmptyError:undefined}));
        }
        if(this.state.lname==''){
            this.setState(()=>({lnameEmptyError:'The "last name" field cannot be empty!'}));
        }else{
            this.setState(()=>({lnameEmptyError:undefined}));
        }
        if (this.state.fname!='' && this.state.lname!=''){
            firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then((user)=>{
                const displayName=this.state.fname+' '+this.state.lname;
                user.updateProfile({displayName}).then(()=>{
                    //add user to userList in the DB
                    const userObj = {
                        userId:user.uid,
                        userName:user.displayName,
                        userEmail:user.email,
                    }
                    database.ref(`users/${user.uid}`).set(userObj);
                    window.location.reload();

                });
            }).catch((error)=>{
                this.setState(()=>({registerError:error.message}));
            });
        }
        
    }

    render(){
        return(
            <div>
                <button onClick={this.props.startLogin}>Login using Google</button>
                <button onClick={this.openModal}>Login using Email/password</button>
                <Modal
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Login form"
                    ariaHideApp={false}
                 >
                
                {this.state.isRegisterForm ? 
                <div>
                    <p> Register a new account! </p>
                    <form onSubmit={this.handleRegisterRequest}>
                        <div>
                            <p>Account email:</p>
                            <input type='text' value={this.state.email} onChange={this.handleEmailChange}/>

                        </div>
                        <div>
                            <p>First name:</p>
                            {this.state.fnameEmptyError== undefined ? null : this.state.fnameEmptyError}
                            <input type='text' value={this.state.fname} onChange={this.handleFnameChange}/>

                        </div>
                        <div>
                            <p>Last name:</p>
                            {this.state.lnameEmptyError== undefined ? null : this.state.lnameEmptyError}
                            <input type='text' value={this.state.lname} onChange={this.handleLnameChange}/>

                        </div>
                        <div>
                            <p>Password:</p>
                            <input type='password' value={this.state.password} onChange={this.handlePasswordChange}/>
                        </div>

                        {this.state.registerError==undefined ? null : <p>{this.state.registerError}</p> }

                        <button>Register</button>
                    </form>
                    <button onClick={this.handleShowLoginForm}>Already have an account? Click to email!</button>
                </div>
                 : 
                 <div>
                    <p> Login using Email/password! </p>
                    <form onSubmit={this.handleLoginRequest}>
                       <div>
                            <p>Account email:</p>
                            <input type='text' value={this.state.email} onChange={this.handleEmailChange}/>

                        </div>
                        
                        <div>
                            <p>Password:</p>
                            <input type='password' value={this.state.password} onChange={this.handlePasswordChange}/>
                        </div>
                        {this.state.loginError==undefined ? null : <p>{this.state.loginError}</p> }
                        <button>Login</button>
                    </form>
                    <button onClick={this.handleShowRegisterForm}>No account yet? Click to register!</button>
                 </div>
                 }
                
            </Modal>
            </div>
            
        )
    
    }
}

const mapDispatchToProps = (dispatch)=>({
    startLogin: ()=>dispatch(startLogin())
});

export default connect (undefined,mapDispatchToProps)(LoginPage);