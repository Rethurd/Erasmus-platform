import React from 'react';
import {connect} from 'react-redux';
import {startLogin} from '../actions/auth';
import Modal from 'react-modal'
import database, {firebase} from '../firebase/firebase';
import classNames from 'classnames';
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
            <div style={{ 'marginBottom':'200px' }} >
                <div className="loginPage__loginBox">
                    <h3>Login:</h3>
                    <div className="loginPage__buttons">
                        <button className={classNames("btn")} onClick={this.props.startLogin}><span>Login using Google</span><span><i className={classNames("fab","fa-google")}></i></span></button>
                        <button className={classNames("btn")} onClick={this.openModal}><span>Login using Email/password </span><span><i className={classNames("fas","fa-at")}></i></span></button>
                    </div>
                </div>
                
                
                <Modal
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Login form"
                    ariaHideApp={false}
                    className="loginModal"
                 >
                
                {this.state.isRegisterForm ? 
                <div className="register__container">
                    <div className="login__header"> Register a new account! </div>
                    <form onSubmit={this.handleRegisterRequest} className="register__form">
                        <div className="login__input--register">
                            <p>Account email:</p>
                            <input type='text' className="form-control" value={this.state.email} onChange={this.handleEmailChange}/>

                        </div>
                        {this.state.fnameEmptyError== undefined ? null : <div className="error__message--login">{this.state.fnameEmptyError}</div>}
                        <div className="login__input--register">
                            <p>First name:</p>
                            <input type='text' className="form-control" value={this.state.fname} onChange={this.handleFnameChange}/>

                        </div>
                        {this.state.lnameEmptyError== undefined ? null : <div className="error__message--login">{this.state.lnameEmptyError}</div>}

                        <div className="login__input--register">
                            <p>Last name:</p>
                            <input type='text' className="form-control" value={this.state.lname} onChange={this.handleLnameChange}/>

                        </div>
                        <div className="login__input--register">
                            <p>Password:</p>
                            <input type='password' className="form-control" value={this.state.password} onChange={this.handlePasswordChange}/>
                        </div>

                        {this.state.registerError==undefined ? null : <div className="error__message--login">{this.state.registerError}</div> }

                        <div className="text-center">
                            <button className={classNames("btn","btn--login")}>Register</button>
                        </div>
                    </form>
                    <div className="login__noAccount" onClick={this.handleShowLoginForm}>Already have an account? Click to login!</div>
                </div>
                 : 
                 <div className="login__container">
                    <div className="login__header"> Login using Email/password! </div>
                    <form onSubmit={this.handleLoginRequest} className="login__form">
                       <div className="login__input">
                            <p>Account email:</p>
                            <input type='text' className="form-control" value={this.state.email} onChange={this.handleEmailChange}/>

                        </div>
                        
                        <div className="login__input">
                            <p>Password:</p>
                            <input type='password' className="form-control" value={this.state.password} onChange={this.handlePasswordChange}/>
                        </div>
                        {this.state.loginError==undefined ? null : <p className="error__message--login">{this.state.loginError}</p> }
                        <div className="text-center">
                            <button className={classNames("btn","btn--login")}>Login</button>
                        </div>
                    </form>
                    <div className="login__noAccount" onClick={this.handleShowRegisterForm}>No account yet? Click to register!</div>
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